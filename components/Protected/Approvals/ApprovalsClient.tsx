// d:\Nayon xD\Running Projects\Web Design Phase\lumag-genius-ai-admin-dashboard\components\Protected\Approvals\ApprovalsClient.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ApprovalItem,
  ApprovalStatus,
  ApprovalType,
} from "@/types/approvals";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  BookOpen,
  Utensils,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  Search,
  Truck
} from "lucide-react";
import { ApprovalDetailModal } from "./ApprovalDetailModal";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Pagination } from "@/components/Shared/Pagination";
import { ApprovalListSkeleton } from "@/components/Skeleton/ApprovalSkeleton";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { 
  useGetApprovalsQuery, 
  useApproveActionMutation 
} from "@/redux/services/approvalsApi";
import { Input } from "@/components/ui/input";

export default function ApprovalsClient() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Confirmation Modal State
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [itemToReject, setItemToReject] = useState<{ id: string | number, type: ApprovalType } | null>(null);

  // Queries
  const { data: response, isLoading, isFetching } = useGetApprovalsQuery({
    status: activeTab === "all" ? undefined : activeTab,
    search: searchTerm,
    page: currentPage,
    per_page: perPage
  });

  // Mutations
  const [approveAction, { isLoading: isActing }] = useApproveActionMutation();

  const handleApprove = async (id: string | number, type: ApprovalType) => {
    try {
      await approveAction({ id, type, action: "approved" }).unwrap();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve request.");
    }
  };

  const handleRejectInitiate = (id: string | number, type: ApprovalType) => {
    setItemToReject({ id, type });
    setIsRejectConfirmOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (itemToReject) {
      try {
        await approveAction({ 
          id: itemToReject.id, 
          type: itemToReject.type, 
          action: "rejected" 
        }).unwrap();
        toast.error(`${itemToReject.type.charAt(0).toUpperCase() + itemToReject.type.slice(1)} rejected successfully`);
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to reject request.");
      } finally {
        setIsRejectConfirmOpen(false);
        setItemToReject(null);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ingredient":
        return ShoppingBag;
      case "recipe":
        return Utensils;
      case "menu":
        return BookOpen;
      case "staff":
        return UserPlus;
      case "supplier":
        return Truck;
      case "purchase":
        return ShoppingBag;
      default:
        return BookOpen;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "ingredient":
        return "bg-red-50 text-red-500";
      case "recipe":
        return "bg-blue-50 text-blue-500";
      case "menu":
        return "bg-pink-50 text-pink-500";
      case "staff":
        return "bg-emerald-50 text-emerald-500";
      case "supplier":
        return "bg-amber-50 text-amber-500";
      case "purchase":
        return "bg-indigo-50 text-indigo-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const items = response?.data?.items || [];
  const summary = response?.data?.summary || { pending: 0, approved: 0, rejected: 0 };
  const pagination = response?.data?.pagination;

  return (
    <div className="pb-10 bg-[#F9FAFB] min-h-screen">
      <DashboardHeader
        title="Approvals"
        description="Review and manage workflow approvals for staff, suppliers, ingredients, and more."
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Pending Approval"
            value={summary.pending}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
          />
          <StatsCard
            title="Approved"
            value={summary.approved}
            icon={CheckCircle2}
            iconColor="#10B981"
            iconBgColor="#ECFDF5"
          />
          <StatsCard
            title="Rejected"
            value={summary.rejected}
            icon={XCircle}
            iconColor="#EF4444"
            iconBgColor="#FEF2F2"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex bg-gray-50 p-1 rounded-2xl w-fit">
                {["all", "approved", "rejected", "pending"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab as any);
                            setCurrentPage(1);
                        }}
                        className={cn(
                            "px-6 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer",
                            activeTab === tab
                            ? "bg-white text-primary shadow-sm"
                            : "text-secondary hover:text-foreground",
                        )}
                    >
                        {tab}
                    </button>
                ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                        placeholder="Search by name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 rounded-2xl border-gray-200 outline-none focus:ring-primary/20"
                    />
                </div>
            </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {(isLoading || isFetching) && items.length === 0 ? (
            <ApprovalListSkeleton />
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={`${item.type}_${item.id}`}
                  className="bg-white p-5 rounded-2xl border-border shadow-[0px_4px_16px_0px_#A9A9A940] flex flex-col md:flex-row md:items-center justify-between group hover:shadow-md transition-all animate-in slide-in-from-bottom-2 duration-300 gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0",
                        getIconBg(item.type),
                      )}
                    >
                      {(() => {
                        const IconComponent = getIcon(item.type);
                        return <IconComponent className="w-6 h-6" />;
                      })()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                            item.approval_status === "pending"
                              ? "bg-orange-100 text-orange-600"
                              : item.approval_status === "approved"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600",
                          )}
                        >
                          {item.approval_status}
                        </span>
                        <h4 className="text-base font-bold text-foreground truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                           {item.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-secondary">
                        Created by <span className="text-foreground">{item.created_by_name}</span> ({item.created_by_role.replace("_", " ")})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0">
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Created Date</p>
                       <p className="text-xs font-bold text-secondary">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                       </p>
                    </div>

                    {item.approval_status === "pending" ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRejectInitiate(item.id, item.type)}
                          disabled={isActing}
                          className="px-6 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer active:scale-95 border border-red-100 uppercase tracking-widest"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-200 uppercase tracking-widest"
                        >
                           Review
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                           setSelectedItem(item);
                           setIsDetailModalOpen(true);
                        }}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                      >
                         <Search className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <Clock className="w-12 h-12 text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-secondary">
                    No {activeTab} requests found
                  </h3>
                </div>
              )}

              {pagination && pagination.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.total_pages}
                    onPageChange={setCurrentPage}
                    totalItems={pagination.total_items}
                    itemsPerPage={perPage}
                    currentItemsCount={items.length}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ApprovalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedItem}
        onApprove={handleApprove}
        onReject={handleRejectInitiate}
      />

      <ConfirmationModal
        isOpen={isRejectConfirmOpen}
        onClose={() => setIsRejectConfirmOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Request"
        message="Are you sure you want to reject this request? This action will set the status to Rejected."
        confirmText="Yes, Reject"
        isDestructive={true}
      />
    </div>
  );
}
