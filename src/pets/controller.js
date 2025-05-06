const { resError } = require("../common/swapRespose");
const petService = require("./services");

const PetController = {
  async getAllPets(req, res) {
    try {
      const reqBody = req.body;
      const result = await petService.getAll(reqBody);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async getPetById(req, res) {
    try {
      const result = await petService.getById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async createPet(req, res) {
    try {
      const result = await petService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async updatePet(req, res) {
    try {
      const result = await petService.updateById(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async deletePet(req, res) {
    try {
      const result = await petService.deleteById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },
};

module.exports = PetController;
