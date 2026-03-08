import { Router } from 'express';
import { z } from 'zod';
import { login } from '../controllers/auth-controller.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), asyncHandler(login));

export { authRouter };
