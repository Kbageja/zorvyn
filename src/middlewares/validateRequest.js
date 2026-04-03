const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse({
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
    });
    req.body = validData.body;
    Object.keys(req.query).forEach(key => delete req.query[key]);
    Object.assign(req.query, validData.query);

    Object.keys(req.params).forEach(key => delete req.params[key]);
    Object.assign(req.params, validData.params);

    return next();
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

export default validate;
