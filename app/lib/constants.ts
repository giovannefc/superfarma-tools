// Constantes que replicam os enums do Prisma para uso em runtime
export const EmprestimoTipo = {
  ENTRADA: "ENTRADA",
  SAIDA: "SAIDA",
} as const;

export const EmprestimoStatus = {
  PAGO: "PAGO",
  PENDENTE: "PENDENTE",
  SEPARADO: "SEPARADO",
} as const;

// Types derivados das constantes
export type EmprestimoTipo =
  (typeof EmprestimoTipo)[keyof typeof EmprestimoTipo];
export type EmprestimoStatus =
  (typeof EmprestimoStatus)[keyof typeof EmprestimoStatus];
