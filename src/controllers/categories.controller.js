import { categoriesService } from '../services/categories.service.js';

export const categoriesController = {
  async list(req, reply) {
    const data = await categoriesService.getAll();
    reply.send({ success: true, message: 'OK', data });
  },

  async get(req, reply) {
    const data = await categoriesService.getById(req.params.id);
    reply.send({ success: true, message: 'OK', data });
  },

  async create(req, reply) {
    const data = await categoriesService.create(req.body);
    reply.code(201).send({ success: true, message: 'Categoria criada', data });
  },

  async update(req, reply) {
    const data = await categoriesService.update(req.params.id, req.body);
    reply.send({ success: true, message: 'Categoria atualizada', data });
  },

  async remove(req, reply) {
    await categoriesService.remove(req.params.id);
    reply.send({ success: true, message: 'Categoria removida' });
  }
};
