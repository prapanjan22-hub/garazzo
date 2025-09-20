# Garazzo API Documentation

## Base URL
- **Development**: `http://localhost:3001/api`
- **Staging**: `https://staging-api.garazzo.com/api`
- **Production**: `https://api.garazzo.com/api`

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

## Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### POST /auth/logout
Logout user (requires authentication).

---

## User Management

### GET /users/profile
Get current user profile.

### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

### POST /users/upload-avatar
Upload profile picture.

**Request:** Multipart form data with `avatar` file.

---

## Vehicle Management

### GET /vehicles
Get user's vehicles.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

### POST /vehicles
Add new vehicle.

**Request Body:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "vin": "1HGBH41JXMN109186",
  "licensePlate": "ABC123",
  "color": "Silver",
  "fuelType": "petrol",
  "transmission": "automatic"
}
```

### GET /vehicles/:id
Get vehicle details.

### PUT /vehicles/:id
Update vehicle details.

### DELETE /vehicles/:id
Remove vehicle.

### POST /vehicles/:id/upload-photos
Upload vehicle photos.

**Request:** Multipart form data with `photos` files.

---

## Service Provider Management

### GET /mechanics
Get nearby mechanics.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius`: Search radius in km (default: 10)
- `serviceType`: Filter by service type
- `rating`: Minimum rating filter

### GET /garages
Get nearby garages.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius`: Search radius in km (default: 10)
- `serviceType`: Filter by service type
- `rating`: Minimum rating filter

### GET /mechanics/:id
Get mechanic details.

### GET /garages/:id
Get garage details.

### GET /mechanics/:id/reviews
Get mechanic reviews.

### GET /garages/:id/reviews
Get garage reviews.

---

## Booking Management

### POST /bookings
Create new booking.

**Request Body:**
```json
{
  "serviceProviderId": "mechanic_id",
  "vehicleId": "vehicle_id",
  "serviceType": "general_service",
  "title": "Regular Service",
  "description": "Oil change and inspection",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00",
  "serviceLocation": {
    "type": "customer_location",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "coordinates": [40.7128, -74.0060]
    }
  },
  "estimatedCost": 150,
  "specialInstructions": "Please check brakes"
}
```

### GET /bookings
Get user's bookings.

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

### GET /bookings/:id
Get booking details.

### PUT /bookings/:id/status
Update booking status.

**Request Body:**
```json
{
  "status": "in_progress",
  "message": "Service started",
  "progress": 50
}
```

### POST /bookings/:id/cancel
Cancel booking.

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

### POST /bookings/:id/reschedule
Reschedule booking.

**Request Body:**
```json
{
  "newDate": "2024-01-16",
  "newTime": "14:00",
  "reason": "Service provider unavailable"
}
```

---

## Payment Management

### POST /payments/create-order
Create Razorpay order.

**Request Body:**
```json
{
  "amount": 150,
  "currency": "INR",
  "bookingId": "booking_id"
}
```

### POST /payments/verify
Verify payment.

**Request Body:**
```json
{
  "orderId": "order_id",
  "paymentId": "payment_id",
  "signature": "signature"
}
```

### GET /payments
Get payment history.

### POST /payments/refund
Request refund.

**Request Body:**
```json
{
  "paymentId": "payment_id",
  "amount": 100,
  "reason": "Service not satisfactory"
}
```

---

## Emergency Services

### POST /emergency/alert
Send emergency alert.

**Request Body:**
```json
{
  "vehicleId": "vehicle_id",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York"
  },
  "emergencyType": "breakdown",
  "severity": "high",
  "description": "Engine stopped working"
}
```

### GET /emergency/active
Get active emergencies (for service providers).

### POST /emergency/:id/respond
Respond to emergency.

**Request Body:**
```json
{
  "response": "I can help with this emergency",
  "estimatedArrival": "30 minutes"
}
```

---

## Real-time Communication

### WebSocket Events

#### Client to Server Events:
- `join_booking`: Join booking room
- `emergency_request`: Send emergency alert
- `location_update`: Update user location
- `service_status_update`: Update service status
- `chat_message`: Send chat message

#### Server to Client Events:
- `booking_status_update`: Booking status changed
- `new_message`: New chat message
- `emergency_alert`: Emergency notification
- `user_location_update`: User location updated
- `vehicle_data_update`: Vehicle data updated
- `notification`: General notification

---

## IoT Device Integration

### MQTT Topics

#### Vehicle Data:
- `vehicle/{deviceId}/data`: Vehicle telemetry data
- `vehicle/{deviceId}/emergency`: Emergency alerts
- `vehicle/{deviceId}/diagnostic`: Diagnostic data

#### Emergency:
- `emergency/{deviceId}`: Emergency notifications
- `emergency/{emergencyId}/response`: Emergency responses

### MQTT Message Format

**Vehicle Data:**
```json
{
  "deviceId": "device_123",
  "timestamp": "2024-01-15T10:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "speed": 65,
  "fuelLevel": 75,
  "engineTemperature": 85,
  "batteryVoltage": 12.4,
  "odometer": 50000,
  "tirePressure": {
    "frontLeft": 32,
    "frontRight": 32,
    "rearLeft": 30,
    "rearRight": 30
  },
  "engineStatus": "running"
}
```

---

## Community Features

### GET /community/posts
Get community posts.

### POST /community/posts
Create new post.

**Request Body:**
```json
{
  "title": "Best mechanic in NYC",
  "content": "I had an amazing experience with...",
  "category": "review",
  "tags": ["mechanic", "nyc", "recommendation"]
}
```

### GET /community/posts/:id
Get post details.

### POST /community/posts/:id/like
Like/unlike post.

### POST /community/posts/:id/comment
Add comment to post.

---

## Analytics & Reporting

### GET /analytics/dashboard
Get analytics dashboard data.

### GET /analytics/bookings
Get booking analytics.

### GET /analytics/revenue
Get revenue analytics.

### GET /analytics/vehicles
Get vehicle analytics.

---

## Admin Endpoints

### GET /admin/users
Get all users (admin only).

### GET /admin/service-providers
Get all service providers (admin only).

### GET /admin/bookings
Get all bookings (admin only).

### GET /admin/analytics
Get platform analytics (admin only).

### POST /admin/service-providers/:id/verify
Verify service provider (admin only).

### POST /admin/service-providers/:id/suspend
Suspend service provider (admin only).

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per hour
- **Emergency**: 3 requests per hour

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install garazzo-sdk
```

### Python
```bash
pip install garazzo-sdk
```

### React Native
```bash
npm install @garazzo/react-native-sdk
```

## Support

For API support and questions:
- Email: api-support@garazzo.com
- Documentation: https://docs.garazzo.com
- Status Page: https://status.garazzo.com
