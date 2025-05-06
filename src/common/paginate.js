/**
 * Creates pagination metadata.
 * @param {Number} total - The total number of items.
 * @param {Number} page - The current page number (default is 1).
 * @param {Number} limit - The number of items per page (default is 10).
 * @returns {Object} An object containing pagination metadata.
 */
const createPagination = (total, page = 1, limit = 10) => {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  return {
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { createPagination };
