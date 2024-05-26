import HttpError from 'http-errors';
import _ from 'lodash';

const validateM = (schema, path = 'body') => (req, res, next) => {
  try {
    const valid = schema.validate(req[path], {
      abortEarly: false,
    });

    if (valid.error) {
      const errors = {};
      valid.error.details.forEach((er) => {
        _.set(errors, er.path, er.message.replace(/^".+" /, 'This field '));
      });
      throw HttpError(422, { errors });
    }
    req[path] = valid.value;

    next();
  } catch (e) {
    next(e);
  }
};

export default validateM;
