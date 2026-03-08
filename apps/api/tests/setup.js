process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/blog_api_test?schema=public';
process.env.CORS_ORIGINS = 'http://127.0.0.1:4173,http://127.0.0.1:4174';
