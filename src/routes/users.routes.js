import { usersController } from '../controllers/users.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateUserUpdate } from '../schemas/user.schema.js';
import { validateSchema } from '../middlewares/validate-schema.js';

export default async function usersRoutes(app) {
  app.get('/', usersController.list);
  app.get('/:id', usersController.get);
  app.put('/:id', { preHandler: verifyJWT }, async (req, reply) => {
    if (!(await validateSchema(validateUserUpdate)(req, reply))) return;
    return usersController.update(req, reply);
  });
}
