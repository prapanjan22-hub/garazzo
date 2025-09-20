const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Identification
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Participants
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  
  // Service Details
  serviceType: {
    type: String,
    enum: [
      'general_service',
      'repair',
      'inspection',
      'emergency',
      'maintenance',
      'diagnostic',
      'tire_service',
      'battery_service',
      'ac_service',
      'other'
    ],
    required: true
  },
  serviceCategory: {
    type: String,
    enum: ['preventive', 'corrective', 'emergency', 'inspection'],
    required: true
  },
  
  // Service Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String, // e.g., "09:00", "14:30"
    required: true
  },
  timeSlot: {
    start: String,
    end: String
  },
  
  // Location
  serviceLocation: {
    type: {
      type: String,
      enum: ['customer_location', 'garage_location', 'mobile_service'],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
      }
    }
  },
  
  // Status and Progress
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'rescheduled',
      'disputed'
    ],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Payment Information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking', 'wallet'],
      default: 'card'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },
  
  // Service Execution
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number, // in minutes
  actualCost: Number,
  
  // Service Details
  workPerformed: [{
    item: String,
    description: String,
    cost: Number,
    quantity: Number,
    unit: String
  }],
  
  // Parts Used
  partsUsed: [{
    name: String,
    partNumber: String,
    quantity: Number,
    unitCost: Number,
    totalCost: Number,
    warranty: String
  }],
  
  // Documentation
  beforePhotos: [String], // URLs to photos
  afterPhotos: [String], // URLs to photos
  documents: [{
    type: String,
    url: String,
    name: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Rating and Review
  rating: {
    customerRating: {
      value: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    serviceProviderRating: {
      value: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  },
  
  // Cancellation
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  },
  
  // Rescheduling
  rescheduleHistory: [{
    previousDate: Date,
    previousTime: String,
    newDate: Date,
    newTime: String,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emergency Information
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyDetails: {
    type: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  },
  
  // Additional Information
  specialInstructions: String,
  estimatedPickupTime: Date,
  actualPickupTime: Date,
  notes: String
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ serviceProvider: 1 });
bookingSchema.index({ vehicle: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ 'serviceLocation.address.coordinates': '2dsphere' });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.bookingId = `GB${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Method to update status
bookingSchema.methods.updateStatus = function(newStatus, updatedBy) {
  this.status = newStatus;
  
  // Update progress based on status
  switch (newStatus) {
    case 'pending':
      this.progress = 0;
      break;
    case 'confirmed':
      this.progress = 10;
      break;
    case 'in_progress':
      this.progress = 50;
      this.actualStartTime = new Date();
      break;
    case 'completed':
      this.progress = 100;
      this.actualEndTime = new Date();
      if (this.actualStartTime) {
        this.actualDuration = Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60));
      }
      break;
    case 'cancelled':
      this.progress = 0;
      break;
  }
  
  return this.save();
};

// Method to add message
bookingSchema.methods.addMessage = function(senderId, message) {
  this.messages.push({
    sender: senderId,
    message: message,
    timestamp: new Date()
  });
  return this.save();
};

// Method to calculate total cost
bookingSchema.methods.calculateTotalCost = function() {
  const workCost = this.workPerformed.reduce((total, work) => total + (work.cost * (work.quantity || 1)), 0);
  const partsCost = this.partsUsed.reduce((total, part) => total + part.totalCost, 0);
  return workCost + partsCost;
};

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  scheduledDateTime.setHours(parseInt(this.scheduledTime.split(':')[0]));
  scheduledDateTime.setMinutes(parseInt(this.scheduledTime.split(':')[1]));
  
  const hoursUntilService = (scheduledDateTime - now) / (1000 * 60 * 60);
  
  return ['pending', 'confirmed'].includes(this.status) && hoursUntilService > 2;
};

module.exports = mongoose.model('Booking', bookingSchema);
