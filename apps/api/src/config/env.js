import dotenv from 'dotenv';

dotenv.config();

const testDatabaseUrl = 'postgresql://postgres:postgres@127.0.0.1:5432/blog_api_test?schema=public';

function requiredValue(name, fallback) {
  const rawValue = process.env[name] ?? fallback;
  if (rawValue === undefined || rawValue === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return rawValue;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const jwtSecretFallback = nodeEnv === 'test' ? 'test-secret' : undefined;
const databaseFallback = nodeEnv === 'test' ? testDatabaseUrl : undefined;

const corsOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  NODE_ENV: nodeEnv,
  PORT: Number.parseInt(process.env.PORT ?? '4000', 10),
  DATABASE_URL: requiredValue('DATABASE_URL', databaseFallback),
  JWT_SECRET: requiredValue('JWT_SECRET', jwtSecretFallback),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '2h',
  CORS_ORIGINS: corsOrigins,
  ALLOW_VERCEL_PREVIEWS: process.env.ALLOW_VERCEL_PREVIEWS === 'true'
};

process.env.DATABASE_URL = env.DATABASE_URL;
