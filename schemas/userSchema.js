import Joi from 'joi';

const schema = {
  create: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    userName: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase()
      .required(),
    password: Joi.string().trim().min(6).required(),
    city: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    isAdmin: Joi.boolean().default(false),
    cardNumber: Joi.string().trim().length(16).required(),
    selectedMonth: Joi.string().trim().regex(/^(0?[1-9]|1[0-2])$/).required(),
    selectedYear: Joi.string().trim().regex(/^\d{2}$/).required(),
    cvv: Joi.string().trim().length(3).required(),
    cardHolderName: Joi.string().trim().required(),
  }),
};

export default schema;
