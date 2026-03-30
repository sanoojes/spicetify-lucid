export default function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
