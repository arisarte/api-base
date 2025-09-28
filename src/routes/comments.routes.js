import { commentsController } from '../controllers/comments.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateComment, commentSchema } from '../schemas/comment.schema.js';
import { validateSchema } from '../middlewares/validate-schema.js';

export default async function commentsRoutes(app) {
  // Create a comment (auth required)
  app.post('/', { preHandler: verifyJWT }, async (req, reply) => {
    if (!(await validateSchema(validateComment)(req, reply))) return;
    return commentsController.create(req, reply);
  });

  // List comments for an article (public)
  app.get('/article/:articleId', commentsController.listByArticle);

  // Delete a comment (auth required; ownership or admin enforced in service)
  app.delete('/:id', { preHandler: verifyJWT }, commentsController.remove);
}
