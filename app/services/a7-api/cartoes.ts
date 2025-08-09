import type { VendaSistema } from "~/models/types";
import { formatDateOnly } from "~/utils";

import { fetchA7API } from "./client";

interface GetCartoesParams {
  from: Date;
  to: Date;
}

export async function getCartoes({
  from,
  to,
}: GetCartoesParams): Promise<VendaSistema[]> {
  const dateFrom = formatDateOnly(from);
  const dateTo = formatDateOnly(to);

  return fetchA7API(`/cartoes?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}
