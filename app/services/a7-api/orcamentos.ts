import { fetchA7API } from "./client";

export async function getOrcamentos() {
  return fetchA7API("/orcamentos");
}
