const express = require("express");
const ClinicController = require("./controller");
const router = express.Router();
require("dotenv").config();

router.post("", ClinicController.create);
router.put("/:id", ClinicController.updateById);
router.delete("/:id", ClinicController.deleteById);
router.get("/:id", ClinicController.getById);
router.get("", ClinicController.getAll);

module.exports = router;
