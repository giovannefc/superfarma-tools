import type { LoaderFunctionArgs } from "react-router";

import { getCartoes } from "~/services/a7-api";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  if (!dateFrom || !dateTo) {
    return Response.json(
      {
        error: "Parâmetros obrigatórios",
        message: "dateFrom e dateTo são obrigatórios",
      },
      { status: 400 },
    );
  }

  try {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    const cartoes = await getCartoes({ from, to });

    return Response.json(cartoes, {
      headers: {
        "Cache-Control": "public, max-age=300", // Cache por 5 minutos
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cartões:", error);

    return Response.json(
      {
        error: "Erro interno",
        message: "Erro ao conectar com o sistema de cartões",
        cartoes: [],
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );
  }
}
