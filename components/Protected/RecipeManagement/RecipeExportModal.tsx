"use client";

import { X, Download } from "lucide-react";
import { Recipe } from "@/types/recipe";
import * as XLSX from "xlsx";

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

  const handleExport = () => {
    const exportData = Array.isArray(data) ? data : [data];

    // Transform data for Excel - expanding ingredients into rows
    const worksheetData: any[] = [];
    exportData.forEach((recipe) => {
      recipe.ingredients.forEach((ing, idx) => {
        worksheetData.push({
          "Recipe Name": idx === 0 ? recipe.name : "",
          "Avg. Time": idx === 0 ? recipe.cookingTime : "",
          "Selling Price": idx === 0 ? recipe.sellingPrice : "",
          Instruction: idx === 0 ? recipe.instruction : "",
          "Ingredient Name": ing.name,
          Quantity: ing.quantity,
          Unit: ing.unit,
          Cost: ing.cost,
          "Total Cost": idx === 0 ? recipe.cost : "",
        });
      });
      // Add an empty row between recipes if multiple
      if (Array.isArray(data) && data.length > 1) {
        worksheetData.push({});
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recipes");

    const fileName = Array.isArray(data)
      ? "all_recipes_technical_sheets.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_technical_sheet.xlsx`;

    XLSX.writeFile(workbook, fileName);
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
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Expert Preview</h2>

          <div className="border border-gray-200 rounded-xl overflow-x-auto mb-8">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4 min-w-[150px]">Recipe name</th>
                  <th className="p-4 min-w-[100px]">Avg. Time</th>
                  <th className="p-4 min-w-[120px]">Selling Price</th>
                  <th className="p-4 min-w-[150px]">Instruction</th>
                  <th className="p-4" colSpan={4}>
                    Ingredients
                  </th>
                </tr>
                <tr className="border-t border-gray-100 text-[10px] text-gray-400">
                  <th colSpan={4}></th>
                  <th className="p-2 border-r border-gray-50">Name</th>
                  <th className="p-2 border-r border-gray-50">Quantity</th>
                  <th className="p-2 border-r border-gray-50">Unit</th>
                  <th className="p-2">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 font-medium text-gray-900 border-r border-gray-50">
                    {sample.name}
                  </td>
                  <td className="p-4 text-gray-900 border-r border-gray-50">
                    {sample.cookingTime}
                  </td>
                  <td className="p-4 text-gray-900 border-r border-gray-50">
                    {sample.sellingPrice}
                  </td>
                  <td className="p-4 text-gray-500 text-xs text-left max-w-[200px] truncate border-r border-gray-50">
                    {sample.instruction}
                  </td>
                  <td colSpan={4} className="p-0">
                    <table className="w-full h-full text-[11px] divide-y divide-gray-50">
                      <tbody>
                        {sample.ingredients.map((ing, i) => (
                          <tr key={i}>
                            <td className="p-2 w-1/4 border-r border-gray-50">
                              {ing.name}
                            </td>
                            <td className="p-2 w-1/4 border-r border-gray-50">
                              {ing.quantity}
                            </td>
                            <td className="p-2 w-1/4 border-r border-gray-50">
                              {ing.unit}
                            </td>
                            <td className="p-2 w-1/4">{ing.cost}</td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-50/30">
                          <td colSpan={3} className="p-2 text-right">
                            Total Cost
                          </td>
                          <td className="p-2 text-gray-900">{sample.cost}</td>
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
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-[#0EA5E9] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
