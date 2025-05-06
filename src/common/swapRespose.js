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

module.exports = {
  resGetFunction,
  resError,
};
