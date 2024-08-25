import Joi from 'joi';

const schema = {
  createUser: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.empty': 'FirstName must not be empty',
        'string.pattern.base': 'FirstName must start with an uppercase letter and contain only Latin letters. Minimum 3 Symbols',
        'any.required': 'FirstName is required',
      }),

    lastName: Joi.string()
      .trim()
      .min(3)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.empty': 'LastName must not be empty',
        'string.pattern.base': 'LastName must start with an uppercase letter and contain only Latin letters. Minimum 3 Symbols',
        'any.required': 'LastName is required',
      }),

    userName: Joi.string()
      .trim()
      .min(6)
      .regex(/^[a-zA-Z][a-zA-Z0-9]*$/)
      .required()
      .messages({
        'string.empty': 'UserName must not be empty',
        'string.pattern.base': 'UserName must start with a letter and contain only Latin letters and numbers. Minimum 6 Symbols',
        'any.required': 'UserName is required',
      }),

    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email must not be empty',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required',
      }),

    password: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"|,.<>/?]).{8,}$/)
      .required()
      .messages({
        'string.empty': 'Password must not be empty',
        'string.min': 'The password must contain a minimum of 8 characters',
        'string.pattern.base': 'The password must contain a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        'any.required': 'Password is required',
      }),

    city: Joi.string()
      .trim()
      .min(2)
      .allow('')
      .messages({
        'string.empty': 'City must not be empty',
        'string.min': 'City must be at least 2 characters long',
      }),

    country: Joi.string()
      .trim()
      .min(2)
      .allow('')
      .messages({
        'string.empty': 'Country must not be empty',
        'string.min': 'Country must be at least 2 characters long',
      }),

    address: Joi.string()
      .trim()
      .min(2)
      .allow('')
      .messages({
        'string.empty': 'Address must not be empty',
        'string.min': 'Address must be at least 2 characters long',
      }),

    phone: Joi.string()
      .trim()
      .pattern(/^\+374(\d{8})?$/)
      .messages({
        'string.empty': 'Phone number must not be empty',
        'string.pattern.base': 'Phone number must start with +374 and optionally contain 8 digits after the country code',
      }),
  }),
  updateUser: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.empty': 'FirstName must not be empty',
        'string.pattern.base': 'FirstName must start with an uppercase letter and contain only Latin letters. Minimum 3 Symbols',
        'any.required': 'FirstName is required',
      }),

    lastName: Joi.string()
      .trim()
      .min(3)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.empty': 'LastName must not be empty',
        'string.pattern.base': 'LastName must start with an uppercase letter and contain only Latin letters. Minimum 3 Symbols',
        'any.required': 'LastName is required',
      }),

    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email must not be empty',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required',
      }),

    city: Joi.string()
      .trim()
      .min(2)
      .messages({
        'string.empty': 'City must not be empty',
      }),

    country: Joi.string()
      .trim()
      .min(2)
      .messages({
        'string.empty': 'Country must not be empty',
      }),

    address: Joi.string()
      .trim()
      .min(2)
      .messages({
        'string.empty': 'Address must not be empty',
        'any.required': 'Address is required',
      }),

    phone: Joi.string()
      .trim()
      .length(12)
      .pattern(/^\+374\d{8}$/)
      .messages({
        'string.empty': 'Phone number must not be empty',
        'string.length': 'The phone number must contain exactly 12 characters',
        'string.pattern.base': 'Phone number must start with +374 and contain 8 digits after the country code',
        'any.required': 'Phone number is required',
      }),

    currentPassword: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"|,.<>/?]).{8,}$/)
      .messages({
        'string.empty': 'Current Password must not be empty',
        'string.min': 'The Current password must contain a minimum of 8 characters',
        'string.pattern.base': 'The Current password must contain a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      }),

    newPassword: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"|,.<>/?]).{8,}$/)
      .messages({
        'string.empty': 'New Password must not be empty',
        'string.min': 'The New password must contain a minimum of 8 characters',
        'string.pattern.base': 'The New password must contain a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      }),
  }),
  movieCreateAndUpdate: Joi.object({
    title: Joi.string()
      .required()
      .messages({
        'string.base': 'Film Name should be a type of text',
        'string.empty': 'Film Name is required',
        'any.required': 'Film Name is required',
      }),
    details: Joi.string()
      .required()
      .messages({
        'string.base': 'Details should be a type of text',
        'string.empty': 'Details are required',
        'any.required': 'Details are required',
      }),
    language: Joi.string()
      .required()
      .messages({
        'string.base': 'Language should be a type of text',
        'string.empty': 'Language is required',
        'any.required': 'Language is required',
      }),
    releaseDate: Joi.string()
      .required()
      .messages({
        'string.base': 'Release date should be a type of text',
        'string.empty': 'Release date is required',
        'any.required': 'Release date is required',
      }),
    director: Joi.string()
      .required()
      .messages({
        'string.base': 'Director should be a type of text',
        'string.empty': 'Director is required',
        'any.required': 'Director is required',
      }),
    storyLine: Joi.string()
      .required()
      .messages({
        'string.base': 'Description should be a type of text',
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
      }),
    actors: Joi.string()
      .required()
      .messages({
        'string.base': 'Actors should be a type of text',
        'string.empty': 'Actors are required',
        'any.required': 'Actors are required',
      }),
    stills: Joi.string()
      .required()
      .messages({
        'string.base': 'Stills should be a type of text',
        'string.empty': 'Stills are required',
        'any.required': 'Stills are required',
      }),
    duration: Joi.string()
      .required()
      .messages({
        'string.base': 'Hour should be a type of text',
        'string.empty': 'Hour is required',
        'any.required': 'Hour is required',
      }),
    categories: Joi.string()
      .required()
      .messages({
        'string.base': 'Categories should be a type of text',
        'string.empty': 'Categories are required',
        'any.required': 'Categories are required',
      }),
    files: Joi.string()
      .required()
      .messages({
        'string.base': 'Files should be a type of text',
        'string.empty': 'Files are required',
        'any.required': 'Files are required',
      }),
    status: Joi.string()
      .valid('Latest', 'Coming Soon', 'Featured movies')
      .required()
      .messages({
        'string.base': 'Status should be a type of text',
        'string.empty': 'Status is required',
        'any.only': 'Status must be either Latest or Coming Soon',
        'any.required': 'Status is required',
      }),
  }),
  login: Joi.object({
    userName: Joi.string()
      .required()
      .messages({
        'string.empty': 'UserName must not be empty',
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password must not be empty',
      }),
  }),
  createSchedule: Joi.object({
    movieId: Joi.number()
      .integer()
      .positive()
      .required(),
    showTime: Joi.date()
      .required(),
  }),
  sendEmail: Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
      }),
    message: Joi.string()
      .trim()
      .min(10)
      .required()
      .messages({
        'string.empty': 'Message must not be empty',
        'string.min': 'Message must contain at least 10 character',
      }),
  }),
  createComment: Joi.object({
    rating: Joi.number()
      .required()
      .messages({
        'string.rating': 'Rating must be a number',
      }),
    commentText: Joi.string()
      .trim()
      .min(10)
      .required()
      .messages({
        'string.empty': 'Message must not be empty',
        'string.min': 'Message must contain at least 10 character',
      }),
  }),
  resetPassword: Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.empty': 'Email must not be empty',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required',
      }),
  }),
  resetPasswordFinished: Joi.object({
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"|,.<>/?]).{8,}$/)
      .required()
      .messages({
        'string.empty': 'Password must not be empty',
        'string.min': 'The password must contain a minimum of 8 characters',
        'string.pattern.base': 'The password must contain a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        'any.required': 'Password is required',
      }),
  }),
};

export default schema;
