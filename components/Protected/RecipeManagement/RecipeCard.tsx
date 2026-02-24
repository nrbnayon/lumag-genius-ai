"use client";

import { SquarePen, Download, Trash2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
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
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold",
            recipe.status === "Approved"
              ? "bg-[#ECFDF5] text-[#10B981]"
              : "bg-[#FEFCE8] text-[#F59E0B]",
          )}
        >
          {recipe.status}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(recipe)}
            className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExport(recipe)}
            className="p-2 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(recipe)}
            className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {recipe.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Cooking Time</span>
            <span className="text-gray-900 font-bold">
              {recipe.cookingTime}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Ingredients</span>
            <span className="text-gray-900 font-bold">
              {recipe.ingredientsCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-500 font-medium font-bold">Cost</span>
            <span className="text-gray-900 font-extrabold">{recipe.cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
