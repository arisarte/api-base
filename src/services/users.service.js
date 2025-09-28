import bcrypt from 'bcrypt';
import { usersRepository } from '../repositories/users.repository.js';

export const usersService = {
  async create(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    return usersRepository.create({ ...data, password: hashed });
  },

  async update(id, data) {
    let hashed = data.password;
    if (data.password) hashed = await bcrypt.hash(data.password, 10);
    return usersRepository.update(id, { name: data.name, password: hashed });
  },

  async getById(id) {
    return usersRepository.findById(id);
  },

  async list() {
    return usersRepository.findAll();
  }
};
