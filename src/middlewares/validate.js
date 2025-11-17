// src/middlewares/validate.js (Tuzatilgan versiya)
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      if (req.headers.accept?.includes('text/html')) {
        req.validationErrors = error.details.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        req.oldBody = req.body;

        return next();
      }

      return next(ApiError.badRequest(error.details[0].message));
    }

    req.body = value;
    next();
  };
};
