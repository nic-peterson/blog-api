import { prisma } from '../lib/prisma.js';
import { HttpError } from '../utils/http-error.js';

function postSelect(includeComments = false) {
  return {
    id: true,
    title: true,
    slug: true,
    content: true,
    published: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        email: true
      }
    },
    ...(includeComments
      ? {
          comments: {
            select: {
              id: true,
              authorName: true,
              authorEmail: true,
              content: true,
              createdAt: true,
              updatedAt: true
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      : {})
  };
}

export async function listPublishedPosts(_req, res) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: postSelect()
  });

  res.json({ posts });
}

export async function getPublishedPost(req, res) {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    select: postSelect(true)
  });

  if (!post || !post.published) {
    throw new HttpError(404, 'Post not found');
  }

  res.json({ post });
}

export async function listPostComments(req, res) {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    select: {
      id: true,
      published: true,
      comments: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          authorName: true,
          authorEmail: true,
          content: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  if (!post || !post.published) {
    throw new HttpError(404, 'Post not found');
  }

  res.json({ comments: post.comments });
}

export async function createComment(req, res) {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    select: { id: true, published: true }
  });

  if (!post || !post.published) {
    throw new HttpError(404, 'Post not found');
  }

  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      authorName: req.body.authorName,
      authorEmail: req.body.authorEmail,
      content: req.body.content
    }
  });

  res.status(201).json({ comment });
}
