export function generateUniqueId() {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
