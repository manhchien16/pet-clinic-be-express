const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./configuration/dbConfig");
const { routers } = require("./routes");
const { swaggerSpec, swaggerUi } = require("./config/swagger");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

// Security Middleware
app.use(helmet()); // Set security headers

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true, // Allow cookies
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Parse cookies

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Pet Clinic API Documentation"
}));

// API Info endpoint
app.get('/api-info', (req, res) => {
  res.json({
    name: 'Pet Clinic API',
    version: '1.0.0',
    description: 'API documentation for Pet Clinic Backend Express.js application',
    documentation: '/api-docs'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Initialize database and routes
connectDB();
routers(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
