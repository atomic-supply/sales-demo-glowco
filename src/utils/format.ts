export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatNumberOrNull(value: number | null): string {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null) return "-";
  return `${value}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toLocaleString();
}

export function formatRate(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatWOS(value: number): string {
  return value.toFixed(1);
}

export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
