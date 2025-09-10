const petRouters = require("../pets/routers");
const clinicRouters = require("../clinics/routers");
const loginRouters = require("../login/routers");

const routers = (app) => {
  app.use(`${process.env.API_VESION}/pets`, petRouters);
  app.use(`${process.env.API_VESION}/clinics`, clinicRouters);
  app.use(`${process.env.API_VESION}/auth`, loginRouters);
};

module.exports = { routers };
