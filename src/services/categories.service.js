import { categoriesRepository } from '../repositories/categories.repository.js';

export const categoriesService = {
  async getAll() {
    return await categoriesRepository.findAll();
  },

  async getById(id) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      const error = new Error('Categoria não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return category;
  },

  async create(data) {
    if (!data.name || !data.slug) {
      const error = new Error('Campos obrigatórios: name, slug');
      error.statusCode = 400;
      throw error;
    }
    return await categoriesRepository.create(data);
  },

  async update(id, data) {
    await this.getById(id); // garante que existe
    return await categoriesRepository.update(id, data);
  },

  async remove(id) {
    await this.getById(id); // garante que existe
    return await categoriesRepository.remove(id);
  }
};
