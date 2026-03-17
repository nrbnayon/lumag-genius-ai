"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { useGetPriceComparisonQuery } from "@/redux/services/suppliersApi";

export function PriceComparison() {
  const [productName, setProductName] = useState("");

  const { data, isLoading, isFetching } = useGetPriceComparisonQuery(
    { product_name: productName || undefined },
    { refetchOnMountOrArgChange: true },
  );

  const products = data?.data ?? [];
  const loading = isLoading || isFetching;

  const trendIcon = (trend: string) => {
    if (trend === "increasing") return <TrendingUp className="w-3 h-3 text-red-500" />;
    if (trend === "decreasing") return <TrendingDown className="w-3 h-3 text-emerald-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Search by product */}
      <div className="max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product (e.g. Tomatoes)"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-5 w-40 bg-gray-100 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-24 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {products.map((prod, idx) => (
            <div
              key={idx}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground border-b border-gray-100 pb-2 flex items-center gap-2 flex-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {prod.product_name}
                </h4>
                <div className="ml-4 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                  Best: ${parseFloat(prod.best_price).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {prod.suppliers.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:shadow-md",
                      comp.is_best_price
                        ? "border-[#43A047] bg-[#DDF2E8] shadow-sm"
                        : "border-border bg-white",
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-secondary">
                        {comp.supplier_name}
                      </span>
                      {trendIcon(comp.trend)}
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      ${parseFloat(comp.latest_price).toFixed(2)}
                      <span className="text-xs font-normal text-secondary ml-1">/{comp.unit}</span>
                    </div>
                    {comp.previous_price && (
                      <p className="text-xs text-secondary mt-1">
                        Prev: ${parseFloat(comp.previous_price).toFixed(2)}
                      </p>
                    )}
                    {comp.is_best_price && (
                      <span className="mt-2 inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        Best Price
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-secondary font-medium">
                {productName
                  ? `No comparison data found for "${productName}".`
                  : "No comparison data available."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
