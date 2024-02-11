import Joi from 'joi';

const schema = {
  create: Joi.object({
    userName: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase()
      .required(),
    password: Joi.string().trim().required(),
    passwordRepeat: Joi.ref('password'),
    phone: Joi.string().trim(),
    address: Joi.string().trim(),
    photo: Joi.string().trim(),
    cardName: Joi.string().trim(),
    cardNumber: Joi.string().trim(),
  }),
};

export default schema;
