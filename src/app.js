// src/app.js
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart'; // ✅ Novo pacote para Fastify 5
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/config.js';
import errorHandler from './middlewares/error.middleware.js';
import { registerSecurity } from './middlewares/security.middleware.js';

// Rotas
import healthRoutes from './routes/health.routes.js';
import itemsRoutes from './routes/items.routes.js';
import authRoutes from './routes/auth.routes.js';
import articlesRoutes from './routes/articles.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import usersRoutes from './routes/users.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import cookiesRoutes from './routes/cookies.routes.js';
import webstoriesRoutes from './routes/webstories.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildApp() {
  const app = Fastify({ logger: true });

  // CORS dinâmico
  app.register(fastifyCors, {
    origin: config.corsOrigins.length > 0 ? config.corsOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // Segurança (rate limit + helmet)
  app.register(registerSecurity);

  // Middleware global de erro
  app.register(errorHandler);

  // Upload de arquivos (multipart/form-data)
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 // 10 MB
    }
  });

  // Arquivos estáticos
  app.register(fastifyStatic, {
    root: join(__dirname, '../uploads'),
    prefix: '/uploads/',
    decorateReply: false
  });

  // Rotas
  app.register(healthRoutes);
  app.register(itemsRoutes, { prefix: '/v1/items' });
  app.register(authRoutes, { prefix: '/v1/auth' });
  app.register(articlesRoutes, { prefix: '/v1/articles' });
  app.register(categoriesRoutes, { prefix: '/v1/categories' });
  app.register(uploadRoutes, { prefix: '/v1/upload' });
  app.register(usersRoutes, { prefix: '/v1/users' });
  app.register(commentsRoutes, { prefix: '/v1/comments' });
  app.register(newsletterRoutes, { prefix: '/v1/newsletter' });
  app.register(cookiesRoutes, { prefix: '/v1/cookies' });
  app.register(webstoriesRoutes, { prefix: '/v1/webstories' });

  return app;
}
