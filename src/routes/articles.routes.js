import { articlesController } from '../controllers/articles.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export default async function articlesRoutes(app) {
  app.get('/', articlesController.list);
  app.get('/:id', articlesController.get);

  app.post('/', { preHandler: verifyJWT }, articlesController.create);
  app.put('/:id', { preHandler: verifyJWT }, articlesController.update);
  app.delete('/:id', { preHandler: verifyJWT }, articlesController.remove);
}
