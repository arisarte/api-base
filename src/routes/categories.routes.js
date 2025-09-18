import { categoriesController } from '../controllers/categories.controller.js';

export default async function categoriesRoutes(app) {
  app.get('/', categoriesController.list);
  app.get('/:id', categoriesController.get);
  app.post('/', categoriesController.create);
  app.put('/:id', categoriesController.update);
  app.delete('/:id', categoriesController.remove);
}
