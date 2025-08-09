import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { create, exclude, findAll, update } from "~/models/parceiro.server";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const parceiros = await findAll(user.id);
  return Response.json(parceiros);
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const id = formData.get("id");

  switch (request.method) {
    case "POST":
      // Para criar novo parceiro
      const data = Object.fromEntries(formData);

      const res = await create({
        userId: user.id,
        nome: String(data.nome),
        ativo: data.ativo === "true",
      });

      return Response.json(res);

    case "PATCH":
      // Para atualizar parceiro
      if (id) {
        const updateData = Object.fromEntries(formData);
        const res = await update(String(id), {
          nome: updateData.nome ? String(updateData.nome) : undefined,
          ativo: updateData.ativo ? updateData.ativo === "true" : undefined,
        });

        return Response.json(res);
      }
      break;

    case "DELETE":
      // Para excluir parceiro
      if (id) {
        const res = await exclude(String(id));
        return Response.json(res);
      }
      break;
  }

  return Response.json({ error: "Método não suportado" }, { status: 405 });
}
