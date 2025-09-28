import { webstoriesService } from '../services/webstories.service.js';

export const webstoriesController = {
  async list(req, reply) {
    const list = await webstoriesService.list();
    return reply.code(200).send(list);
  },

  async get(req, reply) {
    const id = req.params.id;
    const story = await webstoriesService.get(id);
    if (!story) return reply.code(404).send({ error: 'Not found' });
    return reply.code(200).send(story);
  },

  async create(req, reply) {
    const payload = req.body;
    const created = await webstoriesService.create(payload, req.user);
    return reply.code(201).send(created);
  },

  async remove(req, reply) {
    const id = req.params.id;
    await webstoriesService.remove(id);
    return reply.code(200).send({ message: 'Deleted' });
  }
};
