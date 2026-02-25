"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ProductPriceComparison } from "@/types/supplier";

interface PriceComparisonProps {
  data: ProductPriceComparison[];
}

export function PriceComparison({ data }: PriceComparisonProps) {
  const [selectedProductName, setSelectedProductName] = useState<string>("All");

  const filteredData =
    selectedProductName === "All"
      ? data
      : data.filter((item) => item.productName === selectedProductName);

  return (
    <div className="space-y-8">
      <div className="max-w-xs">
        <select
          value={selectedProductName}
          onChange={(e) => setSelectedProductName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-100 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="All">All Products</option>
          {data.map((item) => (
            <option key={item.productName} value={item.productName}>
              {item.productName} ({item.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8">
        {filteredData.map((prod, idx) => (
          <div
            key={idx}
            className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <h4 className="text-sm font-bold text-foreground border-b border-gray-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {prod.productName} ({prod.unit})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {prod.comparisons.map((comp, cIdx) => (
                <div
                  key={cIdx}
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-md",
                    comp.isBestPrice
                      ? "border-[#43A047] bg-[#DDF2E8] shadow-sm"
                      : "border-border bg-white",
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-secondary">
                      {comp.supplierName}
                    </span>
                    {comp.trend === "up" && (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    )}
                    {comp.trend === "down" && (
                      <TrendingDown className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${comp.price.toFixed(2)}
                  </div>
                  {comp.isBestPrice && (
                    <span className="mt-2 inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Best Price
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-secondary font-medium">
              No comparison data available for this selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
