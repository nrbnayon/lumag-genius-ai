"use client";

import type { TopBudgetRecipe } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TopBudgetRecipesProps {
  data: TopBudgetRecipe[];
}

export function TopBudgetRecipes({ data }: TopBudgetRecipesProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Top Budget Recipes</h3>
        <p className="text-sm text-secondary">Based on this month</p>
      </div>
      <div className="space-y-4">
        {data.map((recipe) => (
          <div key={recipe.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0EA5E9] flex items-center justify-center font-bold text-sm flex-shrink-0">
                {recipe.rank}
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-medium text-sm leading-tight">
                  {recipe.name}
                </span>
                <span className="text-xs text-secondary capitalize">{recipe.outlet_type}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-foreground font-bold text-sm">
                ${recipe.total_cost.toLocaleString()}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  recipe.profit >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {recipe.profit >= 0 ? "+" : ""}${recipe.profit.toLocaleString()} profit
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
