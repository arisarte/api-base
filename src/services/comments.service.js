import { commentsRepository } from '../repositories/comments.repository.js';
import { articlesRepository } from '../repositories/articles.repository.js';

export const commentsService = {
  async create(user_id, payload) {
    // payload: { article_id, content }
    // (optional) ensure article exists
    const article = await articlesRepository.findById(payload.article_id);
    if (!article) throw new Error('Artigo não encontrado');
    return commentsRepository.create({ user_id, article_id: payload.article_id, content: payload.content });
  },

  async listByArticle(article_id) {
    return commentsRepository.findByArticle(article_id);
  },

  async remove(user, commentId) {
    const comment = await commentsRepository.findById(commentId);
    if (!comment) throw new Error('Comentário não encontrado');
    // Only owner or admin can delete
    if (user.role !== 'admin' && user.id !== comment.user_id) {
      const err = new Error('Acesso negado');
      err.code = 'FORBIDDEN';
      throw err;
    }
    await commentsRepository.remove(commentId);
    return true;
  }
};
