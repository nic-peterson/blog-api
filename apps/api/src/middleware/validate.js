import { HttpError } from '../utils/http-error.js';

export function validate(schema, source = 'body') {
  return function validateRequest(req, _res, next) {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(new HttpError(400, 'Validation failed', result.error.flatten()));
      return;
    }

    req[source] = result.data;
    next();
  };
}
