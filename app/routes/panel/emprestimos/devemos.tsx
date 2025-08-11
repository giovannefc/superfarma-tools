import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { EmprestimoList } from "~/components/panel/emprestimos/emprestimo-list";
import { getEmprestimoTipo } from "~/lib/server";
import { findAll } from "~/models/emprestimo.server";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const userId = user.id;
  const tipo = getEmprestimoTipo(request);

  const emprestimos = await findAll(userId, tipo);

  // Converter data para string para compatibilidade com o componente
  const emprestimosFormatted = emprestimos.map(emprestimo => ({
    ...emprestimo,
    data: emprestimo.data.toISOString(),
  }));

  return emprestimosFormatted;
}

export default function Emprestimos() {
  const emprestimos = useLoaderData<typeof loader>();

  return <EmprestimoList emprestimos={emprestimos} />;
}
