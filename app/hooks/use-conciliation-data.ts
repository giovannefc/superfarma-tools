import { useEffect, useState } from "react";

import type { ConciliacaoWithCount } from "~/models/conciliacao.server";
import type { RedeResult, SistemaResult, VendaSistema } from "~/models/types";
import { orderBy } from "~/utils";

const bandeiraExchange = {
  Mastercard: "MASTER/VISA",
  Visa: "MASTER/VISA",
  Elo: "ELO/OUTROS",
  Hipercard: "ELO/OUTROS",
} as const;

interface UseConciliationDataProps {
  conciliacao: NonNullable<
    Awaited<ReturnType<typeof import("~/models/conciliacao.server").findOne>>
  >;
  vendasSistema: VendaSistema[];
}

export function useConciliationData({
  conciliacao,
  vendasSistema,
}: UseConciliationDataProps) {
  const [redeResult, setRedeResult] = useState<RedeResult[]>([]);
  const [sistemaResult, setSistemaResult] = useState<SistemaResult[]>([]);

  useEffect(() => {
    if (conciliacao && vendasSistema) {
      const vendasRestantes = [...vendasSistema];

      const redeResult = conciliacao.cartoes.map(cartao => {
        let confere = false;
        let confereModalidade = false;
        let confereBandeira = false;

        const valorIndex = vendasRestantes.findIndex(
          venda => venda.valor === Number(cartao.valor),
        );

        const comModalidadeIndex = vendasRestantes.findIndex(sistema => {
          return (
            sistema.valor === Number(cartao.valor) &&
            sistema.modalidade === cartao.modalidade
          );
        });

        if (valorIndex !== -1 && comModalidadeIndex !== -1) {
          confere = true;
          confereModalidade = true;
          const comBandeiraIndex = vendasRestantes.findIndex(
            venda =>
              venda.modalidade === cartao.modalidade &&
              venda.valor === Number(cartao.valor) &&
              venda.bandeira ===
                bandeiraExchange[
                  cartao.bandeira as keyof typeof bandeiraExchange
                ],
          );
          if (comBandeiraIndex !== -1) {
            confereBandeira = true;
            vendasRestantes.splice(comBandeiraIndex, 1);
          } else {
            vendasRestantes.splice(comModalidadeIndex, 1);
          }
        } else if (valorIndex !== -1) {
          confere = true;
          vendasRestantes.splice(valorIndex, 1);
        }

        return {
          ...cartao,
          confere,
          dataHora: new Date(cartao.dataHora),
          valor: Number(cartao.valor),
          createdAt: new Date(cartao.createdAt!),
          updatedAt: new Date(cartao.updatedAt!),
          confereModalidade,
          confereBandeira,
        };
      });
      setRedeResult(redeResult);

      // Sistema - copiado exatamente do projeto original
      const cartoesRestantes = [...conciliacao.cartoes];

      const sistemaResult = vendasSistema.map(vendaSistema => {
        const index = cartoesRestantes.findIndex(
          cartao => Number(cartao.valor) === vendaSistema.valor,
        );

        let confere = false;

        if (index !== -1) {
          confere = true;
          cartoesRestantes.splice(index, 1);
        }

        return {
          ...vendaSistema,
          dataemissao: new Date(vendaSistema.dataemissao),
          datavencimento: new Date(vendaSistema.datavencimento),
          confere,
        };
      });
      setSistemaResult(orderBy(sistemaResult, ["valor"], ["asc"]));
    }
  }, [conciliacao, vendasSistema]);

  // Estatísticas calculadas
  const statistics = {
    totalRede: redeResult.reduce((acc, item) => acc + item.valor, 0),
    totalSistema: sistemaResult.reduce(
      (acc, item) => acc + Number(item.valor),
      0,
    ),
    conferidos: redeResult.filter(item => item.confere).length,
    naoEncontrados: redeResult.filter(item => !item.confere).length,
    divergenciaModalidade: redeResult.filter(
      item => item.confere && !item.confereModalidade,
    ).length,
    divergenciaBandeira: redeResult.filter(
      item => item.confere && item.confereModalidade && !item.confereBandeira,
    ).length,
    redeCount: redeResult.length,
    sistemaCount: sistemaResult.length,
  };

  return {
    redeResult,
    sistemaResult,
    statistics,
  };
}
