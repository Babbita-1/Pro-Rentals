export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function formatPrice(price) {
  return `₨${Number(price).toLocaleString('en-IN')}`;
} 