import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatContextWindow(k: number): string {
  if (k >= 1000) return `${k / 1000}M`;
  return `${k}K`;
}

export function formatPrice(price: number): string {
  if (price === 0) return "FREE";
  return `$${price.toFixed(2)}`;
}

export function formatElo(elo: number): string {
  return elo.toLocaleString();
}
