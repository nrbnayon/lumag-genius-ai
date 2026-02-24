"use client";

import { topRecipes } from "@/data/dashboardData";

export function TopBudgetRecipes() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] border-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Top Budget Recipes</h3>
        <p className="text-sm text-secondary">Based on this month</p>
      </div>
      <div className="space-y-4">
        {topRecipes.map((recipe, index) => (
          <div key={recipe.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0EA5E9] flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <span className="text-foreground font-medium">{recipe.name}</span>
            </div>
            <span className="text-foreground font-bold">{recipe.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
