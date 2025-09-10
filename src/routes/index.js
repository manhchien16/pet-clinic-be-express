const petRouters = require("../pets/routers");
const clinicRouters = require("../clinics/routers");
const authRouters = require("../auth/routers");
const userRouters = require("../users/routers");

const routers = (app) => {
  app.use(`/api/${process.env.API_VERSION}/pets`, petRouters);
  app.use(`/api/${process.env.API_VERSION}/clinics`, clinicRouters);
  
  // Authentication routes (no /users prefix)
  app.use(`/api/${process.env.API_VERSION}`, authRouters);
  
  // User management routes (admin only)
  app.use(`/api/${process.env.API_VERSION}/users`, userRouters);
};

module.exports = { routers };
