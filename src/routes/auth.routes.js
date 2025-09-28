import { authController } from '../controllers/auth.controller.js';

export default async function authRoutes(app) {
  app.post('/register', authController.register);
  app.post('/login', authController.login);
  app.post('/refresh', authController.refreshToken);
  app.post('/logout', authController.logout);
}
