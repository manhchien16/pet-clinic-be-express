const express = require("express");
const LoginController = require("./controller");
const { verifyToken } = require("./middleware");
const router = express.Router();
require("dotenv").config();

// Public routes
router.post("/login", LoginController.login);
router.post("/refresh-token", LoginController.refreshToken);

// Protected routes
router.post("/logout", verifyToken, LoginController.logout);

module.exports = router;
