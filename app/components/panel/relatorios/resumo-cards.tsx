import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface ResumoCard {
  title: string;
  metric: string;
  projecao?: string | null;
  margem?: string | null;
  deltaType: string;
}

interface ResumoCardsProps {
  cards: ResumoCard[];
  children?: (card: ResumoCard) => React.ReactNode;
}

function getDeltaIcon(deltaType: string) {
  switch (deltaType) {
    case "moderateIncrease":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "moderateDecrease":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
}

function getDeltaColor(deltaType: string) {
  switch (deltaType) {
    case "moderateIncrease":
      return "bg-green-100 text-green-800 border-green-200";
    case "moderateDecrease":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function ResumoCards({ cards, children }: ResumoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {card.title}
            </CardTitle>
            {getDeltaIcon(card.deltaType)}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold">{card.metric}</div>

              <div className="flex flex-wrap gap-2">
                {card.margem && (
                  <Badge
                    variant="secondary"
                    className={getDeltaColor(card.deltaType)}
                  >
                    Margem: {card.margem}
                  </Badge>
                )}
                {card.projecao && (
                  <Badge variant="outline">Projeção: {card.projecao}</Badge>
                )}
              </div>

              {children && children(card)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
