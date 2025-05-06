const mongoose = require("mongoose");
const Pet = require("./model/pet");
const { createPetValidationRules } = require("./constant");
const { createPagination } = require("../common/paginate");
const { validateObject } = require("../common/validateValues");
const { idValidateRules } = require("../common/ruleCommon");

const petService = {
  // Create a new pet
  create: async (data) => {
    try {
      validateObject(data, createPetValidationRules);
      const pet = new Pet(data);
      return await pet.save();
    } catch (error) {
      throw new Error(error);
    }
  },

  // Update a pet by ID
  updateById: async (id, data) => {
    try {
      validateObject(data, createPetValidationRules);
      validateObject(id, idValidateRules);
      const pet = Pet.findById(id);
      if (!pet) throw new Error("Data Invalid");
      return await Pet.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(error);
    }
  },

  // Delete a pet by ID
  deleteById: async (id) => {
    try {
      validateObject(id, idValidateRules);
      const pet = Pet.findById(id);
      if (!pet) throw new Error("Data Invalid");
      return await Pet.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  },

  // Get a pet by ID
  getById: async (id) => {
    try {
      validateObject(id, idValidateRules);
      return await Pet.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  },

  // Get all pets with optional keyword search and pagination
  getAll: async (reqBody) => {
    try {
      console.log(reqBody);

      const { keyWord, page = 1, limit = 10 } = reqBody;
      const searchQuery = keyWord
        ? {
            $or: [
              { name: { $regex: keyWord, $options: "i" } },
              { coatColor: { $regex: keyWord, $options: "i" } },
              { gender: { $regex: keyWord, $options: "i" } },
              { dateOfBirth: { $regex: keyWord, $options: "i" } },
              { customerId: { $regex: keyWord, $options: "i" } },
              { staffId: { $regex: keyWord, $options: "i" } },
              { speciesId: { $regex: keyWord, $options: "i" } },
              { clinicId: { $regex: keyWord, $options: "i" } },
            ],
          }
        : {};

      const total = await Pet.countDocuments(searchQuery);

      const pets = await Pet.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);

      const pagination = createPagination(total, page, limit);

      return {
        data: pets,
        ...pagination,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = petService;
