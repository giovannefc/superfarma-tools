import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/panel", "routes/panel/layout.tsx", [
    index("routes/panel/index.tsx"),
    route("emprestimos", "routes/panel/emprestimos/layout.tsx", [
      route("deve", "routes/panel/emprestimos/deve.tsx"),
      route("devemos", "routes/panel/emprestimos/devemos.tsx"),
      route("parceiros", "routes/panel/emprestimos/parceiros.tsx"),
    ]),
    route("conciliations", "routes/panel/conciliations/layout.tsx", [
      index("routes/panel/conciliations/index.tsx"),
      route(":id", "routes/panel/conciliations/$id.tsx"),
    ]),
    route("orcamentos", "routes/panel/orcamentos/layout.tsx", [
      index("routes/panel/orcamentos/index.tsx"),
    ]),
    route("relatorios", "routes/panel/relatorios/layout.tsx", [
      index("routes/panel/relatorios/index.tsx"),
      route("vendas", "routes/panel/relatorios/vendas.tsx"),
      route("despesas", "routes/panel/relatorios/despesas/layout.tsx", [
        index("routes/panel/relatorios/despesas/index.tsx"),
        route(":id", "routes/panel/relatorios/despesas/$id.tsx"),
      ]),
    ]),
  ]),
  // API Routes
  route("/api/a7/products", "routes/api/a7/products.tsx"),
  route("/api/a7/cartoes", "routes/api/a7/cartoes.tsx"),
  route("/api/emprestimos", "routes/api/emprestimos.tsx"),
  route("/api/parceiros", "routes/api/parceiros.tsx"),
] satisfies RouteConfig;
