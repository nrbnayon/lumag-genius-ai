"use client";

import { SquarePen, Download, Trash2 } from "lucide-react";
import { Menu } from "@/types/menu";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  onExport: (menu: Menu) => void;
}

export function MenuCard({ menu, onEdit, onDelete, onExport }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold",
            menu.status === "Approved"
              ? "bg-[#ECFDF5] text-[#10B981]"
              : "bg-[#FEFCE8] text-[#F59E0B]",
          )}
        >
          {menu.status}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExport(menu)}
            className="p-2 bg-[#E0F2FE] text-[#0EA5E9] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(menu)}
            className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground leading-tight">
          {menu.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-medium">Items</span>
            <span className="text-foreground font-bold">{menu.itemsCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-medium">Cost</span>
            <span className="text-foreground font-bold">{menu.cost}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-medium">Type</span>
            <span className="text-foreground font-bold">{menu.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
