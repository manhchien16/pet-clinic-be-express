const { resError } = require("../common/swapRespose");
const clinicService = require("./services");

const ClinicController = {
  async getAll(req, res) {
    try {
      const reqBody = req.body;
      const result = await clinicService.getAll(reqBody);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async getById(req, res) {
    try {
      const result = await clinicService.getById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async create(req, res) {
    try {
      const result = await clinicService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async updateById(req, res) {
    try {
      const result = await clinicService.updateById(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },

  async deleteById(req, res) {
    try {
      const result = await clinicService.deleteById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.status(200).json({ message: "Clinic deleted successfully" });
    } catch (error) {
      res.status(500).json(resError(error));
    }
  },
};

module.exports = ClinicController;
