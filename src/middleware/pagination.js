const pagination = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || defaultLimit;

    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) req.query.page = 1;
    if (limit < 1) limit = defaultLimit;

    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
    };

    next();
  };
};

module.exports = pagination;
