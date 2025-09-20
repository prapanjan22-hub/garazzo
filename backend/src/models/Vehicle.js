const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  // Vehicle Identification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  
  // Basic Vehicle Information
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  variant: {
    type: String,
    trim: true
  },
  
  // Vehicle Details
  vin: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true,
    match: [/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format']
  },
  licensePlate: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'cvt', 'semi-automatic'],
    required: true
  },
  
  // Engine Information
  engine: {
    displacement: String, // e.g., "1.5L", "2.0L"
    power: String, // e.g., "150 HP", "200 kW"
    torque: String, // e.g., "250 Nm"
    cylinders: Number
  },
  
  // Dimensions and Capacity
  dimensions: {
    length: Number, // in mm
    width: Number, // in mm
    height: Number, // in mm
    wheelbase: Number // in mm
  },
  capacity: {
    seats: Number,
    doors: Number,
    fuelTank: Number // in liters
  },
  
  // Current Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'accident', 'stolen'],
    default: 'active'
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    coverage: {
      type: String,
      enum: ['third_party', 'comprehensive', 'zero_depreciation']
    }
  },
  
  // Service History
  serviceHistory: [{
    date: Date,
    serviceType: String,
    description: String,
    cost: Number,
    mileage: Number,
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [String] // URLs to service documents
  }],
  
  // Maintenance Schedule
  maintenanceSchedule: [{
    type: {
      type: String,
      enum: ['oil_change', 'filter_change', 'brake_service', 'tire_rotation', 'inspection', 'other']
    },
    description: String,
    dueDate: Date,
    dueMileage: Number,
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedDate: Date,
    completedMileage: Number
  }],
  
  // Real-time Data (from IoT device)
  realTimeData: {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      },
      address: String,
      lastUpdated: Date
    },
    speed: {
      type: Number,
      default: 0,
      min: 0
    },
    fuelLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    engineTemperature: {
      type: Number,
      default: 0
    },
    batteryVoltage: {
      type: Number,
      default: 0
    },
    odometer: {
      type: Number,
      default: 0,
      min: 0
    },
    tirePressure: {
      frontLeft: Number,
      frontRight: Number,
      rearLeft: Number,
      rearRight: Number
    },
    engineStatus: {
      type: String,
      enum: ['running', 'stopped', 'idle', 'error'],
      default: 'stopped'
    },
    lastUpdated: Date
  },
  
  // Emergency Information
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  
  // Photos
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'engine', 'damage', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settings
  settings: {
    trackingEnabled: {
      type: Boolean,
      default: true
    },
    emergencyAlerts: {
      type: Boolean,
      default: true
    },
    maintenanceReminders: {
      type: Boolean,
      default: true
    },
    theftProtection: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
vehicleSchema.index({ userId: 1 });
vehicleSchema.index({ deviceId: 1 });
vehicleSchema.index({ vin: 1 });
vehicleSchema.index({ licensePlate: 1 });
vehicleSchema.index({ 'realTimeData.location': '2dsphere' });
vehicleSchema.index({ make: 1, model: 1, year: 1 });

// Virtual for vehicle display name
vehicleSchema.virtual('displayName').get(function() {
  return `${this.year} ${this.make} ${this.model}`;
});

// Method to update real-time data
vehicleSchema.methods.updateRealTimeData = function(data) {
  this.realTimeData = {
    ...this.realTimeData,
    ...data,
    lastUpdated: new Date()
  };
  return this.save();
};

// Method to add service record
vehicleSchema.methods.addServiceRecord = function(serviceData) {
  this.serviceHistory.push(serviceData);
  this.mileage = serviceData.mileage || this.mileage;
  return this.save();
};

// Method to get maintenance alerts
vehicleSchema.methods.getMaintenanceAlerts = function() {
  const now = new Date();
  const currentMileage = this.mileage;
  
  return this.maintenanceSchedule.filter(item => {
    if (item.isCompleted) return false;
    
    const isOverdue = item.dueDate && item.dueDate < now;
    const isMileageOverdue = item.dueMileage && item.dueMileage <= currentMileage;
    
    return isOverdue || isMileageOverdue;
  });
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
