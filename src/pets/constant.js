const createPetValidationRules = {
  customerId: { required: true, type: "string" },
  clinicId: { required: true, type: "string" },
  staffId: { required: true, type: "string" },
  speciesId: { required: true, type: "string" },
  name: { required: true, type: "string" },
  coatColor: { required: true, type: "string" },
  dateOfBirth: { required: true, regex: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD format
  gender: { required: true, enum: ["male", "female"] },
};

module.exports = {
  createPetValidationRules,
};
