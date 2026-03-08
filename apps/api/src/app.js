import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { adminRouter } from './routes/admin-routes.js';
import { authRouter } from './routes/auth-routes.js';
import { postRouter } from './routes/post-routes.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
