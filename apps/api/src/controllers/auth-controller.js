import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!passwordMatches || !user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  res.json({
    token,
    tokenType: 'Bearer',
    expiresIn: env.JWT_EXPIRES_IN,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
}
