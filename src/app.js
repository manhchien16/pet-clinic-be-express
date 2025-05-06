const express = require("express");
const { connectDB } = require("./configuration/dbConfig");
const { routers } = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
connectDB();
routers(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
