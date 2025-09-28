import { newsletterRepository } from '../repositories/newsletter.repository.js';

export const newsletterService = {
  async subscribe(email) {
    return newsletterRepository.create(email);
  },
  async unsubscribe(email) {
    return newsletterRepository.removeByEmail(email);
  },
  async list() {
    return newsletterRepository.findAll();
  }
};
