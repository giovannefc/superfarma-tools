import type {
  Emprestimo,
  EmprestimoStatus,
  EmprestimoTipo,
} from "@prisma/client";

import { prisma } from "~/lib/db.server";

export async function getDashboardStats(userId: string) {
  const [
    totalEmprestimos,
    emprestimosPendentes,
    emprestimosVencidos,
    parceirosMaisAtivos,
    emprestimosRecentes,
  ] = await Promise.all([
    // Total de empréstimos
    prisma.emprestimo.count({
      where: { userId },
    }),

    // Empréstimos pendentes por status
    prisma.emprestimo.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),

    // Empréstimos vencidos (mais de 30 dias)
    prisma.emprestimo.count({
      where: {
        userId,
        status: { in: ["PENDENTE", "SEPARADO"] },
        data: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
        },
      },
    }),

    // Parceiros mais ativos
    prisma.emprestimo.groupBy({
      by: ["parceiroId"],
      where: { userId },
      _count: { parceiroId: true },
      orderBy: { _count: { parceiroId: "desc" } },
      take: 5,
    }),

    // Empréstimos recentes
    prisma.emprestimo.findMany({
      where: { userId },
      include: { parceiro: true },
      orderBy: { data: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalEmprestimos,
    emprestimosPendentes,
    emprestimosVencidos,
    parceirosMaisAtivos,
    emprestimosRecentes,
  };
}

export async function findAll(userId: string, tipo: EmprestimoTipo) {
  return await prisma.emprestimo.findMany({
    where: {
      userId,
      tipo,
    },
    include: {
      parceiro: true,
    },
    orderBy: {
      data: "desc",
    },
  });
}

export async function findById(id: string, userId: string) {
  return await prisma.emprestimo.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      parceiro: true,
    },
  });
}

export async function create(
  emprestimoInput: Pick<
    Emprestimo,
    | "userId"
    | "parceiroId"
    | "data"
    | "produto"
    | "fabricante"
    | "quantidade"
    | "requisitante"
    | "status"
    | "tipo"
  >,
) {
  const emprestimo = await prisma.emprestimo.create({
    data: emprestimoInput,
  });

  return emprestimo;
}

export async function update(
  id: string,
  data: { userId: string; status: EmprestimoStatus },
) {
  const emprestimo = await prisma.emprestimo.update({
    where: {
      id,
    },
    data,
  });
  return emprestimo;
}

export async function exclude(id: string) {
  return await prisma.emprestimo.delete({
    where: {
      id,
    },
  });
}

// Tipos derivados das funções
export type EmprestimoWithParceiro = Awaited<ReturnType<typeof findAll>>[0];
export type EmprestimoWithParceiroOptional = Awaited<
  ReturnType<typeof findById>
>;

// Tipo para uso em componentes (com data como string)
export type EmprestimoFormatted = Omit<EmprestimoWithParceiro, "data"> & {
  data: string;
};
