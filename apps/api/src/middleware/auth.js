import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

function extractToken(authorizationHeader = '') {
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export function requireAuth(req, _res, next) {
  const token = extractToken(req.get('authorization'));
  if (!token) {
    next(new HttpError(401, 'Missing Bearer token'));
    return;
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function requireRole(role) {
  return function enforceRole(req, _res, next) {
    if (!req.user || req.user.role !== role) {
      next(new HttpError(403, `Requires ${role} role`));
      return;
    }

    next();
  };
}
