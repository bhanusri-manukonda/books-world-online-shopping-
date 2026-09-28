import { validationResult } from 'express-validator';

// Collects express-validator errors and returns the first readable message.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  res.status(400);
  throw new Error(errors.array()[0].msg);
};

export default validate;
