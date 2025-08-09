import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

import { DatePicker } from "~/components/ui/date-picker";
import { Label } from "~/components/ui/label";

interface DateInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function DateInput({ control, errors }: DateInputProps) {
  const hasError = errors.data;

  return (
    <div className="space-y-2">
      <Label htmlFor="data">Data</Label>
      <Controller
        name="data"
        control={control}
        rules={{ required: "Campo obrigatório" }}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            value={value}
            onChange={onChange}
            placeholder="Selecione a data..."
          />
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
