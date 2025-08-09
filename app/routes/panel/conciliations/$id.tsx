import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRevalidator } from "react-router";
import { toast } from "sonner";

import { ConciliationHeader } from "~/components/panel/conciliations/conciliation-header";
import { ConciliationTabs } from "~/components/panel/conciliations/conciliation-tabs";
import { StatisticsCards } from "~/components/panel/conciliations/statistics-cards";
import { useConciliationData } from "~/hooks/use-conciliation-data";
import { findOne } from "~/models/conciliacao.server";
import { getCartoes } from "~/services/a7-api";
import { requireUser } from "~/services/auth.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const userId = user.id;

  const id = params.id;
  if (!id) {
    throw new Response("ID não fornecido", { status: 400 });
  }
  const conciliacao = await findOne(id, userId);
  if (!conciliacao) {
    throw new Response("Conciliação não encontrada", { status: 404 });
  }

  console.log(conciliacao.dataInicial, conciliacao.dataFinal);

  const vendasSistema = await getCartoes({
    from: conciliacao.dataInicial,
    to: conciliacao.dataFinal,
  });

  return { conciliacao, vendasSistema };
}

export default function ConciliationDetails() {
  const { conciliacao, vendasSistema } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  const { redeResult, sistemaResult, statistics } = useConciliationData({
    conciliacao,
    vendasSistema,
  });

  const revalidating = revalidator.state === "loading";

  const handleRefresh = () => {
    revalidator.revalidate();
    toast.success("Dados atualizados com sucesso.", {
      position: "bottom-center",
    });
  };

  return (
    <div className="space-y-6">
      <ConciliationHeader
        dataInicial={conciliacao.dataInicial}
        dataFinal={conciliacao.dataFinal}
        onRefresh={handleRefresh}
        isRefreshing={revalidating}
      />

      <StatisticsCards {...statistics} />

      <ConciliationTabs redeResult={redeResult} sistemaResult={sistemaResult} />
    </div>
  );
}
