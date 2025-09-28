import { commentsController } from '../controllers/comments.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export default async function commentsRoutes(app) {
  // Create a comment (auth required)
  app.post('/', { preHandler: verifyJWT }, commentsController.create);

  // List comments for an article (public)
  app.get('/article/:articleId', commentsController.listByArticle);

  // Delete a comment (auth required; ownership or admin enforced in service)
  app.delete('/:id', { preHandler: verifyJWT }, commentsController.remove);
}
