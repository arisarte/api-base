import { articlesService } from '../services/articles.service.js';
import { validateArticle } from '../schemas/article.schema.js';
import { validateSchema } from '../middlewares/validate-schema.js';

export const articlesController = {
  async list(req, reply) {
    const data = await articlesService.getAll();
    reply.send({ success: true, message: 'OK', data });
  },

  async get(req, reply) {
    const data = await articlesService.getById(req.params.id);
    reply.send({ success: true, message: 'OK', data });
  },

  async create(req, reply) {
    if (!(await validateSchema(validateArticle)(req, reply))) return;
    const data = await articlesService.create(req.body);
    reply.code(201).send({ success: true, message: 'Artigo criado', data });
  },

  async update(req, reply) {
    if (!(await validateSchema(validateArticle)(req, reply))) return;
    const data = await articlesService.update(req.params.id, req.body);
    reply.send({ success: true, message: 'Artigo atualizado', data });
  },

  async remove(req, reply) {
    await articlesService.remove(req.params.id);
    reply.send({ success: true, message: 'Artigo removido' });
  }
};
