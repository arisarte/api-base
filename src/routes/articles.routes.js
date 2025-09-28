import { articlesController } from '../controllers/articles.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export default async function articlesRoutes(app) {
  app.get('/', articlesController.list);
  app.get('/:id', articlesController.get);
  // list comments for an article
  app.get('/:id/comments', async (req, reply) => {
    // lazy-load comments service to avoid circular deps
    const { commentsService } = await import('../services/comments.service.js');
    const data = await commentsService.listByArticle(req.params.id);
    reply.send({ success: true, message: 'OK', data });
  });

  app.post('/', { preHandler: verifyJWT }, articlesController.create);
  app.put('/:id', { preHandler: verifyJWT }, articlesController.update);
  app.delete('/:id', { preHandler: verifyJWT }, articlesController.remove);
}
