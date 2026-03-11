"use client";

import { X, Download } from "lucide-react";
import { Recipe } from "@/types/recipes.types";
import { exportToExcel } from "@/lib/excel";

interface RecipeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: Recipe | Recipe[]) => void;
  data: Recipe | Recipe[];
}

export function RecipeExportModal({
  isOpen,
  onClose,
  onExport,
  data,
}: RecipeExportModalProps) {
  if (!isOpen) return null;

  const handleExport = async () => {
    const exportData = Array.isArray(data) ? data : [data];

    const worksheetData: any[] = [];
    exportData.forEach((recipe) => {
      recipe.ingredients.forEach((ing, idx) => {
        worksheetData.push({
          "ID": idx === 0 ? recipe.id : "",
          "Recipe Name": idx === 0 ? recipe.name : "",
          "Avg. Time": idx === 0 ? recipe.avg_time : "",
          "Selling Price": idx === 0 ? recipe.selling_cost : "",
          "Instruction": idx === 0 ? recipe.instruction : "",
          "Outlet Type": idx === 0 ? recipe.outlet_type : "",
          "Ingredient Name": ing.ingredient,
          "Quantity": ing.quantity,
          "Unit": ing.unit,
          "Cost": ing.cost,
          "Total Cost": idx === 0 ? recipe.total_cost : "",
        });
      });
      if (Array.isArray(data) && data.length > 1) {
        worksheetData.push({});
      }
    });

    const fileName = Array.isArray(data)
      ? "all_recipes_technical_sheets.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_technical_sheet.xlsx`;

    await exportToExcel(worksheetData, fileName, "Recipes");
    onExport(data);
  };

  const sample = Array.isArray(data) ? data[0] : data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-secondary cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Export Preview ({Array.isArray(data) ? data.length : 1} recipes)</h2>

          <div className="border border-gray-200 rounded-xl overflow-x-auto mb-8">
            <table className="w-full text-sm text-center">
              <thead className="bg-[#E6F4FF] text-[#505050] font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4 min-w-[150px]">Recipe name</th>
                  <th className="p-4 min-w-[100px]">Avg. Time</th>
                  <th className="p-4 min-w-[120px]">Selling Cost</th>
                  <th className="p-4 min-w-[150px]">Instruction</th>
                  <th className="p-4" colSpan={4}>
                    Ingredients
                  </th>
                </tr>
                <tr className="border-t border-gray-100 text-[10px] uppercase tracking-widest text-[#505050]">
                  <th colSpan={4}></th>
                  <th className="p-2 border-r border-gray-50">Name</th>
                  <th className="p-2 border-r border-gray-50">Qty</th>
                  <th className="p-2 border-r border-gray-50">Unit</th>
                  <th className="p-2">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 font-bold text-foreground border-r border-gray-50">
                    {sample?.name}
                  </td>
                  <td className="p-4 text-foreground border-r border-gray-50">
                    {sample?.avg_time} min
                  </td>
                  <td className="p-4 text-foreground border-r border-gray-50">
                    ${sample?.selling_cost}
                  </td>
                  <td className="p-4 text-secondary text-xs text-left max-w-[200px] truncate border-r border-gray-50">
                    {sample?.instruction}
                  </td>
                  <td colSpan={4} className="p-0">
                    <table className="w-full h-full text-[11px] divide-y divide-gray-50">
                      <tbody>
                        {sample?.ingredients?.map((ing, i) => (
                          <tr key={i}>
                            <td className="p-2 w-1/4 border-r border-gray-50 font-medium">
                              {ing?.ingredient}
                            </td>
                            <td className="p-2 w-1/4 border-r border-gray-50">
                              {ing?.quantity}
                            </td>
                            <td className="p-2 w-1/4 border-r border-gray-50">
                              {ing?.unit}
                            </td>
                            <td className="p-2 w-1/4">${ing?.cost}</td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-50/30">
                          <td colSpan={3} className="p-2 text-right uppercase tracking-widest text-[10px]">
                            Total Estimated Cost
                          </td>
                          <td className="p-2 text-primary font-extrabold text-[#0EA5E9]">${sample?.total_cost}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-full text-foreground font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Download className="w-5 h-5" />
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
