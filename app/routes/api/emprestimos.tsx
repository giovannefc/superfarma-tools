import type { EmprestimoStatus } from "@prisma/client";
import type { ActionFunctionArgs } from "react-router";

import { create, exclude, update } from "~/models/emprestimo.server";
import { requireUser } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const id = formData.get("id");
  const status = formData.get("status");

  switch (request.method) {
    case "POST":
      // Para criar novo empréstimo
      const data = Object.fromEntries(formData);

      const res = await create({
        data: new Date(String(data.data)),
        quantidade: Number(data.quantidade),
        produto: String(data.produto),
        fabricante: String(data.fabricante),
        requisitante: String(data.requisitante),
        tipo: data.tipo as any,
        parceiroId: String(data.parceiroId),
        status: String(data.status) as EmprestimoStatus,
        userId: user.id,
      });

      return Response.json(res);

    case "PATCH":
      // Para atualizar status do empréstimo
      if (id && status) {
        const res = await update(String(id), {
          userId: user.id,
          status: String(status) as EmprestimoStatus,
        });

        return Response.json(res);
      }
      break;

    case "DELETE":
      // Para excluir empréstimo
      if (id) {
        const res = await exclude(String(id));
        return Response.json(res);
      }
      break;
  }

  return Response.json({ error: "Método não suportado" }, { status: 405 });
}
