const resGetFunction = (data, meta) => {
  return [
    {
      data,
      meta,
    },
  ];
};

const resError = (error, status = 500) => {
  return {
    status: status,
    message: error?.message || error.toString(),
  };
};

/**
 * Standardized success response
 */
const successResponse = (res, data = null, message = "Success", statusCode = 200) => {
  const response = {
    status: "success",
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standardized error response
 */
const errorResponse = (res, message = "Internal Server Error", statusCode = 500, errorCode = null) => {
  const response = {
    status: "error",
    message,
  };

  if (errorCode) {
    response.errorCode = errorCode;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standardized paginated response
 */
const paginatedResponse = (res, data, pagination, message = "Data retrieved successfully") => {
  return res.status(200).json({
    status: "success",
    data,
    pagination,
    message,
  });
};

module.exports = {
  resGetFunction,
  resError,
  successResponse,
  errorResponse,
  paginatedResponse,
};
