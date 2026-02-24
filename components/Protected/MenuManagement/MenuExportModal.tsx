"use client";

import { X, Download } from "lucide-react";
import { Menu } from "@/types/menu";
import * as XLSX from "xlsx";

interface MenuExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: Menu | Menu[]) => void;
  data: Menu | Menu[];
}

export function MenuExportModal({
  isOpen,
  onClose,
  onExport,
  data,
}: MenuExportModalProps) {
  if (!isOpen) return null;

  const handleExport = () => {
    const exportData = Array.isArray(data) ? data : [data];

    // Transform data for Excel
    const worksheetData = exportData.map((menu) => ({
      "Menu Name": menu.name,
      Type: menu.type,
      "Select Dishes": menu.dishes.join(", "),
      "Total Cost": menu.cost,
      Status: menu.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Menus");

    const fileName = Array.isArray(data)
      ? "all_menus.xlsx"
      : `${data.name.toLowerCase().replace(/\s+/g, "_")}_details.xlsx`;

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

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Expert Preview</h2>

          <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4 border-r border-gray-100">Menu name</th>
                  <th className="p-4 border-r border-gray-100">Type</th>
                  <th className="p-4 border-r border-gray-100">
                    Select Dishes
                  </th>
                  <th className="p-4">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-gray-900 border-r border-gray-50">
                    {sample.name}
                  </td>
                  <td className="p-4 text-gray-900 border-r border-gray-50">
                    {sample.type}
                  </td>
                  <td className="p-4 text-gray-900 border-r border-gray-50">
                    {sample.dishes.join(", ")}
                  </td>
                  <td className="p-4 text-gray-900">{sample.cost}</td>
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
