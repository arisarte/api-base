import { commentsService } from '../services/comments.service.js';

export const commentsController = {
  async create(req, reply) {
    try {
      const userId = req.user.id;
      const payload = req.body; // { article_id, content }
      const data = await commentsService.create(userId, payload);
      reply.code(201).send({ success: true, message: 'Comentário criado', data });
    } catch (err) {
      reply.code(400).send({ error: err.message });
    }
  },

  async listByArticle(req, reply) {
    const articleId = req.params.articleId;
    const data = await commentsService.listByArticle(articleId);
    reply.send({ success: true, message: 'OK', data });
  },

  async remove(req, reply) {
    try {
      const user = req.user;
      const id = req.params.id;
      await commentsService.remove(user, id);
      reply.send({ success: true, message: 'Comentário removido' });
    } catch (err) {
      if (err.code === 'FORBIDDEN') return reply.code(403).send({ error: 'Acesso negado' });
      return reply.code(400).send({ error: err.message });
    }
  }
};
