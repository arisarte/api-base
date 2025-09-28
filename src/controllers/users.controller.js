import { usersService } from '../services/users.service.js';

export const usersController = {
  async list(req, reply) {
    const data = await usersService.list();
    reply.send({ success: true, message: 'OK', data });
  },

  async get(req, reply) {
    const data = await usersService.getById(req.params.id);
    if (!data) return reply.code(404).send({ error: 'Usuário não encontrado' });
    reply.send({ success: true, message: 'OK', data });
  },

  async update(req, reply) {
    // allow users to update only their own profile or admin
    const user = req.user; // set by auth middleware
    const id = parseInt(req.params.id, 10);
    if (user.id !== id && user.role !== 'admin') return reply.code(403).send({ error: 'Acesso negado' });

    const data = await usersService.update(id, req.body);
    reply.send({ success: true, message: 'Perfil atualizado', data });
  }
};
