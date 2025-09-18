import { authService } from '../services/auth.service.js';

export const authController = {
  async login(req, reply) {
    const { username, password } = req.body;
    const data = await authService.login({ username, password });
    reply.send({ success: true, message: 'Login realizado', data });
  }
};
