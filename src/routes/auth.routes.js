import { authController } from '../controllers/auth.controller.js';
import { validateRegister, validateUserUpdate } from '../schemas/user.schema.js';
import { validateSchema } from '../middlewares/validate-schema.js';

export default async function authRoutes(app) {
  app.post('/register', async (req, reply) => {
    if (!(await validateSchema(validateRegister)(req, reply))) return;
    return authController.register(req, reply);
  });
  app.post('/login', authController.login);
  app.post('/refresh', authController.refreshToken);
  app.post('/logout', authController.logout);
}
