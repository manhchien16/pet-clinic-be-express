const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
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
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true
}));

// Initialize database and routes
connectDB();
routers(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
