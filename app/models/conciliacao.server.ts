import type { Conciliacao } from "@prisma/client";
import { addMinutes, max, min, subMinutes } from "date-fns";

import { prisma } from "~/lib/db.server";

import type { VendaRede } from "./types";

export async function findAll(userId: string) {
  return await prisma.conciliacao.findMany({
    where: {
      userId,
    },
    orderBy: {
      dataFinal: "desc",
    },
    include: {
      _count: {
        select: {
          cartoes: true,
        },
      },
    },
  });
}

// Tipo derivado do retorno da função findAll
export type ConciliacaoWithCount = Awaited<ReturnType<typeof findAll>>[0];

export async function findOne(id: string, userId: string) {
  return await prisma.conciliacao.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      cartoes: {
        orderBy: {
          valor: "asc",
        },
      },
    },
  });
}

export async function create(vendas: VendaRede[], userId: string) {
  const cartoes = vendas
    .filter(venda => {
      // Verificar se tem status da venda
      const status = venda["status da venda"];
      return status && status !== "estornada";
    })
    .map(venda => {
      // Validar campos obrigatórios
      const dataVenda = venda["data da venda"];
      const horaVenda = venda["hora da venda"];
      const valorOriginal = venda["valor da venda original"];

      if (!dataVenda) {
        console.error("Campo 'data da venda' não encontrado:", venda);
        throw new Error("Campo 'data da venda' é obrigatório");
      }

      if (!horaVenda) {
        console.error("Campo 'hora da venda' não encontrado:", venda);
        throw new Error("Campo 'hora da venda' é obrigatório");
      }

      if (!valorOriginal) {
        console.error("Campo 'valor da venda original' não encontrado:", venda);
        throw new Error("Campo 'valor da venda original' é obrigatório");
      }

      const [dia, mes, ano] = dataVenda.split("/");
      const [hora, minuto, segundo] = horaVenda.split(":");

      // Log temporário para debug das datas
      const dataProcessada = new Date(
        Date.UTC(
          Number(ano),
          Number(mes) - 1,
          Number(dia),
          Number(hora),
          Number(minuto),
          Number(segundo),
        ),
      );
      console.log(
        `Data processada: ${dataVenda} ${horaVenda} -> ${dataProcessada.toISOString()}`,
      );

      // Tratamento simples e direto do valor
      let valorProcessado: number;
      try {
        // Converter vírgula para ponto e remover espaços
        const valorLimpo = String(valorOriginal).trim().replace(",", ".");

        // Usar parseFloat diretamente
        valorProcessado = parseFloat(valorLimpo);

        if (isNaN(valorProcessado) || valorProcessado <= 0) {
          throw new Error(
            `Valor inválido: ${valorOriginal} -> ${valorLimpo} -> ${valorProcessado}`,
          );
        }
      } catch (error) {
        console.error("Erro ao converter valor:", valorOriginal, error);
        throw new Error(`Erro ao converter valor "${valorOriginal}": ${error}`);
      }

      return {
        dataHora: dataProcessada,
        modalidade: venda.modalidade as "débito" | "crédito",
        bandeira: venda.bandeira as "Mastercard" | "Visa" | "Elo" | "Hipercard",
        valor: valorProcessado,
        parcelas: venda["número de parcelas"],
        userId,
      };
    });

  const cartoesDates = cartoes.map(cartao => cartao.dataHora);

  const minDate = min(cartoesDates);
  const maxDate = max(cartoesDates);

  // Usar as datas exatas das transações com margem de 1 minuto para evitar problemas de precisão
  const dataInicial = subMinutes(minDate, 1);
  const dataFinal = addMinutes(maxDate, 1);

  console.log("=== DEBUG DATAS FINAIS ===");
  console.log(`Total de cartões processados: ${cartoes.length}`);
  console.log("Primeira data dos cartões:", minDate.toISOString());
  console.log("Última data dos cartões:", maxDate.toISOString());
  console.log("Data inicial definida (com margem):", dataInicial.toISOString());
  console.log("Data final definida (com margem):", dataFinal.toISOString());
  console.log("============================");
  console.log("==================");

  const conciliacao: Pick<Conciliacao, "dataInicial" | "dataFinal"> = {
    dataInicial,
    dataFinal,
  };

  return await prisma.conciliacao.create({
    data: {
      ...conciliacao,
      userId,
      cartoes: {
        createMany: {
          data: cartoes,
        },
      },
    },
  });
}
