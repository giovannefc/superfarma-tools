import type { EmprestimoParceiro } from "@prisma/client";

import { prisma } from "~/lib/db.server";

export async function findAll(userId: string) {
  return await prisma.emprestimoParceiro.findMany({
    where: {
      userId,
      ativo: true,
    },
    orderBy: {
      nome: "asc",
    },
  });
}

export async function findById(id: string, userId: string) {
  return await prisma.emprestimoParceiro.findUnique({
    where: {
      id,
      userId,
    },
  });
}

export async function create(
  createParceiroInput: Pick<EmprestimoParceiro, "userId" | "nome" | "ativo">,
) {
  const emprestimoParceiro = await prisma.emprestimoParceiro.create({
    data: createParceiroInput,
  });

  return emprestimoParceiro;
}

export async function update(
  id: string,
  data: Partial<Pick<EmprestimoParceiro, "nome" | "ativo">>,
) {
  return await prisma.emprestimoParceiro.update({
    where: {
      id,
    },
    data,
  });
}

export async function exclude(id: string) {
  return await prisma.emprestimoParceiro.delete({
    where: {
      id,
    },
  });
}

// Tipos derivados das funções
export type ParceiroFromList = Awaited<ReturnType<typeof findAll>>[0];
export type ParceiroOptional = Awaited<ReturnType<typeof findById>>;
