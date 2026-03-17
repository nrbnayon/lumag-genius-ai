"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { Pagination } from "@/components/Shared/Pagination";
import { SupplierCard } from "../SupplierCard";
import { SupplierGridSkeleton } from "@/components/Skeleton/SupplierSkeleton";
import { SupplierDetail } from "@/types/supplier";
import { useGetAllSuppliersQuery } from "@/redux/services/suppliersApi";

interface SupplierOverviewProps {
  onViewDetails: (supplier: SupplierDetail) => void;
}

export function SupplierOverview({ onViewDetails }: SupplierOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data, isLoading, isFetching } = useGetAllSuppliersQuery({
    page: currentPage,
    page_size: itemsPerPage,
    search_term: searchQuery || undefined,
  });

  const suppliers = data?.data ?? [];
  const totalItems = data?.count ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Search Suppliers"
        className="max-w-xl bg-white border border-gray-100 shadow-xs"
        onSearch={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <SupplierGridSkeleton />
      ) : suppliers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
            {suppliers.map((supplier) => (
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
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentItemsCount={suppliers.length}
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
