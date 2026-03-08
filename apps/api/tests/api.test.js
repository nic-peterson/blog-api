import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/lib/prisma.js', () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn()
      },
      post: {
        findMany: vi.fn(),
        findUnique: vi.fn()
      },
      comment: {
        create: vi.fn(),
        delete: vi.fn()
      }
    }
  };
});

vi.mock('bcryptjs', () => {
  return {
    default: {
      compare: vi.fn()
    }
  };
});

const { default: bcrypt } = await import('bcryptjs');
const { default: app } = await import('../src/app.js');
const { prisma } = await import('../src/lib/prisma.js');

describe('API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for invalid login', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post('/auth/login').send({
      email: 'invalid@example.com',
      password: 'wrong'
    });

    expect(response.status).toBe(401);
  });

  it('returns a token for valid login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@example.com',
      role: 'ADMIN',
      passwordHash: 'hash'
    });
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'admin12345'
    });

    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.token).toBeTypeOf('string');
  });

  it('blocks protected admin route without token', async () => {
    const response = await request(app).get('/admin/posts');

    expect(response.status).toBe(401);
  });

  it('lists only published posts on public endpoint', async () => {
    prisma.post.findMany.mockResolvedValue([
      {
        id: 1,
        title: 'Hello',
        slug: 'hello',
        content: 'Published content',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: { id: 1, email: 'admin@example.com' }
      }
    ]);

    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(1);
    expect(response.body.posts[0].slug).toBe('hello');
  });

  it('validates required comment fields', async () => {
    const response = await request(app).post('/posts/hello/comments').send({
      authorName: '',
      content: ''
    });

    expect(response.status).toBe(400);
  });
});
