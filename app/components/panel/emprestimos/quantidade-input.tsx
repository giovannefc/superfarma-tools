import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface QuantidadeInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function QuantidadeInput({ register, errors }: QuantidadeInputProps) {
  const hasError = errors.quantidade;

  return (
    <div className="space-y-2">
      <Label htmlFor="quantidade">Quantidade</Label>
      <Input
        {...register("quantidade", {
          valueAsNumber: true,
          required: "Campo obrigatório",
          min: { value: 1, message: "Quantidade deve ser maior que 0" },
        })}
        type="number"
        min="1"
        placeholder="1"
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
