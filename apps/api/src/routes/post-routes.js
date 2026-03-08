import { Router } from 'express';
import { z } from 'zod';
import {
  createComment,
  getPublishedPost,
  listPostComments,
  listPublishedPosts
} from '../controllers/posts-controller.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const commentSchema = z.object({
  authorName: z.string().trim().min(1).max(100),
  authorEmail: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined),
  content: z.string().trim().min(1).max(5000)
});

const postRouter = Router();

postRouter.get('/', asyncHandler(listPublishedPosts));
postRouter.get('/:slug', asyncHandler(getPublishedPost));
postRouter.get('/:slug/comments', asyncHandler(listPostComments));
postRouter.post('/:slug/comments', validate(commentSchema), asyncHandler(createComment));

export { postRouter };
