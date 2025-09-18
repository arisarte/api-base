import * as repo from '../repositories/items.repository.js';

export async function getAllItems() {
  return repo.findAllItems();
}

export async function getItem(id) {
  const item = await repo.findItemById(id);
  if (!item) throw { statusCode: 404, message: 'Item não encontrado' };
  return item;
}

export async function addItem(data) {
  // Aqui poderíamos validar duplicidade de slug, etc.
  return repo.createItem(data);
}

export async function editItem(id, data) {
  await getItem(id); // garante que existe
  return repo.updateItem(id, data);
}

export async function removeItem(id) {
  await getItem(id); // garante que existe
  return repo.deleteItem(id);
}
