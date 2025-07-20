// index.js - Express server voor RandRealEstate
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('./generated/prisma');

// Initialize Express app en Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100000000000, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });

// Middleware
app.use(helmet()); // Security headers
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow frontend URL
//   credentials: true
// }));
// // app.use(limiter);
app.use(cors({
  origin: 'http://localhost:5173', // Hardcode voor nu
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Voeg toe na de bestaande middleware, rond regel 30:

// TODO✅: Import de nieuwe routes
const propertyRoutes = require('./routes/property_routes');
const locationRoutes = require('./routes/location_routes'); 
const inquiryRoutes = require('./routes/inquiry_routes');


// TODO✅: Gebruik de routes
app.use('/api/properties', propertyRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RandRealEstate API is running!',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const propertyCount = await prisma.property.count();
    const userCount = await prisma.user.count();
    const agentCount = await prisma.agent.count();
    
    res.json({
      message: 'Database connection successful!',
      stats: {
        properties: propertyCount,
        users: userCount,
        agents: agentCount
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      propertyType, 
      minPrice, 
      maxPrice,
      status = 'available'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      status: status,
      ...(city && { location: { city: { contains: city } } }),
      ...(propertyType && { propertyType: { name: propertyType } }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
    };
    
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          location: true,
          propertyType: true,
          agent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              agencyName: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.property.count({ where })
    ]);
    
    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        location: true,
        propertyType: true,
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            agencyName: true,
            bio: true,
            profileImage: true,
            yearsExperience: true
          }
        },
        viewings: {
          where: { 
            scheduledDate: { gte: new Date() },
            status: 'scheduled'
          },
          select: { scheduledDate: true }
        }
      }
    });
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Increment view count
    await prisma.property.update({
      where: { id: parseInt(id) },
      data: { viewsCount: { increment: 1 } }
    });
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Get featured properties
app.get('/api/properties/featured', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { 
        featured: true,
        status: 'available'
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        },
        location: true,
        propertyType: true
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ error: 'Failed to fetch featured properties' });
  }
});

// Get locations for filter dropdown
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { city: 'asc' }
    });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get property types for filter dropdown
app.get('/api/property-types', async (req, res) => {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(propertyTypes);
  } catch (error) {
    console.error('Error fetching property types:', error);
    res.status(500).json({ error: 'Failed to fetch property types' });
  }
});

// Contact/Inquiry endpoint
app.post('/api/inquiries', async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!propertyId || !name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId: parseInt(propertyId),
        name,
        email,
        phone,
        message
      }
    });
    
    res.status(201).json({ 
      message: 'Inquiry sent successfully!',
      inquiry 
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RandRealEstate API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Properties API: http://localhost:${PORT}/api/properties`);
});

module.exports = app;