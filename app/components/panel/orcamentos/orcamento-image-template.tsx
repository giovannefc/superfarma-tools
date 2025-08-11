import currency from "currency.js";
import { Boxes, Droplets, Package, Pill } from "lucide-react";
import { useCallback } from "react";

import logo from "~/assets/sfp_logo.png";
import { humanizeAmount } from "~/lib/utils";
import type { Orcamento } from "~/models/types";

// Tipo para item do orçamento
type OrcamentoItem = Orcamento["items"][0];

interface OrcamentoImageTemplateProps {
  orcamento: Orcamento;
}

export function OrcamentoImageTemplate({
  orcamento,
}: OrcamentoImageTemplateProps) {
  // Função para escolher ícone baseado no nome do produto
  const getProductIcon = useCallback((name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("capsula") || lowerName.includes("comprimido")) {
      return <Pill className="h-8 w-8 text-red-400" />;
    } else if (
      lowerName.includes("ml") ||
      lowerName.includes("gota") ||
      lowerName.includes("xarope")
    ) {
      return <Droplets className="h-8 w-8 text-red-400" />;
    } else {
      return <Package className="h-8 w-8 text-red-400" />;
    }
  }, []);

  const getUnitSubtotal = (item: OrcamentoItem) => {
    const value = currency(item.total, {
      decimal: ",",
    }).divide(item.qty).value;
    return value;
  };

  const subTotal = orcamento.items.reduce(
    (acc, item) =>
      acc + currency(item.amount, { decimal: "," }).multiply(item.qty).value,
    0,
  );

  const hasDiscount = (item: OrcamentoItem) => {
    const amount = getUnitSubtotal(item);
    const finalAmount = currency(item.amount, { decimal: "," }).value;
    return amount !== finalAmount;
  };

  const hasTotalDiscount = orcamento.items.some(hasDiscount);

  // Componente para renderizar item do orçamento
  const OrcamentoItemComponent = useCallback(
    ({ item, index }: { item: OrcamentoItem; index: number }) => (
      <div
        key={index}
        className="border-b border-gray-100 px-6 py-4 last:border-b-0"
      >
        <div className="flex items-start gap-4">
          {/* Ícone do produto */}
          <div className="mt-1 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
            {getProductIcon(item.name)}
          </div>

          {/* Informações do produto */}
          <div className="min-w-0 flex-1">
            {/* Nome do produto */}
            <h3 className="mb-1 text-lg leading-tight font-semibold text-gray-800">
              {item.name}
            </h3>

            {/* Descrição */}
            <div className="flex items-center justify-between">
              {!hasDiscount(item) ? (
                <p className="font-semibold text-gray-400">{item.amount}</p>
              ) : (
                <p className="text-gray-400">
                  de <span className="line-through">{item.amount}</span>
                </p>
              )}

              {/* Preço unitário original - só mostra se for diferente do total */}
              {hasDiscount(item) && (
                <p className="font-semibold text-gray-400">
                  por {humanizeAmount(getUnitSubtotal(item))}
                </p>
              )}
            </div>

            {/* Linha com quantidade e preços */}
            <div className="flex items-center justify-between">
              {/* Quantidade com ícone */}
              <div className="flex items-center gap-1 text-gray-700">
                <span className="text-lg" aria-label="Quantidade">
                  ≡
                </span>
                <span className="text-lg font-bold">
                  {item.qty} {Number(item.qty) === 1 ? "unidade" : "unidades"}
                </span>
              </div>

              {/* Preços */}
              <div className="text-right">
                {/* Preço final */}
                <p className="text-2xl font-bold text-red-600">{item.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [getProductIcon],
  );

  return (
    <div
      className="w-[540px] overflow-hidden rounded-lg border border-gray-200 bg-white"
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "auto",
        display: "block",
      }}
    >
      {/* Header com logo */}
      <header className="flex items-center justify-center border-b border-gray-200 bg-white py-2">
        <img
          src={logo}
          alt="Super Farma Popular"
          className="h-24 object-contain"
          loading="eager"
        />
      </header>

      {/* Itens do orçamento */}
      <div className="bg-white">
        {orcamento.items.map((item, index) => (
          <OrcamentoItemComponent
            key={`item-${index}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      {/* Resumo com ícone de caixa */}
      <section className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {orcamento.items.length === 1 ? (
              <Package className="h-6 w-6 text-red-600" aria-hidden="true" />
            ) : (
              <Boxes className="h-6 w-6 text-red-600" aria-hidden="true" />
            )}
            <span className="text-lg font-medium text-gray-700">
              {orcamento.items.length === 1
                ? `${orcamento.items.length} Produto`
                : `${orcamento.items.length} Produtos`}
            </span>
          </div>
          {hasTotalDiscount && (
            <span className="text-2xl text-gray-500 line-through">
              {humanizeAmount(subTotal)}
            </span>
          )}
        </div>
      </section>

      {/* Card do total */}
      <footer className="mx-6 mb-6 rounded-lg bg-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-gray-700">Total</span>
          <span className="text-3xl font-bold text-gray-800">
            {orcamento.total}
          </span>
        </div>
      </footer>
    </div>
  );
}
