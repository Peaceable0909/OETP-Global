const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  THB: "฿",
  NGN: "₦",
};

export function formatMoney(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return symbol ? `${symbol}${amount.toLocaleString()}` : `${currency} ${amount.toLocaleString()}`;
}
