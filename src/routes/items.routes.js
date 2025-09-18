import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/items.controller.js';

export default async function itemsRoutes(app) {
  app.get('/', listItems);
  app.get('/:id', getItem);
  app.post('/', createItem);
  app.put('/:id', updateItem);
  app.delete('/:id', deleteItem);
}
