import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AdaptedVendasTotals } from "~/lib/adapters/reports-sales.adapter";
import { humanizeAmount } from "~/lib/utils";

interface VendasChartProps {
  vendasTotals: AdaptedVendasTotals;
  title: string;
}

export function VendasChart({ vendasTotals, title }: VendasChartProps) {
  const data = vendasTotals.map(item => ({
    ...item,
    [title]: item[title as keyof typeof item],
  }));

  return (
    <div className="mt-6 h-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="Data"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number) => [humanizeAmount(value), title]}
            labelStyle={{ color: "#374151" }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Area
            type="monotone"
            dataKey={title}
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
