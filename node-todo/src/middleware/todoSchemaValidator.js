const todoSchemaValidator = (schema) => {
  return (req, res, next) => {
    // Schema Options
    const options = {
      abortEarly: false, // Include all errors
      errors: {
        // Removes quotaion marks
        wrap: {
          label: "",
        },
      },
    };

    // Validate request body or request parameter against schema
    const { error, value } = req.params.id
      ? schema.validate({ ...req.body, ...{ idParam: req.params.id } }, options)
      : schema.validate(req.body, options);

    // Creating an error response in json format
    if (error) {
      const errorMessage = {};
      error.details.map((error) => {
        errorMessage[error.path] = error.message;
      });

      res.status(422).json(errorMessage);
    } else {
      // On success replace req.body with validated value and trigger next middleware function
      req.body = value;
      next();
    }
  };
};

module.exports = todoSchemaValidator;
