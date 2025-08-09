import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import { useActionData, useFetcher, useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { create as createParceiro } from "~/models/parceiro.server";
import { requireUser } from "~/services/auth.server";

import type { loader } from "../layout";

const parceiroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type ParceiroFormData = z.infer<typeof parceiroSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const userId = user.id;

  const formData = await request.formData();
  const nome = String(formData.get("nome"));

  if (!nome || nome.trim().length === 0) {
    return { error: "Nome é obrigatório" };
  }

  const parceiro = await createParceiro({
    userId,
    ativo: true,
    nome: nome.trim(),
  });

  return parceiro;
}

export default function Emprestimos() {
  const data = useRouteLoaderData<typeof loader>("routes/panel/layout");
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<typeof action>();

  const methods = useForm<ParceiroFormData>({
    resolver: zodResolver(parceiroSchema),
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = (data: ParceiroFormData) => {
    const formData = new FormData();
    formData.append("nome", data.nome);

    fetcher.submit(formData, {
      method: "POST",
    });
  };

  useEffect(() => {
    if (actionData && "id" in actionData) {
      toast.success("Parceiro cadastrado com sucesso.");
      reset();
    }
  }, [actionData, reset]);

  useEffect(() => {
    if (fetcher.data && "id" in fetcher.data) {
      toast.success("Parceiro cadastrado com sucesso.");
      reset();
    }
  }, [fetcher.data, reset]);

  const isLoading = isSubmitting || fetcher.state !== "idle";

  return (
    <div className="flex flex-col">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex max-w-lg space-x-2"
        >
          <div className="flex-1">
            <Input
              {...register("nome")}
              placeholder="Nome"
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-destructive mt-1 text-sm">
                {errors.nome.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </form>
      </FormProvider>

      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle>Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data &&
              data.parceiros.map(parceiro => (
                <div key={parceiro.id} className="rounded border p-2">
                  <span>{parceiro.nome}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
