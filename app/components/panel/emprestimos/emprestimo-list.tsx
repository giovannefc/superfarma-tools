import { EmprestimoStatus } from "@prisma/client";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { EmprestimoFormatted } from "~/models/emprestimo.server";
import type { ParceiroFromList } from "~/models/parceiro.server";
import type { action as updateAction } from "~/routes/api/emprestimos";
import { humanizeDate } from "~/utils";
import { fetcherIsDone } from "~/utils/remix-helpers";

interface EmprestimoListProps {
  emprestimos: EmprestimoFormatted[];
}

const statusBadge = {
  PENDENTE: {
    variant: "secondary" as const,
    name: "Pendente",
    icon: AlertTriangle,
    className:
      "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
  },
  PAGO: {
    variant: "default" as const,
    name: "Pago",
    icon: CheckCircle,
    className:
      "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
  },
  SEPARADO: {
    variant: "outline" as const,
    name: "Separado",
    icon: ClipboardCheck,
    className:
      "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
  },
};

export function EmprestimoList({
  emprestimos: _emprestimos,
}: EmprestimoListProps) {
  const fetcher = useFetcher<typeof updateAction>();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: [
      EmprestimoStatus.PENDENTE,
      EmprestimoStatus.SEPARADO,
    ] as EmprestimoStatus[],
    parceiro: "all" as string, // Mudança: apenas um parceiro por vez
  });

  const [emprestimos, setEmprestimos] = useState(_emprestimos);

  const handleAction = (id: string, action: string) => {
    if (action !== "DELETE") {
      fetcher.submit(
        { id, status: action },
        { method: "PATCH", action: "/api/emprestimos" },
      );
    } else {
      fetcher.submit({ id }, { method: "DELETE", action: "/api/emprestimos" });
    }
  };

  const handleBulkMarkAsPaid = () => {
    if (selectedItems.length === 0) return;

    // Marcar todos os itens selecionados como pagos
    selectedItems.forEach(id => {
      fetcher.submit(
        { id, status: EmprestimoStatus.PAGO },
        { method: "PATCH", action: "/api/emprestimos" },
      );
    });

    // Limpar seleção após a ação
    setSelectedItems([]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === emprestimos.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(emprestimos.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    setEmprestimos(
      _emprestimos.filter(emprestimo => {
        const statusMatch = filters.status.includes(emprestimo.status);
        const parceiroMatch =
          filters.parceiro === "all" ||
          filters.parceiro === emprestimo.parceiro.id;

        return statusMatch && parceiroMatch;
      }),
    );
  }, [filters, _emprestimos]);

  useEffect(() => {
    if (fetcherIsDone(fetcher)) {
      toast.success("Empréstimo atualizado com sucesso");
    }
  }, [fetcher.state]);

  // Get unique parceiros from emprestimos
  const uniqueParceiros = _emprestimos.reduce((acc, emprestimo) => {
    if (!acc.find(p => p.id === emprestimo.parceiro.id)) {
      acc.push(emprestimo.parceiro);
    }
    return acc;
  }, [] as ParceiroFromList[]);

  // Mapeamento para nomes amigáveis dos status
  const statusDisplayNames = {
    [EmprestimoStatus.PENDENTE]: "Pendente",
    [EmprestimoStatus.SEPARADO]: "Separado",
    [EmprestimoStatus.PAGO]: "Pago",
  };

  // Função para gerar PDF
  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      // Título do documento
      doc.setFontSize(18);
      doc.text("Lista de Empréstimos", 14, 22);

      // Informações do filtro
      doc.setFontSize(12);
      let yPosition = 35;

      // Status filtrados
      const statusFiltrados = filters.status
        .map(status => statusDisplayNames[status])
        .join(", ");
      doc.text(`Status: ${statusFiltrados}`, 14, yPosition);
      yPosition += 7;

      // Parceiro filtrado
      if (filters.parceiro !== "all") {
        const parceiroNome =
          uniqueParceiros.find(p => p.id === filters.parceiro)?.nome || "";
        doc.text(`Parceiro: ${parceiroNome}`, 14, yPosition);
        yPosition += 7;
      }

      doc.text(`Total de registros: ${emprestimos.length}`, 14, yPosition);
      yPosition += 10;

      // Preparar dados da tabela
      const tableData = emprestimos.map(item => [
        humanizeDate(new Date(item.data)),
        item.parceiro.nome,
        item.quantidade.toString(),
        item.produto,
        item.fabricante,
        item.requisitante,
        statusDisplayNames[item.status],
      ]);

      // Gerar tabela
      autoTable(doc, {
        head: [
          [
            "Data",
            "Parceiro",
            "Qtd",
            "Produto",
            "Fabricante",
            "Requisitante",
            "Status",
          ],
        ],
        body: tableData,
        startY: yPosition,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [71, 85, 105],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Data
          1: { cellWidth: 30 }, // Parceiro
          2: { cellWidth: 15 }, // Quantidade
          3: { cellWidth: 40 }, // Produto
          4: { cellWidth: 25 }, // Fabricante
          5: { cellWidth: 25 }, // Requisitante
          6: { cellWidth: 20 }, // Status
        },
        margin: { top: 10 },
      });

      // Salvar o PDF
      const fileName = `emprestimos_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:max-w-xs">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    {filters.status.length === 0 ? (
                      <span className="text-muted-foreground">
                        Filtrar por Status
                      </span>
                    ) : filters.status.length === 1 ? (
                      <span>{statusDisplayNames[filters.status[0]]}</span>
                    ) : (
                      <span>{filters.status.length} status selecionados</span>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="p-1">
                  {Object.entries(statusDisplayNames).map(([status, name]) => (
                    <div
                      key={status}
                      className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                      onClick={() => {
                        const newStatus = filters.status.includes(
                          status as EmprestimoStatus,
                        )
                          ? filters.status.filter(s => s !== status)
                          : [...filters.status, status as EmprestimoStatus];
                        setFilters({ ...filters, status: newStatus });
                      }}
                    >
                      <Checkbox
                        checked={filters.status.includes(
                          status as EmprestimoStatus,
                        )}
                        className="mr-2"
                      />
                      {name}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Select
            value={filters.parceiro}
            onValueChange={value => setFilters({ ...filters, parceiro: value })}
          >
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue placeholder="Filtrar por Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Parceiros</SelectItem>
              {uniqueParceiros.map(parceiro => (
                <SelectItem key={parceiro.id} value={parceiro.id}>
                  {parceiro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={generatePDF}
            className="w-full shrink-0 gap-2 sm:w-auto"
            disabled={emprestimos.length === 0}
          >
            <FileText className="h-4 w-4" />
            Gerar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                status: [EmprestimoStatus.PENDENTE, EmprestimoStatus.SEPARADO],
                parceiro: "all",
              })
            }
            className="w-full shrink-0 sm:w-auto"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-background hidden overflow-hidden rounded-lg border md:block">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-8">
                  <Checkbox
                    checked={
                      selectedItems.length === emprestimos.length &&
                      emprestimos.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Parceiro</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Requisitante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emprestimos.map(item => {
                const StatusIcon = statusBadge[item.status].icon;
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors"
                    data-state={
                      selectedItems.includes(item.id) ? "selected" : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        aria-label="Selecionar linha"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {humanizeDate(new Date(item.data))}
                    </TableCell>
                    <TableCell>{item.parceiro.nome}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.quantidade}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.produto}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.fabricante}
                    </TableCell>
                    <TableCell>{item.requisitante}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 ${statusBadge[item.status].className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge[item.status].name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-muted h-8 w-8 p-0"
                            disabled={fetcher.state !== "idle"}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(item.id, EmprestimoStatus.PAGO)
                            }
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Marcar como Pago
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(item.id, EmprestimoStatus.SEPARADO)
                            }
                            className="gap-2"
                          >
                            <ClipboardCheck className="h-4 w-4 text-blue-600" />
                            Marcar como Separado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction(item.id, EmprestimoStatus.PENDENTE)
                            }
                            className="gap-2"
                          >
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Marcar como Pendente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAction(item.id, "DELETE")}
                            className="text-destructive focus:text-destructive gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-muted/30 border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {selectedItems.length} de {emprestimos.length} item(s)
                selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkMarkAsPaid}
                  disabled={fetcher.state !== "idle"}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Pago
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Limpar seleção
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {emprestimos.map(item => {
          const StatusIcon = statusBadge[item.status].icon;
          return (
            <Card
              key={item.id}
              className={`transition-colors ${
                selectedItems.includes(item.id)
                  ? "ring-primary bg-muted/50 ring-2"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      aria-label="Selecionar item"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {humanizeDate(new Date(item.data))}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.parceiro.nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`gap-1 ${statusBadge[item.status].className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusBadge[item.status].name}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={fetcher.state !== "idle"}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(item.id, EmprestimoStatus.PAGO)
                          }
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Marcar como Pago
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(item.id, EmprestimoStatus.SEPARADO)
                          }
                          className="gap-2"
                        >
                          <ClipboardCheck className="h-4 w-4 text-blue-600" />
                          Marcar como Separado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(item.id, EmprestimoStatus.PENDENTE)
                          }
                          className="gap-2"
                        >
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Marcar como Pendente
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAction(item.id, "DELETE")}
                          className="text-destructive focus:text-destructive gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Produto:
                    </span>
                    <span className="max-w-[200px] truncate text-sm font-medium">
                      {item.produto}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Quantidade:
                    </span>
                    <span className="text-sm font-medium">
                      {item.quantidade}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Fabricante:
                    </span>
                    <span className="text-sm">{item.fabricante}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Requisitante:
                    </span>
                    <span className="text-sm">{item.requisitante}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {selectedItems.length > 0 && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {selectedItems.length} de {emprestimos.length} item(s)
                  selecionado(s)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkMarkAsPaid}
                    disabled={fetcher.state !== "idle"}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como Pago
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItems([])}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
