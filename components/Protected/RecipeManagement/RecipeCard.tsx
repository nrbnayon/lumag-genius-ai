"use client";

import { SquarePen, Download, Trash2, Clock, ListChecks, DollarSign } from "lucide-react";
import { Recipe } from "@/types/recipes.types";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onExport: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onExport,
}: RecipeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-[#ECFDF5] text-[#10B981]";
      case "rejected":
        return "bg-[#FEF2F2] text-[#EF4444]";
      default:
        return "bg-[#FEFCE8] text-[#F59E0B]";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_24px_rgba(149,157,165,0.1)] border border-gray-100 flex flex-col gap-3 relative group hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider",
            getStatusColor(recipe?.approval_status),
          )}
        >
          {recipe?.approval_status || "Pending"}
        </span>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(recipe)}
            className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
            title="Edit Recipe"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExport(recipe)}
            className="p-2 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            title="Export Recipe"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(recipe)}
            className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
            title="Delete Recipe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {recipe?.name}
          </h3>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-3">
            {recipe.outlet_type || "General"}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-secondary font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg. Time</span>
            </div>
            <span className="text-foreground font-extrabold">
              {recipe.avg_time} min
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-secondary font-bold">
              <ListChecks className="w-3.5 h-3.5" />
              <span>Ingredients</span>
            </div>
            <span className="text-foreground font-extrabold text-[#0EA5E9]">
              {recipe.ingredients?.length || 0} items
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2 text-secondary font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Selling Cost</span>
            </div>
            <span className="text-lg font-extrabold text-foreground">
              ${recipe?.selling_cost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
