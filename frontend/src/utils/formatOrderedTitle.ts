export default function formatOrderedTitle(
  urut: string | null | undefined,
  title: string
) {
  const normalizedOrder = urut?.trim();
  if (!normalizedOrder) return title;

  const orderWithSeparator = normalizedOrder.endsWith('.')
    ? normalizedOrder
    : `${normalizedOrder}.`;
  return `${orderWithSeparator} ${title}`;
}
