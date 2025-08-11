import type { FetcherWithComponents } from "react-router";

/**
 * Verifica se um fetcher terminou de executar com sucesso
 * @param fetcher - O fetcher do React Router
 * @returns true se o fetcher está idle e tem dados
 */
export function fetcherIsDone<T = any>(
  fetcher: FetcherWithComponents<T>,
): boolean {
  return fetcher.state === "idle" && fetcher.data != null;
}

/**
 * Verifica se um fetcher está carregando
 * @param fetcher - O fetcher do React Router
 * @returns true se o fetcher está submitting ou loading
 */
export function fetcherIsLoading<T = any>(
  fetcher: FetcherWithComponents<T>,
): boolean {
  return fetcher.state === "submitting" || fetcher.state === "loading";
}
