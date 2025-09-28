import { webstoriesRepository } from '../repositories/webstories.repository.js';

export const webstoriesService = {
  async list() {
    return webstoriesRepository.findAll();
  },
  async get(id) {
    return webstoriesRepository.findById(id);
  },
  async create(payload, user) {
    return webstoriesRepository.create({ ...payload, author_id: user?.id || null });
  },
  async remove(id) {
    return webstoriesRepository.remove(id);
  }
};
