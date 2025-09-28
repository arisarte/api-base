import { newsletterService } from '../services/newsletter.service.js';

export const newsletterController = {
  // Subscribe (email)
  async subscribe(req, reply) {
    const { email } = req.body;
    const result = await newsletterService.subscribe(email);
    return reply.code(201).send({ message: 'Subscribed', id: result.id });
  },

  // Unsubscribe
  async unsubscribe(req, reply) {
    const { email } = req.body;
    await newsletterService.unsubscribe(email);
    return reply.code(200).send({ message: 'Unsubscribed' });
  }
};
