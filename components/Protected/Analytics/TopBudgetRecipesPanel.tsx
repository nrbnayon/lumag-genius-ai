import type { TopBudgetRecipe } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TopBudgetRecipesPanelProps {
  data: TopBudgetRecipe[];
}

export function TopBudgetRecipesPanel({ data }: TopBudgetRecipesPanelProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-foreground">
          Top Budget Recipes
        </h3>
        <p className="text-sm text-secondary">Based on this month</p>
      </div>
      <div className="space-y-0 divide-y divide-gray-50">
        {data.map((recipe: TopBudgetRecipe) => (
          <div
            key={recipe.id}
            className="flex items-center justify-between py-3.5 hover:bg-gray-50/60 transition-colors rounded-lg px-1"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#E6F4FF] text-[#0190FE] font-bold flex items-center justify-center shrink-0">
                {recipe.rank}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground leading-tight">
                  {recipe.name}
                </span>
                <span className="text-xs text-secondary capitalize">
                  {recipe.outlet_type}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold text-foreground">
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
