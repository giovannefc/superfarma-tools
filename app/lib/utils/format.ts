/**
 * Formata um valor numérico como moeda brasileira
 */
export function humanizeAmount(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Função nativa para substituir lodash.orderBy
 * Ordena um array por múltiplas chaves e direções
 */
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
