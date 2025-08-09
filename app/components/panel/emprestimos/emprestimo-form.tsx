import { zodResolver } from "@hookform/resolvers/zod";
import { EmprestimoTipo } from "@prisma/client";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";

import { useCreateEmprestimo } from "./create-emprestimo";
import { DateInput } from "./date-input";
import { ParceiroInput } from "./parceiro-input";
import { ProdutoInput } from "./produto-input";
import { QuantidadeInput } from "./quantidade-input";
import { RequisitanteInput } from "./requisitante-input";
import { StatusInput } from "./status-input";

const createEmprestimoSchema = z.object({
  data: z.date(),
  quantidade: z.number().min(1, "Campo obrigatório."),
  produto: z.string().min(1, "Campo obrigatório."),
  fabricante: z.string().min(1, "Campo obrigatório."),
  requisitante: z.string().min(1, "Campo obrigatório."),
  tipo: z.enum(EmprestimoTipo),
  parceiroId: z.string().min(1),
  status: z.string().min(1, "Campo obrigatório."),
});

type FormData = z.infer<typeof createEmprestimoSchema>;

export function EmprestimoForm() {
  const { setOpen } = useCreateEmprestimo();
  const location = useLocation();
  const fetcher = useFetcher();

  const tipo =
    location.pathname === "/panel/emprestimos/deve"
      ? EmprestimoTipo.SAIDA
      : EmprestimoTipo.ENTRADA;

  const methods = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(createEmprestimoSchema),
    defaultValues: {
      data: new Date(),
      quantidade: 1,
      tipo,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    register,
    control,
    setValue,
  } = methods;

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("data", data.data.toISOString());
    formData.append("quantidade", data.quantidade.toString());
    formData.append("produto", data.produto);
    formData.append("fabricante", data.fabricante);
    formData.append("requisitante", data.requisitante);
    formData.append("tipo", data.tipo);
    formData.append("parceiroId", data.parceiroId);
    formData.append("status", data.status);

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/emprestimos",
    });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setOpen(false);
      if ("id" in fetcher.data) {
        toast.success("Registro salvo com sucesso.");
        reset();
      }
    }
  }, [fetcher.state, fetcher.data, setOpen, reset]);

  const isLoading = isSubmitting || fetcher.state !== "idle";

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <input {...register("tipo")} defaultValue={tipo} hidden />

        <DateInput control={control} errors={errors} />
        <QuantidadeInput register={register} errors={errors} />

        <div className="col-span-2">
          <ProdutoInput
            control={control}
            errors={errors}
            onProductSelect={produto => {
              setValue("fabricante", produto.manufacturer.name);
            }}
          />
        </div>

        <input {...register("fabricante")} type="hidden" />

        <RequisitanteInput register={register} errors={errors} />
        <ParceiroInput control={control} errors={errors} />
        <StatusInput control={control} errors={errors} />

        <div className="col-span-2">
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
