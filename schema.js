const Joi = require("joi");
module.exports = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    country: Joi.string().required(),
    location: Joi.string().required().min(0),
    price: Joi.string().allow("", null),
  }).required(),
});
