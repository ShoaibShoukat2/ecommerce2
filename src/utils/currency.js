export const CURRENCY_SYMBOL = 'Rs.';
export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_COST = 500;

export function formatPrice(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return `${CURRENCY_SYMBOL} 0`;

  const hasDecimals = value % 1 !== 0;
  const formatted = value.toLocaleString('en-PK', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `${CURRENCY_SYMBOL} ${formatted}`;
}
