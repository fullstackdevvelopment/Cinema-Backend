import Joi from 'joi';

const schema = {
  createUser: Joi.object({
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
  createMovie: Joi.object({
    title: Joi.string().required(),
    details: Joi.string().required(),
    language: Joi.string().required(),
    releaseDate: Joi.date().required(),
    director: Joi.string().required(),
    storyLine: Joi.string().required(),
    rating: Joi.number().required(),
    voters: Joi.number().required(),
    actorName1: Joi.string(),
    actorName2: Joi.string(),
    actorName3: Joi.string(),
    actorName4: Joi.string(),
    actorName5: Joi.string(),
    actorName6: Joi.string(),
    actorName7: Joi.string(),
    duration: Joi.number().required(),
    categoryNames: Joi.string().required(),
  }),
};

export default schema;
