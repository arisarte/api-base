import { cookiesRepository } from '../repositories/cookies.repository.js';

export const cookiesService = {
  async saveConsent(ip, consent) {
    return cookiesRepository.save(ip, consent);
  },
  getPolicy() {
    return {
      version: '1.0',
      last_updated: new Date(),
      cookies: [
        { name: 'session', purpose: 'Authenticate user', required: true },
        { name: 'analytics', purpose: 'Usage metrics', required: false }
      ]
    };
  },
  // admin helper
  async getAllConsents() {
    return cookiesRepository.findAll();
  }
};
