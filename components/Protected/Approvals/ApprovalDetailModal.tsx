"use client";

import Image from "next/image";
import {
  X,
  Calendar,
  User,
  ShoppingBag,
  BookOpen,
  Utensils,
} from "lucide-react";
import {
  ApprovalRequest,
  IngredientRequest,
  RecipeRequest,
  LeaveRequest,
  SupplierRequest,
  ReportRequest,
} from "@/types/approvals";
import { cn } from "@/lib/utils";

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ApprovalRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalDetailModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}: ApprovalDetailModalProps) {
  if (!isOpen || !request) return null;

  const renderContent = () => {
    switch (request.type) {
      case "Ingredient": {
        const data = request.data as IngredientRequest;
        return (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-secondary font-medium">
                    <th className="px-4 py-3 text-left">Ingredient name</th>
                    <th className="px-4 py-3 text-left">Unit</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    {data.quantityNeeded !== undefined && (
                      <th className="px-4 py-3 text-left">Quantity Needed</th>
                    )}
                    <th className="px-4 py-3 text-left">Current Stock</th>
                    <th className="px-4 py-3 text-left">Minimum Stock</th>
                    <th className="px-4 py-3 text-left">Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-foreground">
                    <td className="px-4 py-4">{data.name}</td>
                    <td className="px-4 py-4">{data.unit}</td>
                    <td className="px-4 py-4">{data.price}</td>
                    {data.quantityNeeded !== undefined && (
                      <td className="px-4 py-4">{data.quantityNeeded}</td>
                    )}
                    <td className="px-4 py-4">{data.currentStock}</td>
                    <td className="px-4 py-4">{data.minimumStock}</td>
                    <td className="px-4 py-4">{data.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case "Recipe": {
        const data = request.data as RecipeRequest;
        return (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-secondary font-medium border-b border-gray-100">
                    <th className="px-4 py-3 text-left border-r border-gray-100">
                      Recipe name
                    </th>
                    <th className="px-4 py-3 text-left border-r border-gray-100">
                      Avg. Time
                    </th>
                    <th className="px-4 py-3 text-left border-r border-gray-100">
                      Selling Price
                    </th>
                    <th className="px-4 py-3 text-left border-r border-gray-100">
                      Instruction
                    </th>
                    <th className="px-0 py-0" colSpan={4}>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-secondary border-b border-gray-100">
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Quantity</th>
                            <th className="px-4 py-3 text-left">Unit</th>
                            <th className="px-4 py-3 text-left">Cost</th>
                          </tr>
                        </thead>
                      </table>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-foreground align-top">
                    <td className="px-4 py-4 border-r border-gray-100">
                      {data.name}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-100">
                      {data.avgTime}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-100">
                      {data.sellingPrice}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-100 text-xs max-w-[200px]">
                      {data.instruction}
                    </td>
                    <td className="px-0 py-0" colSpan={4}>
                      <table className="w-full">
                        <tbody>
                          {data.ingredients.map((ing, idx) => (
                            <tr
                              key={idx}
                              className={cn(
                                "border-b border-gray-50 last:border-0",
                              )}
                            >
                              <td className="px-4 py-3 text-xs">{ing.name}</td>
                              <td className="px-4 py-3 text-xs">
                                {ing.quantity}
                              </td>
                              <td className="px-4 py-3 text-xs">{ing.unit}</td>
                              <td className="px-4 py-3 text-xs">{ing.cost}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50/30">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-xs font-bold text-right"
                            >
                              Total Cost
                            </td>
                            <td className="px-4 py-3 text-xs font-black text-primary">
                              $20
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case "Leave": {
        const data = request.data as LeaveRequest;
        return (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-secondary">
                Leave Type
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-foreground font-medium border border-gray-100">
                {data.leaveType}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-secondary">
                Start Date
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-foreground font-medium border border-gray-100">
                {data.startDate}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-secondary">
                End Date
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-foreground font-medium border border-gray-100">
                {data.endDate}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-secondary">Reason</label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-foreground font-medium border border-gray-100 min-h-[100px] text-xs leading-relaxed">
                {data.reason}
              </div>
            </div>
          </div>
        );
      }
      case "Supplier": {
        const data = request.data as SupplierRequest;
        return (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-secondary font-medium">
                    <th className="px-4 py-3 text-left">Supplier name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Contract Start</th>
                    <th className="px-4 py-3 text-left">Contract End</th>
                    <th className="px-4 py-3 text-left">Notes & Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-foreground">
                    <td className="px-4 py-4">{data.name}</td>
                    <td className="px-4 py-4">{data.phone}</td>
                    <td className="px-4 py-4">{data.email}</td>
                    <td className="px-4 py-4">{data.address}</td>
                    <td className="px-4 py-4">{data.contractStart}</td>
                    <td className="px-4 py-4">{data.contractEnd}</td>
                    <td className="px-4 py-4 max-w-[200px] truncate">
                      {data.notes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case "Report": {
        const data = request.data as ReportRequest;
        return (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-secondary font-medium">
                    <th className="px-4 py-3 text-left">Product Name</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Unit</th>
                    <th className="px-4 py-3 text-left">Supplier Name</th>
                    <th className="px-4 py-3 text-left">Report(If any)</th>
                    <th className="px-4 py-3 text-left">Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-foreground">
                    <td className="px-4 py-4">{data.productName}</td>
                    <td className="px-4 py-4">{data.price}</td>
                    <td className="px-4 py-4">{data.quantity}</td>
                    <td className="px-4 py-4">{data.unit}</td>
                    <td className="px-4 py-4">{data.supplierName}</td>
                    <td className="px-4 py-4">
                      {data.reportImage ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 relative">
                          <Image
                            src={data.reportImage}
                            alt="Report"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="text-gray-300">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{data.purchaseDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="p-8 text-center text-secondary">Coming Soon</div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:p-6 p-4 pb-4 shrink-0">
          <h2 className="text-2xl font-black text-foreground">
            Request Details
          </h2>
        </div>

        <div className="p-4 pt-2 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>

        <div className="md:p-6 p-4 flex gap-4 shrink-0 bg-gray-50/50">
          <button
            onClick={() => {
              onReject(request.id);
              onClose();
            }}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={() => {
              onApprove(request.id);
              onClose();
            }}
            className="flex-1 py-2.5 bg-white border-2 border-gray-200 text-foreground rounded-full font-black text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
