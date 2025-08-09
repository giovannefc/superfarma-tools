import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import type { VendaRede } from "~/models/types";

export function useConciliationForm() {
  const fetcher = useFetcher();

  // Tratar resposta do fetcher
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as any;
      if (data.error) {
        toast.error(data.error + (data.details ? `: ${data.details}` : ""));
      } else if (data.success) {
        toast.success("Conciliação criada com sucesso!");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const submitConciliation = (vendas: VendaRede[]) => {
    fetcher.submit({ vendas: JSON.stringify(vendas) }, { method: "POST" });
  };

  return {
    submitConciliation,
    isLoading: fetcher.state !== "idle",
    data: fetcher.data,
  };
}
