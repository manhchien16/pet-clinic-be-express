const { isValidObjectId } = require("mongoose");

const idValidateRules = {
  id: { required: true, type: "string" },
};

module.exports = { idValidateRules };
