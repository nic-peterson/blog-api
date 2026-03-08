import { Router } from 'express';
import { z } from 'zod';
import {
  createPost,
  deleteComment,
  deletePost,
  listPosts,
  publishPost,
  updatePost
} from '../controllers/admin-controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const createPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  published: z.boolean().optional()
});

const updatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(1).optional(),
    published: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

const publishPostSchema = z.object({
  published: z.boolean().optional()
});

const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/posts', asyncHandler(listPosts));
adminRouter.post('/posts', validate(createPostSchema), asyncHandler(createPost));
adminRouter.put('/posts/:id', validate(updatePostSchema), asyncHandler(updatePost));
adminRouter.patch('/posts/:id/publish', validate(publishPostSchema), asyncHandler(publishPost));
adminRouter.delete('/posts/:id', asyncHandler(deletePost));
adminRouter.delete('/comments/:id', asyncHandler(deleteComment));

export { adminRouter };
