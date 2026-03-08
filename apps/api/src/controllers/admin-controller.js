import { prisma } from '../lib/prisma.js';
import { HttpError } from '../utils/http-error.js';
import { buildUniqueSlugForPost } from '../utils/slug.js';

function parseId(rawId) {
  const id = Number.parseInt(rawId, 10);
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Invalid id');
  }

  return id;
}

export async function listPosts(_req, res) {
  const posts = await prisma.post.findMany({
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          authorName: true,
          authorEmail: true,
          content: true,
          createdAt: true
        }
      },
      author: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });

  res.json({ posts });
}

export async function createPost(req, res) {
  const authorId = Number.parseInt(req.user?.sub, 10);
  if (Number.isNaN(authorId)) {
    throw new HttpError(401, 'Invalid auth payload');
  }

  const published = req.body.published ?? false;
  const slug = await buildUniqueSlugForPost(prisma, req.body.title);

  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      slug,
      content: req.body.content,
      published,
      publishedAt: published ? new Date() : null,
      authorId
    }
  });

  res.status(201).json({ post });
}

export async function updatePost(req, res) {
  const id = parseId(req.params.id);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { id: true, title: true, published: true, publishedAt: true }
  });

  if (!existingPost) {
    throw new HttpError(404, 'Post not found');
  }

  const updates = {};

  if (req.body.title !== undefined) {
    updates.title = req.body.title;
    updates.slug = await buildUniqueSlugForPost(prisma, req.body.title, id);
  }

  if (req.body.content !== undefined) {
    updates.content = req.body.content;
  }

  if (req.body.published !== undefined) {
    updates.published = req.body.published;
    updates.publishedAt = req.body.published ? existingPost.publishedAt ?? new Date() : null;
  }

  const post = await prisma.post.update({
    where: { id },
    data: updates
  });

  res.json({ post });
}

export async function publishPost(req, res) {
  const id = parseId(req.params.id);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { id: true, published: true, publishedAt: true }
  });

  if (!existingPost) {
    throw new HttpError(404, 'Post not found');
  }

  const targetPublished =
    req.body.published === undefined ? !existingPost.published : req.body.published;

  const post = await prisma.post.update({
    where: { id },
    data: {
      published: targetPublished,
      publishedAt: targetPublished ? existingPost.publishedAt ?? new Date() : null
    }
  });

  res.json({ post });
}

export async function deletePost(req, res) {
  const id = parseId(req.params.id);
  await prisma.post.delete({ where: { id } });
  res.status(204).send();
}

export async function deleteComment(req, res) {
  const id = parseId(req.params.id);
  await prisma.comment.delete({ where: { id } });
  res.status(204).send();
}
