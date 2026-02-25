"use client";

import { useState, useMemo } from "react";
import { Pencil, Download, Trash2 } from "lucide-react";
import type { Purchase } from "@/types/supplier";
import { TablePagination } from "@/components/Shared/TablePagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { PurchaseModal } from "./PurchaseModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COLS = [
  "Product Name",
  "Price",
  "Unit",
  "Category",
  "Quantity",
  "Supplier Name",
  "Purchase Date",
  "Action",
];
const PAGE_SIZE = 6;

interface PurchaseTableProps {
  title: string;
  subtitle?: string;
  initialData: Purchase[];
  modalType?: "purchase" | "other";
}

export function PurchaseTable({
  title,
  subtitle,
  initialData,
  modalType = "purchase",
}: PurchaseTableProps) {
  const [items, setItems] = useState<Purchase[]>(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Purchase | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Purchase | null>(null);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialData.filter((i) => i.isSelected).map((i) => i.id)),
  );

  // Filtered + paged
  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.productName.toLowerCase().includes(search.toLowerCase()) ||
          i.supplierName.toLowerCase().includes(search.toLowerCase()) ||
          i.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Add
  const handleAdd = (data: Partial<Purchase>) => {
    const newItem: Purchase = {
      id: `${Date.now()}`,
      productName: data.productName ?? "",
      price: data.price ?? "$0",
      unit: data.unit ?? "",
      category: data.category ?? "Vegetable",
      quantity: data.quantity ?? 0,
      supplierName: data.supplierName ?? "",
      purchaseDate: data.purchaseDate ?? "",
    };
    setItems((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    toast.success("Purchase added successfully!");
  };

  // Edit
  const handleEdit = (data: Partial<Purchase>) => {
    if (!editTarget) return;
    setItems((prev) =>
      prev.map((i) => (i.id === editTarget.id ? { ...i, ...data } : i)),
    );
    setEditTarget(null);
    toast.success("Purchase updated successfully!");
  };

  // Delete
  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Purchase deleted.");
  };

  // Download (stub)
  const handleDownload = (item: Purchase) => {
    toast.info(`Downloading data for "${item.productName}"…`);
  };

  return (
    <div className="space-y-1">
      {/* Section header */}
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {subtitle && <span className="text-xs text-secondary">{subtitle}</span>}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#EBF5FF]">
                {COLS.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3.5 text-left text-sm font-semibold text-[#3B82F6] whitespace-nowrap first:pl-6 last:pr-6"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    className="text-center py-10 text-secondary text-sm"
                  >
                    No purchases found.
                  </td>
                </tr>
              ) : (
                paged.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Checkbox + Product Name */}
                    <td className="px-4 py-3.5 pl-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className={cn(
                            "w-4 h-4 rounded border-gray-300 accent-red-500 cursor-pointer",
                          )}
                        />
                        <span className="font-medium text-foreground">
                          {item.productName}
                        </span>
                      </label>
                    </td>
                    <td className="px-4 py-3.5 text-secondary">{item.price}</td>
                    <td className="px-4 py-3.5 text-secondary">{item.unit}</td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.category}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-3.5 text-secondary">
                      {item.purchaseDate}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditTarget(item)}
                          className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
          totalItems={filtered.length}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          className="border-t border-gray-100"
        />
      </div>

      {/* Add Modal */}
      <PurchaseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAdd}
        mode="add"
        type={modalType}
      />

      {/* Edit Modal */}
      <PurchaseModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onConfirm={handleEdit}
        purchase={editTarget}
        mode="edit"
        type={modalType}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Purchase"
        description={`Are you sure you want to delete "${deleteTarget?.productName}"? This action cannot be undone.`}
      />
    </div>
  );
}
