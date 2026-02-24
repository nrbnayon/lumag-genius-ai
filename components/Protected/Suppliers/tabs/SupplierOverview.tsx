"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { SupplierCard } from "../SupplierCard";
import { SupplierGridSkeleton } from "@/components/Skeleton/SupplierSkeleton";
import { Supplier } from "@/types/supplier";

interface SupplierOverviewProps {
  suppliers: Supplier[];
  onViewDetails: (supplier: Supplier) => void;
}

export function SupplierOverview({
  suppliers,
  onViewDetails,
}: SupplierOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  const filteredSuppliers = suppliers.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(
    start,
    start + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Search Suppliers"
        className="max-w-xl bg-white border border-gray-100 shadow-xs"
        onSearch={(val) => {
          setLoading(true);
          setSearchQuery(val);
          setTimeout(() => setLoading(false), 500);
        }}
      />

      {loading ? (
        <SupplierGridSkeleton />
      ) : filteredSuppliers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
            {paginatedSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredSuppliers.length}
              itemsPerPage={itemsPerPage}
              currentItemsCount={paginatedSuppliers.length}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No suppliers found
          </h3>
          <p className="text-secondary">
            Try adjusting your search to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
