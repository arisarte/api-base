import { usersController } from '../controllers/users.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export default async function usersRoutes(app) {
  app.get('/', usersController.list);
  app.get('/:id', usersController.get);
  app.put('/:id', { preHandler: verifyJWT }, usersController.update);
}
