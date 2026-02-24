"use client";

import { X, Download } from "lucide-react";
import { Ingredient } from "@/types/ingredient";
import * as XLSX from "xlsx";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: Ingredient | Ingredient[]) => void;
  data: Ingredient | Ingredient[];
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  data,
}: ExportModalProps) {
  if (!isOpen) return null;

  const handleExport = () => {
    const exportData = Array.isArray(data) ? data : [data];

    // Transform data for Excel
    const worksheetData = exportData.map((item) => ({
      "Ingredient Name": item.name,
      Price: item.price,
      Unit: item.unit,
      Category: item.category,
      "Current Stock": item.currentStock,
      "Minimum Stock": item.minimumStock,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ingredients");

    // Generate file name
    const fileName = Array.isArray(data)
      ? "all_ingredients.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_details.xlsx`;

    XLSX.writeFile(workbook, fileName);
    onExport(data);
  };

  const sample = Array.isArray(data) ? data[0] : data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10">
          <div className="grid grid-cols-6 gap-0 border border-gray-100 rounded-lg overflow-hidden text-center text-sm font-medium mb-8">
            <div className="bg-gray-50/50 p-4 border-r border-gray-100">
              <p className="text-gray-500 mb-2">Ingredient name</p>
              <p className="text-gray-900">{sample?.name || "Chicken"}</p>
            </div>
            <div className="bg-gray-50/50 p-4 border-r border-gray-100">
              <p className="text-gray-500 mb-2">Unit</p>
              <p className="text-gray-900">{sample?.unit || "Kg"}</p>
            </div>
            <div className="bg-gray-50/50 p-4 border-r border-gray-100">
              <p className="text-gray-500 mb-2">Price</p>
              <p className="text-gray-900">${sample?.price || "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-4 border-r border-gray-100">
              <p className="text-gray-500 mb-2">Current Stock</p>
              <p className="text-gray-900">{sample?.currentStock || "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-4 border-r border-gray-100">
              <p className="text-gray-500 mb-2">Minimum Stock</p>
              <p className="text-gray-900">{sample?.minimumStock || "12"}</p>
            </div>
            <div className="bg-gray-50/50 p-4">
              <p className="text-gray-500 mb-2">Category</p>
              <p className="text-gray-900">{sample?.category || "Others"}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-foreground font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-[#0EA5E9] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
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
