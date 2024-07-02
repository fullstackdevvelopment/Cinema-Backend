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
    cardNumber: Joi.string().trim().length(16).required(),
    selectedMonth: Joi.string().trim().regex(/^(0?[1-9]|1[0-2])$/).required(),
    selectedYear: Joi.string().trim().regex(/^\d{2}$/).required(),
    cvv: Joi.string().trim().length(3).required(),
    cardHolderName: Joi.string().trim().required(),
  }),
  movieCreateAndUpdate: Joi.object({
    title: Joi.string().required(),
    details: Joi.string().required(),
    language: Joi.string().required(),
    releaseDate: Joi.string().required(),
    director: Joi.string().required(),
    storyLine: Joi.string().required(),
    rating: Joi.number().required(),
    voters: Joi.number().required(),
    actors: Joi.string().required(),
    stills: Joi.string().required(),
    duration: Joi.number().required(),
    categories: Joi.string().required(),
    files: Joi.string().required(),
  }),
  login: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
  createSchedule: Joi.object({
    movieId: Joi.number().integer().positive().required(),
    showTime: Joi.string().required(),
  }),
};

export default schema;
