import { articlesRepository } from '../repositories/articles.repository.js';

export const articlesService = {
  async getAll() {
    return await articlesRepository.findAll();
  },

  async getById(id) {
    const article = await articlesRepository.findById(id);
    if (!article) {
      const error = new Error('Artigo não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return article;
  },

  async create(data) {
    return await articlesRepository.create(data);
  },

  async update(id, data) {
    await this.getById(id); // garante que existe
    return await articlesRepository.update(id, data);
  },

  async remove(id) {
    await this.getById(id); // garante que existe
    return await articlesRepository.remove(id);
  }
};
