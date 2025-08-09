import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface RequisitanteInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function RequisitanteInput({
  register,
  errors,
}: RequisitanteInputProps) {
  const hasError = errors.requisitante;

  return (
    <div className="space-y-2">
      <Label htmlFor="requisitante">Requisitante</Label>
      <Input
        {...register("requisitante", { required: "Campo obrigatório" })}
        placeholder="Nome do requisitante"
        className={hasError ? "border-destructive" : ""}
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
