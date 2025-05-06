const express = require("express");
const PetController = require("./controller");
const router = express.Router();
require("dotenv").config();

router.post("", PetController.createPet);
router.put("/:id", PetController.updatePet);
router.delete("/:id", PetController.deletePet);
router.get("/:id", PetController.getPetById);
router.get("", PetController.getAllPets);

module.exports = router;
