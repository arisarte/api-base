import { webstoriesController } from '../controllers/webstories.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateSchema } from '../middlewares/validate-schema.js';
import { validateWebstory, webstorySchema } from '../schemas/webstories.schema.js';

export default async function webstoriesRoutes(app) {
  // public list and get
  app.get('/', webstoriesController.list);
  app.get('/:id', webstoriesController.get);

  // admin-only create and delete
  app.post('/', { preHandler: [verifyJWT, isAdmin] }, async (req, reply) => {
    if (!(await validateSchema(validateWebstory)(req, reply))) return;
    return webstoriesController.create(req, reply);
  });

  app.delete('/:id', { preHandler: [verifyJWT, isAdmin] }, webstoriesController.remove);
}
