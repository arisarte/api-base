import { cookiesService } from '../services/cookies.service.js';

export const cookiesController = {
  // Accept cookie consent (store preference)
  async accept(req, reply) {
    const { consent } = req.body;
    await cookiesService.saveConsent(req.ip, consent);
    return reply.code(200).send({ message: 'Consent saved' });
  },

  // Get cookie policy (public)
  async policy(req, reply) {
    const policy = cookiesService.getPolicy();
    return reply.code(200).send(policy);
  }
};
