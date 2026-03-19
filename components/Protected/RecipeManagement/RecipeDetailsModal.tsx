"use client";

import { X, Edit, Trash2, Clock, ListChecks, DollarSign } from "lucide-react";
import { Recipe } from "@/types/recipes.types";

interface RecipeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeDetailsModal({ isOpen, onClose, recipe, onEdit, onDelete }: RecipeDetailsModalProps) {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{recipe.name}</h2>
              <p className="text-sm font-bold text-secondary uppercase mt-1">{recipe.outlet_type || "General"}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><Clock className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Avg. Time</p>
                <p className="font-bold">{recipe.avg_time} min</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Selling Cost</p>
                <p className="font-bold">${recipe.selling_cost}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 col-span-2 border border-gray-100">
              <div className="p-2 bg-white rounded-xl shadow-sm"><ListChecks className="w-5 h-5 text-amber-500" /></div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase">Ingredients Count</p>
                <p className="font-bold text-[#0EA5E9]">{recipe.ingredients?.length || 0} items</p>
              </div>
            </div>
          </div>

          {recipe.instruction && (
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Instructions</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{recipe.instruction}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                onClose();
                onDelete(recipe);
              }}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(recipe);
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
