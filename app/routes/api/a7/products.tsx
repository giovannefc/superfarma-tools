import type { LoaderFunctionArgs } from "react-router";

import { getProdutos } from "~/services/a7-api";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search || search.length < 2) {
    return Response.json([]);
  }

  try {
    const produtos = await getProdutos(search);
    return Response.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    return Response.json(
      {
        error: "Erro interno do servidor",
        message: "Não foi possível buscar os produtos",
      },
      { status: 500 },
    );
  }
}

export const shouldRevalidate = () => false;
