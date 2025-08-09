import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

import { Badge } from "./badge";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface MultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function MultiSelect({
  value,
  onValueChange,
  placeholder = "Selecione...",
  children,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onValueChange(value.filter(i => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map(item => (
                <Badge
                  variant="secondary"
                  key={item}
                  className="mr-1 mb-1"
                  onClick={e => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  {item}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto p-1">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectItemProps {
  value: string;
  onSelect?: (value: string) => void;
  children: React.ReactNode;
  selected?: boolean;
}

export function MultiSelectItem({
  value,
  onSelect,
  children,
  selected,
}: MultiSelectItemProps) {
  return (
    <div
      className={cn(
        "hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        selected && "bg-accent text-accent-foreground",
      )}
      onClick={() => onSelect?.(value)}
    >
      <Check
        className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")}
      />
      {children}
    </div>
  );
}
