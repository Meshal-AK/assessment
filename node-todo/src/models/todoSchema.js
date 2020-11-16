const Joi = require("joi");

// Create Schema Object
const schemas = {
  todoPOST: Joi.object().keys({
    // String. Can only contain english letters. (must be set)
    text: Joi.string()
      .regex(/^[a-zA-Z ]+$/)
      .required(),

    // Number. Integer in the range from 1 to 5. (default value is 3)
    priority: Joi.number().integer().min(1).max(5).default(3),

    // Boolean. (default value is false)
    done: Joi.boolean().default(false),

    // Date. A timesamp (can't be set)
    dateCreated: Joi.date().timestamp().forbidden().default(Date.now()),
  }),

  // Validates request parameter
  todoId: Joi.object().keys({
    idParam: Joi.number().min(1),
  }),

  todoPUT: Joi.object().keys({
    text: Joi.string()
      .regex(/^[a-zA-Z ]+$/)
      .empty(""),
    priority: Joi.number().integer().min(1).max(5).empty(""),
    done: Joi.boolean().empty(""),
    dateCreated: Joi.date().timestamp().forbidden().default(Date.now()),
    id: Joi.string().forbidden(),
    idParam: Joi.number().min(1),
  }),
};

module.exports = schemas;
