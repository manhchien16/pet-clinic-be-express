/**
 * Validates an object or a single value based on the provided rules.
 * @param {Object|string|number|boolean} data - The object or single value to validate.
 * @param {Object} rules - The validation rules for each field or for the single value.
 * @returns {void} Throws an error if validation fails.
 */
const validateObject = (data, rules) => {
  const errors = [];

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    const key = Object.keys(rules)[0];
    data = { [key]: data };
  }

  // ✅ Check for unknown (extra) fields not defined in rules
  const unknownFields = Object.keys(data).filter(
    (key) => !rules.hasOwnProperty(key)
  );
  if (unknownFields.length > 0) {
    errors.push(`Unknown fields: ${unknownFields.join(", ")}.`);
  }

  // ✅ Validate fields based on rules
  Object.keys(rules).forEach((key) => {
    const value = data[key];
    const rule = rules[key];

    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`'${key}' is required.`);
    }

    if (rule.type && typeof value !== rule.type && value !== undefined) {
      errors.push(`'${key}' must be of type '${rule.type}'.`);
    }

    if (rule.enum && !rule.enum.includes(value) && value !== undefined) {
      errors.push(`'${key}' must be one of [${rule.enum.join(", ")}].`);
    }

    if (rule.regex && !rule.regex.test(value) && value !== undefined) {
      errors.push(`'${key}' does not match the required format.`);
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
};

module.exports = { validateObject };
