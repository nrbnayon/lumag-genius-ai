"use client";

import { X, Download } from "lucide-react";
import { Ingredient } from "@/types/ingredient";
import { exportToExcel } from "@/lib/excel";

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

  const handleExport = async () => {
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

    // Generate file name
    const fileName = Array.isArray(data)
      ? "all_ingredients.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_details.xlsx`;

    await exportToExcel(worksheetData, fileName, "Ingredients");
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
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10">
          <div className="grid grid-cols-6 gap-0 border border-gray-100 rounded-lg overflow-hidden text-center text-sm font-medium mb-8">
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Ingredient name</p>

              <p className="text-foreground">{sample?.name || "Chicken"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Unit</p>
              <p className="text-foreground">{sample?.unit || "Kg"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Price</p>
              <p className="text-foreground">${sample?.price || "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Current Stock</p>
              <p className="text-foreground">{sample?.currentStock || "20"}</p>
            </div>
            <div className="bg-gray-50/50 p-2 border-r border-gray-100">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Minimum Stock</p>
              <p className="text-foreground">{sample?.minimumStock || "12"}</p>
            </div>
            <div className="bg-gray-50/50 p-2">
              <p className="text-primary mb-2 font-semibold p-2 border-b border-gray-100">Category</p>
              <p className="text-foreground">{sample?.category || "Others"}</p>
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
