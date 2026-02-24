"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductHistory } from "@/types/supplier";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PriceHistoryProps {
  data: ProductHistory[];
}

export function PriceHistory({ data }: PriceHistoryProps) {
  const [selectedProduct, setSelectedProduct] = useState(data[0]);

  // Colors mapping synchronized with design image
  const COLORS: Record<string, string> = {
    "Ocean Fresh Ltd.": "#10B981", // Green
    "Coastal Seafood": "#3B82F6", // Blue
    "Marine Supply Co.": "#8B5CF6", // Purple
    "Green Valley Farm": "#F59E0B", // Amber
    "Prime Meats": "#EF4444", // Red
  };

  const THEMES: Record<string, { bg: string; title: string }> = {
    "Ocean Fresh Ltd.": { bg: "bg-[#DDF2E8]", title: "text-[#10B981]" },
    "Coastal Seafood": { bg: "bg-[#EBF5FF]", title: "text-[#3B82F6]" },
    "Marine Supply Co.": { bg: "bg-[#F5F3FF]", title: "text-[#8B5CF6]" },
    "Green Valley Farm": { bg: "bg-[#FFFBEB]", title: "text-[#F59E0B]" },
    "Prime Meats": { bg: "bg-[#FEF2F2]", title: "text-[#EF4444]" },
  };

  // Dynamically calculate summary from latest data
  const latestData =
    selectedProduct.historyData[selectedProduct.historyData.length - 1];
  const previousData =
    selectedProduct.historyData[selectedProduct.historyData.length - 2];

  const currentSummary = selectedProduct.suppliers.map((supplier) => {
    const currentPrice = latestData[supplier] as number;
    const prevPrice = previousData[supplier] as number;
    const diff = currentPrice - prevPrice;
    const percentChange = ((Math.abs(diff) / prevPrice) * 100).toFixed(1);

    let status = "Stable (0%)";
    let statusColor = "text-emerald-500";

    if (diff > 0) {
      status = `+${percentChange}% increase`;
      statusColor = "text-red-500";
    } else if (diff < 0) {
      status = `-${percentChange}% decrease`;
      statusColor = "text-emerald-500";
    }

    const theme = THEMES[supplier] || {
      bg: "bg-gray-50",
      title: "text-gray-500",
    };

    return {
      name: supplier,
      price: `$${currentPrice.toFixed(2)}`,
      status,
      statusColor,
      bg: theme.bg,
      nameColor: theme.title,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_#A9A9A940] space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h4 className="text-lg font-bold text-foreground">
          {selectedProduct.productName}({selectedProduct.unit}) - Price Trend
          (Last 30 Days)
        </h4>
        <select
          className="px-4 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20"
          value={selectedProduct.productName}
          onChange={(e) => {
            const prod = data.find((p) => p.productName === e.target.value);
            if (prod) setSelectedProduct(prod);
          }}
        >
          {data.map((p) => (
            <option key={p.productName} value={p.productName}>
              {p.productName}({p.unit})
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Recharts Chart */}
      <div className="h-80 w-full bg-white rounded-xl relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedProduct.historyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
              domain={[0, 50]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-[11px] font-bold text-secondary">
                  {value}
                </span>
              )}
            />
            {selectedProduct.suppliers.map((supplier) => (
              <Line
                key={supplier}
                type="monotone"
                dataKey={supplier}
                stroke={COLORS[supplier as keyof typeof COLORS] || "#CBD5E1"}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentSummary.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "p-4 rounded-xl transition-all hover:scale-[1.02]",
              item.bg,
            )}
          >
            <div className={cn("text-xs font-bold mb-1", item.nameColor)}>
              {item.name}
            </div>
            <div className="text-xl font-bold mb-1 text-foreground">
              {item.price}
            </div>
            <div
              className={cn(
                "text-xs font-bold flex items-center gap-1",
                item.statusColor,
              )}
            >
              <TrendingUp className="w-3 h-3" />
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
