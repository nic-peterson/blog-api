import { HttpError } from '../utils/http-error.js';

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: {
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (error?.code === 'P2002') {
    res.status(409).json({ error: { message: 'Resource conflict' } });
    return;
  }

  if (error?.code === 'P2025') {
    res.status(404).json({ error: { message: 'Resource not found' } });
    return;
  }

  const body = { error: { message: 'Internal server error' } };

  if (process.env.NODE_ENV !== 'production') {
    body.error.details = error?.message;
  }

  res.status(500).json(body);
}
