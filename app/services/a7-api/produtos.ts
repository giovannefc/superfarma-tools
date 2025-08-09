import { formatDateOnly } from "~/utils";

import { fetchA7API } from "./client";
import type { PosicaoEstoque, Produto } from "./types";

export async function getProdutos(search: string): Promise<Produto[]> {
  return fetchA7API(`/produtos?search=${encodeURIComponent(search)}`);
}

export async function getPosicaoEstoque(date: Date): Promise<PosicaoEstoque> {
  const formattedDate = formatDateOnly(date);
  return fetchA7API(`/produtos/estoque?date=${formattedDate}`);
}
