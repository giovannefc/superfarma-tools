import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function humanizeDate(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

export function humanizeAmount(amount: number): string {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

// Função nativa para substituir lodash.orderBy
export function orderBy<T>(
  array: T[],
  keys: (keyof T)[],
  orders: ("asc" | "desc")[],
): T[] {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] || "asc";

      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Extrai apenas a parte da data (YYYY-MM-DD) de um objeto Date,
 * ignorando o horário e fuso horário.
 *
 * @param date - Data a ser formatada
 * @returns String no formato YYYY-MM-DD
 *
 * @example
 * const date = new Date('2025-08-01T01:03:23.000Z');
 * formatDateOnly(date); // "2025-08-01"
 */
export function formatDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}
