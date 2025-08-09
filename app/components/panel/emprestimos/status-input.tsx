import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface StatusInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "SEPARADO", label: "Separado" },
  { value: "PAGO", label: "Pago" },
];

export function StatusInput({ control, errors }: StatusInputProps) {
  const hasError = errors.status;

  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Controller
        name="status"
        control={control}
        rules={{ required: "Campo obrigatório" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={cn(hasError && "border-destructive")}>
              <SelectValue placeholder="Selecione um status..." />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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
