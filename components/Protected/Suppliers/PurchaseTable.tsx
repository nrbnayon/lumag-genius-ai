"use client";

import { useState, useMemo } from "react";
import { Download, Trash2, SquarePen, Loader2 } from "lucide-react";
import type { PurchaseItem } from "@/types/supplier";
import { TablePagination } from "@/components/Shared/TablePagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { PurchaseModal } from "./PurchaseModal";
import { toast } from "sonner";
import {
  useGetAllPurchasesQuery,
  useUpdatePurchaseMutation,
} from "@/redux/services/suppliersApi";
import type { PurchaseQueryParams, CreatePurchasePayload } from "@/types/supplier";
import { cn } from "@/lib/utils";

const COLS = [
  "Product Name",
  "Price",
  "Unit",
  "Category",
  "Quantity",
  "Supplier",
  "Date",
  "Status",
  "Action",
];
const PAGE_SIZE = 6;

interface PurchaseTableProps {
  title: string;
  subtitle?: string;
  queryParams?: PurchaseQueryParams;
  isSpecial?: boolean;
  externalSearch?: string;
}

export function PurchaseTable({
  title,
  subtitle,
  queryParams = {},
  isSpecial = false,
  externalSearch = "",
}: PurchaseTableProps) {
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<PurchaseItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseItem | null>(null);

  const { data, isLoading, isFetching } = useGetAllPurchasesQuery({
    ...queryParams,
    page,
    page_size: PAGE_SIZE,
    search_term: externalSearch || undefined,
  });

  const [updatePurchase, { isLoading: isUpdating }] = useUpdatePurchaseMutation();

  const items = data?.data ?? [];
  const totalItems = data?.count ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const statusColors = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };

  // Edit
  const handleEdit = async (formData: Partial<CreatePurchasePayload>) => {
    if (!editTarget) return;
    try {
      await updatePurchase({
        id: editTarget.id,
        payload: formData,
      }).unwrap();
      setEditTarget(null);
      toast.success("Purchase updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update purchase.");
    }
  };

  // Delete (no API endpoint — show info)
  const handleDelete = () => {
    if (!deleteTarget) return;
    toast.info(`Deletion of "${deleteTarget.product_name}" requires admin approval.`);
    setDeleteTarget(null);
  };

  // Download stub
  const handleDownload = (item: PurchaseItem) => {
    if (item.product_file) {
      window.open(item.product_file, "_blank");
    } else {
      toast.info(`No file attached for "${item.product_name}".`);
    }
  };

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-1">
      {/* Section header */}
      <div className="flex items-baseline gap-2 mb-2">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {subtitle && <span className="text-xs text-secondary">{subtitle}</span>}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_16px_0px_#A9A9A940] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-[#EBF5FF]">
                {COLS.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3.5 text-left text-sm font-semibold whitespace-nowrap first:pl-6"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {COLS.map((col) => (
                      <td key={col} className="px-4 py-3.5 first:pl-6">
                        <div className="h-4 bg-gray-100 rounded w-full max-w-[100px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    className="text-center py-10 text-secondary text-sm"
                  >
                    No {isSpecial ? "special" : ""} purchases found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Product Name */}
                    <td className="px-4 py-3.5 pl-6">
                      <span className="font-medium text-foreground">
                        {item.product_name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">{item.unit}</td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.category_name}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      {parseFloat(item.quantity).toFixed(0)}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.supplier_name}
                    </td>
                    <td className="px-4 py-3.5 text-secondary whitespace-nowrap">
                      {new Date(item.purchase_date).toLocaleDateString()}
                    </td>
                    {/* Approval status badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border",
                          statusColors[item.approval_status],
                        )}
                      >
                        {item.approval_status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="w-full flex items-center gap-3">
                        <button
                          onClick={() => setEditTarget(item)}
                          className="text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          className="border-t border-gray-100"
        />
      </div>

      {/* Edit Modal */}
      <PurchaseModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onConfirm={handleEdit}
        purchase={editTarget}
        mode="edit"
        type={isSpecial ? "other" : "purchase"}
        isLoading={isUpdating}
      />

      {/* Delete confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Purchase"
        description={`Are you sure you want to delete "${deleteTarget?.product_name}"? This action cannot be undone.`}
      />
    </div>
  );
}
