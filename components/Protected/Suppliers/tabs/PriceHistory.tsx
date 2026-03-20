"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useGetPriceHistoryQuery,
  useGetUniqueProductsQuery 
} from "@/redux/services/suppliersApi";
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

const PALETTE = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
];

export function PriceHistory() {
  const [productName, setProductName] = useState("Tomatoes");
  const { data: productsData, isLoading: loadingProducts } = useGetUniqueProductsQuery();
  const productList = productsData?.data ?? [];

  const { data, isLoading } = useGetPriceHistoryQuery(
    { product_name: productName || undefined },
    { skip: !productName },
  );

  // Auto-select first product if default 'Tomatoes' is not available
  useEffect(() => {
    if (!loadingProducts && productList.length > 0) {
      if (!productList.includes("Tomatoes") && !productName) {
        setProductName(productList[0]);
      }
    }
  }, [productList, loadingProducts]);

  const labels = data?.labels ?? [];
  const suppliers = data?.data ?? [];

  // Build chart data: each point is { date, [supplier_name]: price }
  const chartData = labels.map((label, i) => {
    const point: Record<string, string | number> = { date: label.slice(5) }; // show MM-DD
    suppliers.forEach((s) => {
      const val = parseFloat(s.prices[i]);
      point[`${s.supplier_name} (${s.unit})`] = val > 0 ? val : 0;
    });
    return point;
  });

  const loading = isLoading || loadingProducts;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_#A9A9A940] space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h4 className="text-lg font-bold text-foreground">
          {data?.product_name || productName || "Product"} — Price Trend
        </h4>
        
        {/* Product Dropdown */}
        <div className="relative group min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            disabled={loadingProducts}
            className="relative w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-secondary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer appearance-none"
          >
            {productList.length === 0 && !loadingProducts ? (
              <option value="">No products found</option>
            ) : (
              <>
                {!productList.includes(productName) && productName && (
                  <option value={productName}>{productName}</option>
                )}
                {productList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </>
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors z-10">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 w-full bg-gray-50 rounded-xl animate-pulse" />
      ) : suppliers.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-secondary font-medium">No price history found for "{productName}"</p>
        </div>
      ) : (
        <>
          {/* Dynamic Recharts Chart */}
          <div className="h-80 w-full bg-white rounded-xl relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
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
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: number | undefined) => [
                    val !== undefined ? `$${val.toFixed(2)}` : "",
                    undefined,
                  ]}
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
                {suppliers.map((s, i) => (
                  <Line
                    key={s.supplier_id}
                    type="monotone"
                    dataKey={`${s.supplier_name} (${s.unit})`}
                    stroke={PALETTE[i % PALETTE.length]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((s, i) => {
              const color = PALETTE[i % PALETTE.length];
              const trendPositive = s.trend === "decrease";
              const trendNegative = s.trend === "increase";

              return (
                <div
                  key={s.supplier_id}
                  className="p-4 rounded-xl transition-all hover:scale-[1.02] bg-gray-50 border border-gray-100"
                  style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                >
                  <div className="text-xs font-bold mb-1" style={{ color }}>
                    {s.supplier_name}
                  </div>
                  <div className="text-xl font-bold mb-1 text-foreground">
                    ${parseFloat(s.latest_price).toFixed(2)}
                    <span className="text-xs font-normal text-secondary ml-1">/{s.unit}</span>
                  </div>
                  <div
                    className={cn(
                      "text-xs font-bold flex items-center gap-1",
                      trendPositive
                        ? "text-emerald-500"
                        : trendNegative
                        ? "text-red-500"
                        : "text-gray-400",
                    )}
                  >
                    {trendNegative && <TrendingUp className="w-3 h-3" />}
                    {trendPositive && <TrendingDown className="w-3 h-3" />}
                    {!trendNegative && !trendPositive && <Minus className="w-3 h-3" />}
                    {s.change_percentage > 0
                      ? `+${s.change_percentage.toFixed(1)}%`
                      : `${s.change_percentage.toFixed(1)}%`}{" "}
                    ({s.trend})
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
