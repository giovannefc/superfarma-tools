import { EmprestimoTipo } from "../types/constants";

/**
 * Determina o tipo de empréstimo baseado na URL da requisição
 * @param request - Request object do React Router
 * @returns Tipo do empréstimo (ENTRADA ou SAIDA)
 */
export function getEmprestimoTipo(request: Request) {
  const location = new URL(request.url).pathname;
  return location === "/panel/emprestimos/deve"
    ? EmprestimoTipo.SAIDA
    : EmprestimoTipo.ENTRADA;
}
