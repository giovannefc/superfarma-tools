import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { useRouteLoaderData } from "react-router";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type { loader } from "~/routes/panel/layout";

interface ParceiroInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function ParceiroInput({ control, errors }: ParceiroInputProps) {
  const data = useRouteLoaderData<typeof loader>("routes/panel/layout");
  const hasError = errors.parceiroId;

  return (
    <div className="space-y-2">
      <Label htmlFor="parceiroId">Parceiro</Label>
      <Controller
        name="parceiroId"
        control={control}
        rules={{ required: "Campo obrigatório" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={cn(hasError && "border-destructive")}>
              <SelectValue placeholder="Selecione um parceiro..." />
            </SelectTrigger>
            <SelectContent>
              {data &&
                data.parceiros.map(parceiro => (
                  <SelectItem key={parceiro.id} value={parceiro.id}>
                    {parceiro.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
      {hasError && (
        <p className="text-destructive text-sm">
          {typeof hasError === "object" &&
          "message" in hasError &&
          hasError.message
            ? String(hasError.message)
            : "Campo obrigatório"}
        </p>
      )}
    </div>
  );
}
