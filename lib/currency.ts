export function formatCurrency(amount: number, symbol = '€'): string {
  return `${amount.toFixed(2).replace('.', ',')}${symbol}`;
}
