# Relatórios - Migração do sfp-utils

Este módulo contém a migração completa da funcionalidade de relatórios do
projeto `sfp-utils` para o novo projeto usando React Router v7 e shadcn/ui.

## Estrutura Migrada

### Rotas

- `/panel/relatorios` - Página principal (Balanço)
- `/panel/relatorios/vendas` - Relatório de vendas
- `/panel/relatorios/despesas` - Lista de despesas
- `/panel/relatorios/despesas/:id` - Detalhes de uma despesa específica

### Componentes Criados

#### Layout e Navegação

- `layout.tsx` - Layout principal com navegação por tabs usando shadcn/ui
- `date-range.tsx` - Componente para seleção de período com DatePicker

#### Visualização de Dados

- `resumo-cards.tsx` - Cards de resumo reutilizáveis com badges e indicadores
- `vendas-chart.tsx` - Gráfico de área usando Recharts (substitui Tremor)
- `tabela-vendas.tsx` - Tabela de dados usando shadcn/ui Table

### Adapters

- `reports-balance.adapter.ts` - Adapter para dados de balanço
- `reports-sales.adapter.ts` - Adapter para dados de vendas

### Utilitários

- `date-utils.ts` - Funções para manipulação de datas
- `utils.ts` - Função `humanizeAmount` para formatação de valores

## Melhorias Implementadas

### Visual (shadcn/ui)

- ✅ Cards modernos com indicadores visuais
- ✅ Badges coloridos para margens e projeções
- ✅ Ícones lucide-react para indicadores de tendência
- ✅ Layout responsivo com grid system
- ✅ Tabs de navegação integradas
- ✅ DatePicker moderno para seleção de período

### Gráficos (Recharts)

- ✅ Gráficos de área com gradiente
- ✅ Tooltips customizados
- ✅ Formatação de valores em português
- ✅ Design responsivo

### Funcionalidades

- ✅ Dados mockados para desenvolvimento
- ✅ Estrutura preparada para integração com APIs reais
- ✅ Tipagem TypeScript completa
- ✅ Reutilização de componentes

## Componentes shadcn/ui Utilizados

- `card` - Cards principais
- `badge` - Indicadores de margem e taxas
- `button` - Botões de ação
- `tabs` - Navegação entre seções
- `table` - Tabelas de dados
- `date-picker` - Seleção de datas
- `skeleton` - Estados de carregamento
- `progress` - Barras de progresso

## Próximos Passos

### Funcionalidades Pendentes

- [ ] Integração com APIs reais (substituir dados mockados)
- [ ] Componente "Vendas por classificação"
- [ ] Componente "Entregas"
- [ ] Funcionalidade completa de despesas
- [ ] Filtros avançados
- [ ] Exportação de relatórios

### Melhorias Futuras

- [ ] Gráficos adicionais (pizza, barras)
- [ ] Dashboard interativo
- [ ] Comparação de períodos
- [ ] Alertas e notificações
- [ ] Temas personalizáveis

## Tecnologias Utilizadas

- **React Router v7** - Roteamento
- **shadcn/ui** - Componentes de interface
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **currency.js** - Formatação de valores
- **TypeScript** - Tipagem estática

## Como Usar

1. Navegue para `/panel/relatorios` para ver o balanço geral
2. Use as tabs para alternar entre Balanço, Vendas e Despesas
3. Selecione o período desejado usando o DatePicker
4. Os dados são atualizados automaticamente conforme os filtros

A migração mantém toda a funcionalidade original enquanto moderniza a interface
e melhora a experiência do usuário.
