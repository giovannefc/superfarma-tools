import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { useFetcher } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface Produto {
  id: string;
  name: string;
  manufacturer: {
    id: string;
    name: string;
  };
  ean: string;
  price: number;
  stock: number;
}

interface ProdutoInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  onProductSelect?: (produto: Produto) => void;
  autoFocus?: boolean;
}

export function ProdutoInput({
  control,
  errors,
  onProductSelect,
  autoFocus = false,
}: ProdutoInputProps) {
  const fetcher = useFetcher<Produto[]>({ key: "searchProduct" });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isSearchingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        if (!open) return;

        timeoutId = setTimeout(() => {
          // Verificar se ainda está aberto antes de fazer a requisição
          if (open && value.trim() && value.length >= 2) {
            isSearchingRef.current = true;
            fetcher.load(
              `/api/a7/products?search=${encodeURIComponent(value.trim())}`,
            );
          } else if (value.length < 2) {
            setProdutos([]);
          }
        }, 500);
      };
    })(),
    [fetcher, open],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = setTimeout(() => {}, 0);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (open) {
      debouncedSearch(value);
    }
  };

  // Auto focus effect
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        setOpen(true);
      }, 100);
    }
  }, [autoFocus]);

  // Clear produtos when popover closes and focus input when opens
  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setProdutos([]);
    } else {
      // Foca no input quando o popover abre
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Update produtos when fetcher completes
  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      Array.isArray(fetcher.data) &&
      isSearchingRef.current && // Só atualiza se foi uma busca iniciada por este componente
      open // E se o popover ainda está aberto
    ) {
      const uniqueProdutos = fetcher.data.filter(
        (produto: Produto, index: number, self: Produto[]) =>
          index === self.findIndex((p: Produto) => p.id === produto.id),
      );
      setProdutos(uniqueProdutos);
      isSearchingRef.current = false;
    }
  }, [fetcher, open]);

  const isLoading = fetcher.state !== "idle";
  const hasError = errors.produto;

  return (
    <div className="space-y-2">
      <Label htmlFor="produto">Produto</Label>
      <Controller
        name="produto"
        control={control}
        rules={{ required: "Campo obrigatório" }}
        render={({ field: { onChange, value } }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                  hasError && "border-destructive",
                )}
              >
                {value || "Selecione um produto..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  ref={inputRef}
                  placeholder="Digite para pesquisar produtos..."
                  value={searchValue}
                  onValueChange={handleSearchChange}
                />
                <CommandList>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="text-muted-foreground ml-2 text-sm">
                        Pesquisando...
                      </span>
                    </div>
                  ) : produtos.length > 0 ? (
                    <CommandGroup>
                      {produtos.map(produto => {
                        const isSelected = value === produto.name;
                        return (
                          <CommandItem
                            key={produto.id}
                            value={`${produto.name}-${produto.id}`}
                            onSelect={() => {
                              onChange(produto.name);
                              onProductSelect?.(produto);
                              setOpen(false);
                              setSearchValue("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {produto.name}
                              </span>
                              <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs">
                                  {produto.manufacturer.name}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  EAN: {produto.ean}
                                </span>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground text-xs">
                                    R$ {produto.price.toFixed(2)}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    Estoque: {produto.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ) : searchValue.length >= 2 ? (
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                  ) : (
                    <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                      Digite pelo menos 2 caracteres para pesquisar
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
