import { body, query, validationResult } from 'express-validator';
import httpStatus from 'http-status';

export const requiredQueryCheck = (prop) => {
  return query(prop).notEmpty().withMessage(`${prop} is required`);
};

export const requiredBodyCheck = (prop) => {
  return body(prop).notEmpty().withMessage(`${prop} is required`);
};

export const customBodyCheck = (prop, fn, message) => {
  return body(prop).custom(fn).withMessage(message);
};

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};
