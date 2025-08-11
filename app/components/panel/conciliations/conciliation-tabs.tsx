import { CreditCard, Monitor } from "lucide-react";

import { RedeResultTable } from "~/components/panel/conciliations/rede-result-table";
import { SistemaResultTable } from "~/components/panel/conciliations/sistema-result-table";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { orderBy } from "~/lib/utils";
import type { RedeResult, SistemaResult } from "~/models/types";

interface ConciliationTabsProps {
  redeResult: RedeResult[];
  sistemaResult: SistemaResult[];
}

export function ConciliationTabs({
  redeResult,
  sistemaResult,
}: ConciliationTabsProps) {
  return (
    <Tabs defaultValue="rede" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="rede" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Rede
        </TabsTrigger>
        <TabsTrigger value="sistema" className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          Sistema
        </TabsTrigger>
      </TabsList>

      <TabsContent value="rede" className="space-y-6">
        {/* Não encontradas */}
        <RedeResultTable
          result={orderBy(
            redeResult.filter(venda => !venda.confere),
            ["valor"],
            ["asc"],
          )}
          title="Vendas não encontradas no sistema"
          variant="error"
        />

        {/* Divergência de modalidade */}
        <RedeResultTable
          result={orderBy(
            redeResult.filter(
              venda => !venda.confereModalidade && venda.confere,
            ),
            ["valor"],
            ["asc"],
          )}
          title="Vendas com modalidade divergente"
          variant="warning"
        />

        {/* Divergência de bandeira */}
        <RedeResultTable
          result={orderBy(
            redeResult.filter(
              venda =>
                venda.confere &&
                venda.confereModalidade &&
                !venda.confereBandeira,
            ),
            ["valor"],
            ["asc"],
          )}
          title="Vendas com bandeira divergente"
          variant="warning"
        />

        <Separator />

        {/* Conferidas */}
        <RedeResultTable
          result={orderBy(
            redeResult.filter(venda => venda.confere),
            ["valor"],
            ["asc"],
          )}
          title="Vendas encontradas no sistema"
          variant="success"
        />
      </TabsContent>

      <TabsContent value="sistema" className="space-y-6">
        {/* Não encontradas na Rede */}
        <SistemaResultTable
          result={sistemaResult}
          title="Vendas não encontradas na Rede"
          showOnlyNotFound={true}
        />

        <Separator />

        {/* Todas as vendas do sistema */}
        <SistemaResultTable
          result={sistemaResult.filter(venda => venda.confere)}
          title="Vendas que bateram com a Rede"
        />
      </TabsContent>
    </Tabs>
  );
}
