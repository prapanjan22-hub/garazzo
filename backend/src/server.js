const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 Starting Garazzo Backend Server...');
console.log(`📡 Port: ${PORT}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);

// Security and performance middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(morgan('combined'));

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://*.netlify.app',
    'https://garazzo.netlify.app',
    'https://garazzo-frontend.netlify.app',
    process.env.FRONTEND_URL,
    /\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚗 Garazzo Backend API is Live and Operational!',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    uptime: Math.floor(process.uptime()),
    features: [
      'Mechanic Discovery',
      'Booking Management', 
      'Emergency SOS',
      'Community Platform',
      'Real-time Analytics'
    ]
  });
});

// Demo data for MVP
const mechanicsData = [
  {
    id: 1,
    name: "Ravi's Auto Care",
    owner: "Ravi Kumar",
    rating: 4.8,
    location: "Koramangala, Bangalore",
    address: "123 Service Road, Koramangala 4th Block, Bangalore - 560034",
    phone: "+91-9876543210",
    email: "ravi@autocare.com",
    specialization: ["Engine Repair", "AC Service", "Oil Change", "Brake Service"],
    services: [
      { name: "Full Service", price: "₹1200-1500", duration: "2-3 hours", description: "Complete vehicle inspection and maintenance" },
      { name: "Oil Change", price: "₹800-1000", duration: "30 mins", description: "Engine oil and filter replacement" },
      { name: "AC Service", price: "₹600-800", duration: "1 hour", description: "AC system cleaning and gas refill" },
      { name: "Brake Service", price: "₹1000-1300", duration: "1-2 hours", description: "Brake pad replacement and system check" }
    ],
    priceRange: "₹600-1500",
    distance: "2.3 km",
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=300&h=200&fit=crop",
    reviews: 234,
    workingHours: "9:00 AM - 8:00 PM",
    experience: "15+ years",
    facilities: ["Waiting Area", "Free WiFi", "Parking", "Card Payment"],
    certifications: ["ISO 9001", "Authorized Service"],
    responseTime: "< 2 hours",
    completedJobs: 1240
  },
  {
    id: 2,
    name: "Metro Garage Pro",
    owner: "Amit Singh",
    rating: 4.6,
    location: "Connaught Place, New Delhi",
    address: "456 CP Main Road, Block A, Connaught Place, Delhi - 110001",
    phone: "+91-9123456789",
    email: "amit@metrogarage.com",
    specialization: ["Brake Service", "Suspension", "Electrical", "Transmission"],
    services: [
      { name: "Brake Service", price: "₹800-1200", duration: "1-2 hours", description: "Complete brake system overhaul" },
      { name: "Suspension Repair", price: "₹1500-2000", duration: "2-3 hours", description: "Shock absorber and strut replacement" },
      { name: "Electrical Work", price: "₹500-1000", duration: "1-2 hours", description: "Wiring and electrical component repair" },
      { name: "Battery Service", price: "₹300-500", duration: "30 mins", description: "Battery testing and replacement" }
    ],
    priceRange: "₹300-2000",
    distance: "1.8 km",
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=200&fit=crop",
    reviews: 189,
    workingHours: "8:00 AM - 9:00 PM",
    experience: "12+ years",
    facilities: ["AC Waiting", "Express Service", "Home Pickup", "Insurance Claims"],
    certifications: ["Certified Technicians", "Authorized Dealer"],
    responseTime: "< 1 hour",
    completedJobs: 892
  },
  {
    id: 3,
    name: "Speed Fix Motors",
    owner: "Rajesh Patel",
    rating: 4.9,
    location: "Bandra West, Mumbai",
    address: "789 Turner Road, Bandra West, Mumbai - 400050",
    phone: "+91-9988776655",
    email: "rajesh@speedfixmotors.com",
    specialization: ["Engine Diagnostics", "Transmission", "Performance Tuning"],
    services: [
      { name: "Engine Diagnostics", price: "₹500-800", duration: "1 hour", description: "Computer-based engine analysis" },
      { name: "Transmission Service", price: "₹2000-3000", duration: "3-4 hours", description: "Transmission fluid change and repair" },
      { name: "Performance Tuning", price: "₹3000-5000", duration: "2-3 hours", description: "ECU tuning and performance optimization" },
      { name: "Complete Overhaul", price: "₹15000-25000", duration: "2-3 days", description: "Complete engine rebuilding" }
    ],
    priceRange: "₹500-25000",
    distance: "3.1 km",
    available: false,
    verified: true,
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300&h=200&fit=crop",
    reviews: 312,
    workingHours: "10:00 AM - 7:00 PM",
    experience: "20+ years",
    facilities: ["Premium Lounge", "Valet Service", "Online Booking", "Warranty"],
    certifications: ["Master Technician", "Performance Specialist"],
    responseTime: "Next day",
    completedJobs: 2150
  },
  {
    id: 4,
    name: "Quick Fix Garage",
    owner: "Suresh Reddy",
    rating: 4.4,
    location: "HITEC City, Hyderabad",
    address: "321 Tech City Road, HITEC City, Hyderabad - 500081",
    phone: "+91-9876543211",
    email: "suresh@quickfix.com",
    specialization: ["Quick Service", "Oil Change", "Tire Service", "Express Maintenance"],
    services: [
      { name: "Express Oil Change", price: "₹600-800", duration: "20 mins", description: "Quick engine oil replacement" },
      { name: "Tire Rotation", price: "₹200-400", duration: "30 mins", description: "Tire position change for even wear" },
      { name: "Basic Inspection", price: "₹300-500", duration: "45 mins", description: "Multi-point vehicle inspection" },
      { name: "Car Wash", price: "₹200-300", duration: "30 mins", description: "Complete exterior and interior cleaning" }
    ],
    priceRange: "₹200-800",
    distance: "4.2 km",
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    reviews: 156,
    workingHours: "7:00 AM - 10:00 PM",
    experience: "8+ years",
    facilities: ["24/7 Service", "Express Lane", "Mobile App", "Loyalty Program"],
    certifications: ["Quick Service Specialist"],
    responseTime: "< 30 mins",
    completedJobs: 567
  }
];

const bookingsData = [
  {
    id: 1,
    userId: 101,
    userName: "Arjun Sharma",
    userPhone: "+91-9876543210",
    vehicle: "Honda City (KA-01-AB-1234)",
    vehicleModel: "Honda City",
    year: "2020",
    service: "Full Service + Oil Change",
    serviceDetails: ["Engine Oil Change", "Air Filter Replacement", "Battery Check", "Brake Inspection"],
    mechanic: "Ravi's Auto Care",
    mechanicId: 1,
    bookingDate: "2025-09-18",
    serviceTime: "10:00 AM",
    status: "Completed",
    amount: "₹1,450",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    rating: 5,
    review: "Excellent service! Very professional and completed on time. Highly recommended.",
    completionDate: "2025-09-18",
    estimatedDuration: "2-3 hours",
    actualDuration: "2.5 hours",
    bookingId: "BK001",
    createdAt: "2025-09-17T10:30:00Z"
  },
  {
    id: 2,
    userId: 102,
    userName: "Priya Patel",
    userPhone: "+91-9123456789",
    vehicle: "Maruti Swift (KA-02-CD-5678)",
    vehicleModel: "Maruti Swift",
    year: "2019",
    service: "AC Service",
    serviceDetails: ["AC Gas Refill", "Filter Cleaning", "Cooling System Check"],
    mechanic: "Metro Garage Pro",
    mechanicId: 2,
    bookingDate: "2025-09-21",
    serviceTime: "2:00 PM",
    status: "Scheduled",
    amount: "₹850",
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    rating: null,
    review: null,
    estimatedDuration: "1 hour",
    bookingId: "BK002",
    createdAt: "2025-09-20T15:20:00Z"
  },
  {
    id: 3,
    userId: 103,
    userName: "Rohit Kumar",
    userPhone: "+91-9988776655",
    vehicle: "Hyundai Creta (MH-01-XY-9876)",
    vehicleModel: "Hyundai Creta",
    year: "2021",
    service: "Brake Service",
    serviceDetails: ["Brake Pad Replacement", "Brake Fluid Change", "System Check"],
    mechanic: "Speed Fix Motors",
    mechanicId: 3,
    bookingDate: "2025-09-20",
    serviceTime: "11:00 AM",
    status: "In Progress",
    amount: "₹1,200",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    rating: null,
    review: null,
    estimatedDuration: "1-2 hours",
    progress: 60,
    bookingId: "BK003",
    createdAt: "2025-09-19T09:15:00Z"
  }
];

const communityPosts = [
  {
    id: 1,
    userId: 201,
    userName: "CarEnthusiast_BLR",
    userAvatar: "https://ui-avatars.com/api/?name=CE&background=4CAF50&color=fff",
    content: "Just got my Honda serviced at Ravi's Auto Care. Excellent work! They completed a full service in just 2.5 hours and the car is running like new. Highly recommended for engine issues and general maintenance. 🚗✨",
    images: [],
    likes: 23,
    comments: [
      { user: "AutoLover", comment: "Thanks for the recommendation!" },
      { user: "BengaluruDriver", comment: "I've used them too, great service!" }
    ],
    shares: 3,
    timestamp: "2 hours ago",
    tags: ["service", "honda", "engine", "maintenance"],
    location: "Bangalore",
    verified: true,
    createdAt: "2025-09-21T10:00:00Z"
  },
  {
    id: 2,
    userId: 202,
    userName: "TechDriveDelhi",
    userAvatar: "https://ui-avatars.com/api/?name=TD&background=2196F3&color=fff",
    content: "Pro tip: Regular oil changes every 5000km can extend your engine life significantly! Also, don't forget to check your air filter every 3 months. Small maintenance goes a long way in preventing major repairs. 🔧💡",
    images: [],
    likes: 45,
    comments: [
      { user: "NewDriver", comment: "Great advice! When should I change transmission fluid?" },
      { user: "CarMechanic", comment: "Transmission fluid every 40,000km typically" }
    ],
    shares: 8,
    timestamp: "5 hours ago",
    tags: ["maintenance", "tips", "oil", "engine"],
    location: "Delhi",
    verified: true,
    createdAt: "2025-09-21T07:00:00Z"
  },
  {
    id: 3,
    userId: 203,
    userName: "MumbaiMechanic",
    userAvatar: "https://ui-avatars.com/api/?name=MM&background=FF9800&color=fff",
    content: "Weather's getting hot in Mumbai! Don't forget to check your AC before summer hits full swing. Get your AC serviced now to avoid the rush and higher prices during peak summer months. 🌞❄️",
    images: [],
    likes: 18,
    comments: [
      { user: "SummerDriver", comment: "Already booked my AC service!" }
    ],
    shares: 4,
    timestamp: "8 hours ago",
    tags: ["ac", "summer", "maintenance", "mumbai"],
    location: "Mumbai",
    verified: false,
    createdAt: "2025-09-21T04:00:00Z"
  }
];

// API Routes

// Get all mechanics with filtering
app.get('/api/mechanics', (req, res) => {
  console.log('📍 GET /api/mechanics - Fetching mechanics list');
  
  const { location, service, available, rating, priceRange } = req.query;
  let filteredMechanics = [...mechanicsData];
  
  if (location) {
    filteredMechanics = filteredMechanics.filter(m => 
      m.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (service) {
    filteredMechanics = filteredMechanics.filter(m => 
      m.specialization.some(s => s.toLowerCase().includes(service.toLowerCase())) ||
      m.services.some(srv => srv.name.toLowerCase().includes(service.toLowerCase()))
    );
  }
  
  if (available === 'true') {
    filteredMechanics = filteredMechanics.filter(m => m.available);
  }
  
  if (rating) {
    filteredMechanics = filteredMechanics.filter(m => m.rating >= parseFloat(rating));
  }
  
  res.status(200).json({
    success: true,
    message: 'Mechanics retrieved successfully',
    count: filteredMechanics.length,
    data: filteredMechanics,
    filters: { location, service, available, rating, priceRange }
  });
});

// Get specific mechanic
app.get('/api/mechanics/:id', (req, res) => {
  const mechanicId = parseInt(req.params.id);
  console.log(`🔍 GET /api/mechanics/${mechanicId} - Fetching mechanic details`);
  
  const mechanic = mechanicsData.find(m => m.id === mechanicId);
  
  if (!mechanic) {
    return res.status(404).json({
      success: false,
      message: 'Mechanic not found',
      error: `No mechanic found with ID: ${mechanicId}`
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Mechanic details retrieved successfully',
    data: mechanic
  });
});

// Get all bookings with filtering
app.get('/api/bookings', (req, res) => {
  console.log('📋 GET /api/bookings - Fetching bookings list');
  
  const { status, userId, mechanicId } = req.query;
  let filteredBookings = [...bookingsData];
  
  if (status) {
    filteredBookings = filteredBookings.filter(b => 
      b.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  if (userId) {
    filteredBookings = filteredBookings.filter(b => 
      b.userId === parseInt(userId)
    );
  }
  
  if (mechanicId) {
    filteredBookings = filteredBookings.filter(b => 
      b.mechanicId === parseInt(mechanicId)
    );
  }
  
  res.status(200).json({
    success: true,
    message: 'Bookings retrieved successfully',
    count: filteredBookings.length,
    data: filteredBookings,
    filters: { status, userId, mechanicId }
  });
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  console.log('📝 POST /api/bookings - Creating new booking', req.body);
  
  const requiredFields = ['userId', 'mechanicId', 'vehicle', 'service'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      missingFields: missingFields,
      requiredFields: requiredFields
    });
  }
  
  const newBooking = {
    id: bookingsData.length + 1,
    bookingId: `BK${String(bookingsData.length + 1).padStart(3, '0')}`,
    ...req.body,
    bookingDate: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  bookingsData.push(newBooking);
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  });
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  console.log(`📝 PUT /api/bookings/${bookingId} - Updating booking`);
  
  const bookingIndex = bookingsData.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
      error: `No booking found with ID: ${bookingId}`
    });
  }
  
  bookingsData[bookingIndex] = { 
    ...bookingsData[bookingIndex], 
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: bookingsData[bookingIndex]
  });
});

// Emergency SOS
app.get('/api/emergency', (req, res) => {
  console.log('🚨 GET /api/emergency - Emergency SOS activated');
  
  const emergencyResponse = {
    sosId: `EMG-${Date.now()}`,
    status: "dispatched",
    message: "🚨 Emergency SOS Activated Successfully!",
    estimatedTime: "15-20 minutes",
    rescueTeam: {
      name: "Highway Rescue Team Alpha",
      phone: "+91-9876543210",
      vehicle: "Mobile Service Van (KA-05-RS-1234)",
      driverName: "Vikram Singh",
      driverPhoto: "https://ui-avatars.com/api/?name=VS&background=f44336&color=fff",
      specialization: ["Emergency Repairs", "Towing", "Jump Start", "Tire Change"]
    },
    location: {
      detected: "NH-48, KM 23, Near Gurgaon",
      coordinates: "28.4595, 77.0266",
      landmark: "Near Cyber City Metro Station",
      accuracy: "±10 meters"
    },
    services: [
      "🔋 Battery Jump Start",
      "🛞 Flat Tire Change", 
      "🌡️ Engine Overheating Fix",
      "⛽ Emergency Fuel Delivery",
      "🚛 Emergency Towing",
      "🔧 Basic Roadside Repairs"
    ],
    instructions: "Stay in a safe location away from traffic. Our rescue team has been notified and will contact you within 2-3 minutes.",
    trackingUrl: `https://garazzo.netlify.app/track/EMG-${Date.now()}`,
    dispatchTime: new Date().toISOString(),
    eta: new Date(Date.now() + 18 * 60000).toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: "Emergency SOS activated successfully",
    data: emergencyResponse
  });
});

// Create emergency request
app.post('/api/emergency', (req, res) => {
  console.log('🚨 POST /api/emergency - Creating emergency request', req.body);
  
  const emergencyRequest = {
    id: `EMG-${Date.now()}`,
    userId: req.body.userId,
    userPhone: req.body.phone,
    location: req.body.location || 'GPS Location Detected',
    issue: req.body.issue || 'General Emergency',
    vehicle: req.body.vehicle || 'Vehicle Details Not Provided',
    description: req.body.description,
    status: 'dispatched',
    priority: req.body.priority || 'high',
    createdAt: new Date().toISOString(),
    estimatedArrival: new Date(Date.now() + 20 * 60000).toISOString(),
    assignedTeam: "Highway Rescue Team Alpha"
  };
  
  res.status(201).json({
    success: true,
    message: 'Emergency request created successfully',
    data: emergencyRequest
  });
});

// Community posts
app.get('/api/community/posts', (req, res) => {
  console.log('👥 GET /api/community/posts - Fetching community posts');
  
  const { tag, location, verified, limit = 10 } = req.query;
  let filteredPosts = [...communityPosts];
  
  if (tag) {
    filteredPosts = filteredPosts.filter(p => 
      p.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }
  
  if (location) {
    filteredPosts = filteredPosts.filter(p => 
      p.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (verified === 'true') {
    filteredPosts = filteredPosts.filter(p => p.verified);
  }
  
  // Limit results
  filteredPosts = filteredPosts.slice(0, parseInt(limit));
  
  res.status(200).json({
    success: true,
    message: 'Community posts retrieved successfully',
    count: filteredPosts.length,
    data: filteredPosts,
    filters: { tag, location, verified, limit }
  });
});

// Create community post
app.post('/api/community/posts', (req, res) => {
  console.log('📝 POST /api/community/posts - Creating community post', req.body);
  
  const newPost = {
    id: communityPosts.length + 1,
    userId: req.body.userId || 999,
    userName: req.body.userName || 'Anonymous User',
    userAvatar: req.body.userAvatar || 'https://ui-avatars.com/api/?name=AU&background=666&color=fff',
    content: req.body.content,
    images: req.body.images || [],
    likes: 0,
    comments: [],
    shares: 0,
    timestamp: 'Just now',
    tags: req.body.tags || [],
    location: req.body.location || 'Unknown',
    verified: false,
    createdAt: new Date().toISOString()
  };
  
  communityPosts.unshift(newPost);
  
  res.status(201).json({
    success: true,
    message: 'Community post created successfully',
    data: newPost
  });
});

// Search functionality
app.get('/api/search', (req, res) => {
  const { q, type = 'all', limit = 20 } = req.query;
  console.log(`🔍 GET /api/search - Search query: "${q}", type: "${type}"`);
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query parameter "q" is required',
      example: '/api/search?q=engine&type=mechanics'
    });
  }
  
  const searchTerm = q.toLowerCase();
  let results = {
    mechanics: [],
    services: [],
    posts: []
  };
  
  if (type === 'all' || type === 'mechanics') {
    results.mechanics = mechanicsData.filter(m => 
      m.name.toLowerCase().includes(searchTerm) ||
      m.location.toLowerCase().includes(searchTerm) ||
      m.specialization.some(s => s.toLowerCase().includes(searchTerm)) ||
      m.services.some(srv => srv.name.toLowerCase().includes(searchTerm))
    ).slice(0, parseInt(limit));
  }
  
  if (type === 'all' || type === 'posts') {
    results.posts = communityPosts.filter(p => 
      p.content.toLowerCase().includes(searchTerm) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm)) ||
      p.userName.toLowerCase().includes(searchTerm)
    ).slice(0, parseInt(limit));
  }
  
  const totalResults = results.mechanics.length + results.posts.length;
  
  res.status(200).json({
    success: true,
    message: 'Search completed successfully',
    query: q,
    type: type,
    totalResults: totalResults,
    results: results
  });
});

// Platform statistics
app.get('/api/stats', (req, res) => {
  console.log('📊 GET /api/stats - Fetching platform statistics');
  
  const stats = {
    platform: {
      totalMechanics: mechanicsData.length,
      availableMechanics: mechanicsData.filter(m => m.available).length,
      verifiedMechanics: mechanicsData.filter(m => m.verified).length,
      totalBookings: bookingsData.length,
      completedBookings: bookingsData.filter(b => b.status === 'Completed').length,
      scheduledBookings: bookingsData.filter(b => b.status === 'Scheduled').length,
      inProgressBookings: bookingsData.filter(b => b.status === 'In Progress').length,
      totalCommunityPosts: communityPosts.length,
      totalRevenue: "₹2,45,000",
      monthlyGrowth: "23%"
    },
    mechanics: {
      averageRating: (mechanicsData.reduce((sum, m) => sum + m.rating, 0) / mechanicsData.length).toFixed(1),
      totalReviews: mechanicsData.reduce((sum, m) => sum + m.reviews, 0),
      totalCompletedJobs: mechanicsData.reduce((sum, m) => sum + m.completedJobs, 0),
      topServices: ['Full Service', 'Oil Change', 'AC Service', 'Brake Service'],
      topLocations: ['Bangalore', 'Delhi', 'Mumbai', 'Hyderabad']
    },
    users: {
      activeUsers: 1247,
      newUsersThisMonth: 89,
      userSatisfactionRate: "94.5%",
      averageBookingsPerUser: 3.2
    },
    emergency: {
      totalSOSRequests: 45,
      averageResponseTime: "16 minutes",
      successfulResolutions: "98%"
    }
  };
  
  res.status(200).json({
    success: true,
    message: 'Platform statistics retrieved successfully',
    data: stats,
    generatedAt: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      mechanics: [
        'GET /api/mechanics',
        'GET /api/mechanics/:id'
      ],
      bookings: [
        'GET /api/bookings',
        'POST /api/bookings',
        'PUT /api/bookings/:id'
      ],
      emergency: [
        'GET /api/emergency',
        'POST /api/emergency'
      ],
      community: [
        'GET /api/community/posts',
        'POST /api/community/posts'
      ],
      utilities: [
        'GET /api/search',
        'GET /api/stats',
        'GET /'
      ]
    },
    documentation: 'https://github.com/prapanjan22-hub/garazzo#api-documentation'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ==========================================');
  console.log('🚗     GARAZZO BACKEND API STARTED       ');
  console.log('🎉 ==========================================');
  console.log(`✅ Server: http://0.0.0.0:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health Check: http://0.0.0.0:${PORT}/`);
  console.log(`📡 API Base: http://0.0.0.0:${PORT}/api`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   GET  /api/mechanics       - List mechanics');
  console.log('   GET  /api/bookings        - List bookings');
  console.log('   POST /api/bookings        - Create booking');
  console.log('   GET  /api/emergency       - Emergency SOS');
  console.log('   GET  /api/community/posts - Community posts');
  console.log('   GET  /api/search          - Search platform');
  console.log('   GET  /api/stats           - Platform stats');
  console.log('');
  console.log('🚀 Ready to serve requests!');
  console.log('==========================================');
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
