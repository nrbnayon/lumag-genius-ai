// components\Protected\Approvals\ApprovalDetailModal.tsx
"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  ApprovalItem,
  ApprovalType,
  StaffApprovalItem,
  SupplierApprovalItem,
  MenuApprovalItem,
} from "@/types/approvals";
import { cn } from "@/lib/utils";

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ApprovalItem | null;
  onApprove: (id: string | number, type: ApprovalType) => void;
  onReject: (id: string | number, type: ApprovalType) => void;
}

export function ApprovalDetailModal({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
}: ApprovalDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderContent = () => {
    switch (item.type) {
      case "ingredient": {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Ingredient Name
                </p>
                <p className="text-sm font-bold text-foreground">{item.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Created At
                </p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl">
              Additional ingredient details will be shown here.
            </div>
          </div>
        );
      }
      case "staff": {
        const staff = item as StaffApprovalItem;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Full Name
                </p>
                <p className="text-sm font-bold text-foreground">
                  {staff.name}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Email Address
                </p>
                <p className="text-sm font-bold text-foreground">
                  {staff.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Phone Number
                </p>
                <p className="text-sm font-bold text-foreground">
                  {staff.phone_number || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Role
                </p>
                <p className="text-sm font-bold text-primary uppercase tracking-wider">
                  {staff.role.replace("_", " ")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Verified Status
                </p>
                <p
                  className={cn(
                    "text-sm font-bold",
                    staff.is_verified ? "text-emerald-500" : "text-amber-500",
                  )}
                >
                  {staff.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Created Account At
                </p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(staff.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      }
      case "recipe": {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Recipe Name
                </p>
                <p className="text-sm font-bold text-foreground">{item.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Chef Name
                </p>
                <p className="text-sm font-bold text-foreground">
                  {item.created_by_name}
                </p>
              </div>
            </div>
            <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl">
              Recipe details and instructions will be shown here.
            </div>
          </div>
        );
      }
      case "menu": {
        const menu = item as MenuApprovalItem;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Menu Title
                </p>
                <p className="text-sm font-bold text-foreground">{menu.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Menu Type
                </p>
                <p className="text-sm font-bold text-foreground uppercase">
                  {menu.menu_type}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Outlet Type
                </p>
                <p className="text-sm font-bold text-foreground uppercase">
                  {menu.outlet_type}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Total Cost
                </p>
                <p className="text-lg font-black text-primary">
                  ${menu.total_cost}
                </p>
              </div>
            </div>
          </div>
        );
      }
      case "supplier": {
        const supplier = item as SupplierApprovalItem;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Supplier Name
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.name}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Email
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Phone
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.phone}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Outlet Type
                </p>
                <p className="text-sm font-bold text-foreground uppercase">
                  {supplier.outlet_type}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Address
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.address}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Contract Start
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.contract_start_date}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Contract End
                </p>
                <p className="text-sm font-bold text-foreground">
                  {supplier.contract_end_date}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Notes
                </p>
                <p className="text-sm font-medium text-foreground">
                  {supplier.notes || "No notes provided."}
                </p>
              </div>
            </div>
          </div>
        );
      }
      case "purchase": {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Purchase Item
                </p>
                <p className="text-sm font-bold text-foreground">{item.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">
                  Created By
                </p>
                <p className="text-sm font-bold text-foreground">
                  {item.created_by_name}
                </p>
              </div>
            </div>
            <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl">
              Purchase order details will be shown here.
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="p-8 text-center text-secondary border border-dashed border-gray-200 rounded-3xl">
            Coming Soon: Detailed view for {(item as any)?.type}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pb-4 shrink-0">
          <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">
            Workflow Management
          </p>
          <h2 className="text-3xl font-black text-foreground">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Approval
            Details
          </h2>
        </div>

        <div className="px-8 py-4 overflow-y-auto custom-scrollbar flex-1">
          {renderContent()}
        </div>

        <div className="p-8 flex gap-4 shrink-0 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => {
              onReject(item.id, item.type);
              onClose();
            }}
            className="flex-1 py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Reject Request
          </button>
          <button
            onClick={() => {
              onApprove(item.id, item.type);
              onClose();
            }}
            className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 cursor-pointer"
          >
            Approve & Finalize
          </button>
        </div>
      </div>
    </div>
  );
}
