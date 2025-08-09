export interface Produto {
  id: string;
  name: string;
  manufacturer: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    path: string;
  };
  categories: any[];
  ean: string;
  listPrice: number;
  percentageDiscount: number;
  discount: number;
  price: number;
  stock: number;
  ofertasQuantidade: any[];
  salesInLast90Days: number;
  monthlyAverageSales: number;
  profitPerUnit: number;
  profitPercentage: number;
  totalProfitInLast90Days: number;
  weightedScore: number;
}

export interface PosicaoEstoque {
  date: string;
  contagem: number;
  total: number;
}

export interface ContaCategory {
  id: number;
  nome: string;
  caminho: string;
  contapagar: ContaPagar[];
  totalContaPagar: number;
}

export interface ContaPagar {
  id: number;
  descricao: string;
  observacao: null;
  dataemissao: Date;
  datavencimentoutil: Date;
  valor: number;
  credor: string;
}

export interface ContaTotal {
  total: number;
}

export interface ContaCategoryTotal {
  data: string;
  total: number;
}

export interface ContaCategoriesTotals {
  totals: {
    id: number;
    nome: string;
    caminho: string;
    nomePai: string;
    total: number;
  }[];
  total: number;
}

export interface VendaTotal {
  total: number;
  custo: number;
  lucro: number;
  margem: number;
  mediaDiaria: number;
  ticketMedio: number;
}

export interface VendaTotals extends VendaTotal {
  date: string;
}

export interface CartoesTaxasTotal {
  total: number;
}

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
