import * as service from '../services/items.service.js';
import { success } from '../utils/response.js';

export async function listItems(req, reply) {
  const items = await service.getAllItems();
  return reply.send(success(items));
}

export async function getItem(req, reply) {
  const { id } = req.params;
  const item = await service.getItem(id);
  return reply.send(success(item));
}

export async function createItem(req, reply) {
  const { name, slug } = req.body;
  const item = await service.addItem({ name, slug });
  return reply.code(201).send(success(item, 'Item criado com sucesso'));
}

export async function updateItem(req, reply) {
  const { id } = req.params;
  const { name, slug } = req.body;
  const item = await service.editItem(id, { name, slug });
  return reply.send(success(item, 'Item atualizado com sucesso'));
}

export async function deleteItem(req, reply) {
  const { id } = req.params;
  await service.removeItem(id);
  return reply.send(success(null, 'Item removido com sucesso'));
}
