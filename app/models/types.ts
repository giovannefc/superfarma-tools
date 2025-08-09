import type { Cartao } from "@prisma/client";

export interface VendaSistema {
  dataemissao: Date;
  datavencimento: Date;
  status: "A";
  valor: number;
  modalidade: string;
  bandeira: string;
  parcelas: string;
}

export interface VendaRede {
  "data da venda": string;
  "hora da venda": string;
  "status da venda": string;
  "valor da venda original": string;
  "valor da venda atualizado": string;
  modalidade: string;
  tipo: string;
  "número de parcelas": string;
  bandeira: string;
  "taxa MDR": string;
  "valor MDR": string;
  "taxa de Antecipação Flex": string;
  "valor taxa de Antencipação Flex": string;
  "taxas descontadas (MDR+Flex)": string;
  "valor total das taxas descontadas (MDR+Flex)": string;
  "valor líquido": string;
  "NSU/CV": string;
  "Prazo de recebimento": string;
  "resumo de vendas/número do lote": string;
  "número da autorização (Auto)": string;
  "número do estabelecimento": string;
  "nome do estabelecimento": string;
  CNPJ: string;
  "número do cartão": string;
  "id carteira digital": string;
  "meio de pagamento": string;
  "tipo de maquininha": string;
  "código da maquininha": string;
  TID: string;
  "número do pedido": string;
  "taxa de embarque": string;
  "cancelada pelo estabelecimento": string;
  "data do cancelamento": string;
  "valor cancelado": string;
  "em disputa de chargeback": string;
  "data que entrou em disputa de chargeback": string;
  "resolução do chargeback": string;
  "data da resolução do chargeback": string;
  "nacionalidade do cartão": string;
  "moeda estrangeira (DCC)": string;
  "cartão pré-pago": string;
}

export type RedeResult = Omit<Cartao, "valor"> & {
  confere: boolean;
  confereModalidade: boolean;
  confereBandeira: boolean;
  valor: number;
};

export type SistemaResult = VendaSistema & {
  confere: boolean;
};

export interface Orcamento {
  codigo: number;
  total: string;
  items: {
    name: string;
    amount: string;
    qty: string;
    total: string;
  }[];
}
