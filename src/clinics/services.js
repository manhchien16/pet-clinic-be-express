const mongoose = require("mongoose");
const Clinic = require("./model/clinic");
const { createPagination } = require("../common/paginate");
const { validateObject } = require("../common/validateValues");
const { createClinicValidationRules } = require("./constant");
const { idValidateRules } = require("../common/ruleCommon");

const clinicService = {
  // Create a new clinic
  create: async (data) => {
    try {
      validateObject(data, createClinicValidationRules);
      const clinic = new Clinic(data);
      return await clinic.save();
    } catch (error) {
      throw new Error(error);
    }
  },

  // Update a clinic by ID
  updateById: async (id, data) => {
    try {
      validateObject(data, createClinicValidationRules);
      validateObject(id, idValidateRules);
      const clinic = await Clinic.findById(id);
      if (!clinic) throw new Error("Data Invalid");
      return await Clinic.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(error);
    }
  },

  // Delete a clinic by ID
  deleteById: async (id) => {
    try {
      validateObject(id, idValidateRules);
      const clinic = await Clinic.findById(id);
      if (!clinic) throw new Error("Data Invalid");
      return await Clinic.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  },

  // Get a clinic by ID
  getById: async (id) => {
    try {
      validateObject(id, idValidateRules);
      return await Clinic.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  },

  // Get all clinics with optional keyword search and pagination
  getAll: async (reqBody) => {
    try {
      console.log(reqBody);

      const { keyWord, page = 1, limit = 10 } = reqBody;
      const searchQuery = keyWord
        ? {
            $or: [
              { name: { $regex: keyWord, $options: "i" } },
              { address: { $regex: keyWord, $options: "i" } },
              { phone: { $regex: keyWord, $options: "i" } },
              { email: { $regex: keyWord, $options: "i" } },
            ],
          }
        : {};

      const total = await Clinic.countDocuments(searchQuery);

      const clinics = await Clinic.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);

      const pagination = createPagination(total, page, limit);

      return {
        data: clinics,
        ...pagination,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = clinicService;
