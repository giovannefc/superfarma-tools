import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { DateRange as DateRangeType } from "react-day-picker";
import { useNavigate, useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import { formatDateOnly } from "~/utils";

interface DateRangeProps {
  from: Date;
  to: Date;
}

export function DateRange({ from, to }: DateRangeProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: from,
    to: to,
  });

  const handleDateRangeChange = (range: DateRangeType | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const handleApplyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("from", formatDateOnly(dateRange.from));
      newSearchParams.set("to", formatDateOnly(dateRange.to));
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const isDateRangeChanged =
    dateRange?.from?.getTime() !== from.getTime() ||
    dateRange?.to?.getTime() !== to.getTime();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center space-x-2">
              <CalendarDays className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Período:</span>
            </div>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Selecione o período"
              className="w-full sm:w-auto"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="text-muted-foreground text-sm">
              <span className="font-medium">Atual:</span>{" "}
              <span className="hidden sm:inline">
                {format(from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(to, "dd/MM/yyyy", { locale: ptBR })}
              </span>
              <span className="sm:hidden">
                {format(from, "dd/MM", { locale: ptBR })} -{" "}
                {format(to, "dd/MM", { locale: ptBR })}
              </span>
            </div>
            <Button
              onClick={handleApplyFilter}
              size="sm"
              disabled={
                !isDateRangeChanged || !dateRange?.from || !dateRange?.to
              }
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Aplicar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
