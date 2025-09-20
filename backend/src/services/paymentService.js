const Razorpay = require('razorpay');
const crypto = require('crypto');
const { getPostgresPool } = require('../config/database');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    this.pgPool = getPostgresPool();
  }

  // Create Razorpay order
  async createOrder(amount, currency = 'INR', receipt = null) {
    try {
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await this.razorpay.orders.create(options);
      
      logger.info(`Razorpay order created: ${order.id}`);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      };

    } catch (error) {
      logger.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === signature;
      
      if (isValid) {
        logger.info(`Payment verified successfully: ${paymentId}`);
      } else {
        logger.warn(`Payment verification failed: ${paymentId}`);
      }

      return isValid;

    } catch (error) {
      logger.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Process payment
  async processPayment(paymentData) {
    const client = await this.pgPool.connect();
    try {
      const {
        orderId,
        paymentId,
        signature,
        amount,
        currency,
        bookingId,
        customerId,
        serviceProviderId
      } = paymentData;

      // Verify payment signature
      const isValid = this.verifyPaymentSignature(orderId, paymentId, signature);
      
      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Get payment details from Razorpay
      const payment = await this.razorpay.payments.fetch(paymentId);
      
      // Create payment record
      const paymentRecord = await this.createPaymentRecord({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        amount: payment.amount / 100, // Convert from paise
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        bookingId,
        customerId,
        serviceProviderId,
        paymentData: payment
      });

      // Update booking payment status
      if (bookingId) {
        await this.updateBookingPaymentStatus(bookingId, payment.status, paymentRecord.id);
      }

      return {
        success: true,
        paymentId: paymentRecord.id,
        status: payment.status,
        amount: payment.amount / 100
      };

    } catch (error) {
      logger.error('Error processing payment:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Create payment record in database
  async createPaymentRecord(paymentData) {
    const client = await this.pgPool.connect();
    try {
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount,
        currency,
        status,
        method,
        bookingId,
        customerId,
        serviceProviderId,
        paymentData: razorpayData
      } = paymentData;

      const query = `
        INSERT INTO payments (
          razorpay_order_id, razorpay_payment_id, razorpay_signature,
          amount, currency, status, method, booking_id,
          customer_id, service_provider_id, payment_data, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const values = [
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount,
        currency,
        status,
        method,
        bookingId,
        customerId,
        serviceProviderId,
        JSON.stringify(razorpayData),
        new Date()
      ];

      const result = await client.query(query, values);
      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Update booking payment status
  async updateBookingPaymentStatus(bookingId, paymentStatus, paymentId) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        UPDATE bookings 
        SET 
          payment_status = $1,
          payment_id = $2,
          paid_at = CASE WHEN $1 = 'paid' THEN NOW() ELSE paid_at END,
          updated_at = NOW()
        WHERE id = $3
      `;

      await client.query(query, [paymentStatus, paymentId, bookingId]);

    } finally {
      client.release();
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount = null, reason = 'Refund requested') {
    try {
      const refundData = {
        payment_id: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
        notes: {
          reason: reason
        }
      };

      const refund = await this.razorpay.payments.refund(paymentId, refundData);
      
      // Update payment record
      await this.updatePaymentRefundStatus(paymentId, refund.id, refund.status);

      logger.info(`Refund processed: ${refund.id}`);
      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100
      };

    } catch (error) {
      logger.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }

  // Update payment refund status
  async updatePaymentRefundStatus(paymentId, refundId, refundStatus) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        UPDATE payments 
        SET 
          refund_id = $1,
          refund_status = $2,
          updated_at = NOW()
        WHERE razorpay_payment_id = $3
      `;

      await client.query(query, [refundId, refundStatus, paymentId]);

    } finally {
      client.release();
    }
  }

  // Get payment by ID
  async getPaymentById(paymentId) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        SELECT p.*, b.title as booking_title, b.status as booking_status
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        WHERE p.id = $1
      `;

      const result = await client.query(query, [paymentId]);
      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Get payments by user
  async getPaymentsByUser(userId, limit = 20, offset = 0) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        SELECT p.*, b.title as booking_title, b.status as booking_status
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        WHERE p.customer_id = $1 OR p.service_provider_id = $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await client.query(query, [userId, limit, offset]);
      return result.rows;

    } finally {
      client.release();
    }
  }

  // Get payment statistics
  async getPaymentStats(serviceProviderId = null, startDate = null, endDate = null) {
    const client = await this.pgPool.connect();
    try {
      let whereClause = 'WHERE p.status = $1';
      let params = ['paid'];
      let paramCount = 1;

      if (serviceProviderId) {
        paramCount++;
        whereClause += ` AND p.service_provider_id = $${paramCount}`;
        params.push(serviceProviderId);
      }

      if (startDate) {
        paramCount++;
        whereClause += ` AND p.created_at >= $${paramCount}`;
        params.push(startDate);
      }

      if (endDate) {
        paramCount++;
        whereClause += ` AND p.created_at <= $${paramCount}`;
        params.push(endDate);
      }

      const query = `
        SELECT 
          COUNT(*) as total_payments,
          SUM(p.amount) as total_amount,
          AVG(p.amount) as average_amount,
          COUNT(CASE WHEN p.method = 'card' THEN 1 END) as card_payments,
          COUNT(CASE WHEN p.method = 'upi' THEN 1 END) as upi_payments,
          COUNT(CASE WHEN p.method = 'netbanking' THEN 1 END) as netbanking_payments
        FROM payments p
        ${whereClause}
      `;

      const result = await client.query(query, params);
      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Create subscription payment
  async createSubscriptionPayment(userId, planType, amount) {
    try {
      const order = await this.createOrder(amount, 'INR', `subscription_${userId}_${Date.now()}`);
      
      // Store subscription order
      const client = await this.pgPool.connect();
      try {
        const query = `
          INSERT INTO subscription_orders (
            user_id, plan_type, amount, razorpay_order_id, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

        const result = await client.query(query, [
          userId,
          planType,
          amount,
          order.orderId,
          'pending',
          new Date()
        ]);

        return {
          ...order,
          subscriptionOrderId: result.rows[0].id
        };

      } finally {
        client.release();
      }

    } catch (error) {
      logger.error('Error creating subscription payment:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
