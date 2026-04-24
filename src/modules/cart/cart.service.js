const cartRepository = require("./cart.repository");

async function addItem(payload) {
  const item = await cartRepository.upsertItem(payload.userId, payload.productId, payload.qty);
  return { ok: true, data: item };
}

async function removeItem(payload) {
  await cartRepository.removeItem(payload.userId, payload.productId);
  return { ok: true, data: { removed: true } };
}

async function getCart(userId) {
  const items = await cartRepository.listCart(userId);
  const total = items.reduce((sum, i) => sum + Number(i.Product?.price || 0) * i.qty, 0);
  return { ok: true, data: { items, total } };
}

module.exports = { addItem, removeItem, getCart };

