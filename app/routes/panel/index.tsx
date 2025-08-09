import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { EmprestimosRecentes } from "~/components/panel/dashboard/emprestimos-recentes";
import { EmprestimosStatsCards } from "~/components/panel/dashboard/emprestimos-stats-cards";
import { ParceirosAtivos } from "~/components/panel/dashboard/parceiros-ativos";
import { getDashboardStats } from "~/models/emprestimo.server";
import { findAll as findAllParceiros } from "~/models/parceiro.server";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const [dashboardStats, parceiros] = await Promise.all([
    getDashboardStats(user.id),
    findAllParceiros(user.id),
  ]);

  // Enriquecer dados dos parceiros mais ativos com nomes
  const parceirosMaisAtivosComNomes = dashboardStats.parceirosMaisAtivos.map(
    item => ({
      ...item,
      parceiro: parceiros.find(p => p.id === item.parceiroId),
    }),
  );

  return {
    user,
    stats: {
      ...dashboardStats,
      parceirosMaisAtivos: parceirosMaisAtivosComNomes,
    },
  };
}

export default function PanelIndex() {
  const { user, stats } = useLoaderData<typeof loader>();

  return (
    <div className="@container/main flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header */}
        <header className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle, {user.email}
          </p>
        </header>

        {/* Stats Cards */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Estatísticas de Empréstimos
          </h2>
          <EmprestimosStatsCards stats={stats} />
        </section>

        {/* Content Grid */}
        <section className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
          <EmprestimosRecentes emprestimos={stats.emprestimosRecentes} />
          <ParceirosAtivos
            parceiros={stats.parceirosMaisAtivos}
            totalEmprestimos={stats.totalEmprestimos}
          />
        </section>
      </div>
    </div>
  );
}
