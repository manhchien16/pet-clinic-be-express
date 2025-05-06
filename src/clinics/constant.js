const createClinicValidationRules = {
  name: { required: true, type: "string" },
  province: { required: true, type: "string" },
  city: { required: true, type: "string" },
  streetAddress: { required: true, type: "string" },
  email: {
    required: true,
    type: "string",
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }, // Valid email format
  phoneNumber: { required: true, type: "string", regex: /^\+?[0-9]{7,15}$/ }, // Valid phone number
  website: {
    required: true,
    type: "string",
    regex: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/,
  }, // Valid URL
};

module.exports = { createClinicValidationRules };
