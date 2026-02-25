"use client";

import { useState } from "react";
import {
  ApprovalRequest,
  ApprovalStatus,
  LeaveRequest,
  MenuRequest,
} from "@/types/approvals";
import { approvalsData } from "@/data/approvalsData";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  BookOpen,
  Utensils,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ApprovalDetailModal } from "./ApprovalDetailModal";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Pagination } from "@/components/Shared/Pagination";
import { useEffect } from "react";
import { ApprovalListSkeleton } from "@/components/Skeleton/ApprovalSkeleton";

export default function ApprovalsClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ApprovalStatus | "All">("All");
  const [requests, setRequests] = useState<ApprovalRequest[]>(approvalsData);
  const [selectedRequest, setSelectedRequest] =
    useState<ApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredRequests =
    activeTab === "All"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentItems = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Approved" as ApprovalStatus } : r,
      ),
    );
    toast.success("Request approved successfully");
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Rejected" as ApprovalStatus } : r,
      ),
    );
    toast.error("Request rejected successfully");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Ingredient":
        return ShoppingBag;
      case "Recipe":
        return Utensils;
      case "Leave":
        return User;
      case "Menu":
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "Ingredient":
        return "bg-red-50 text-red-500";
      case "Recipe":
        return "bg-blue-50 text-blue-500";
      case "Leave":
        return "bg-amber-50 text-amber-500";
      case "Menu":
        return "bg-pink-50 text-pink-500";
      default:
        return "bg-blue-50 text-blue-500";
    }
  };

  const getRequestLabel = (request: ApprovalRequest) => {
    if (request.type === "Menu") {
      return (request.data as MenuRequest).title;
    }
    if (request.type === "Leave") {
      return (request.data as LeaveRequest).employeeName;
    }
    return (request.data as any).name;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "Ingredient":
        return "#EF4444";
      case "Recipe":
        return "#3B82F6";
      case "Leave":
        return "#F59E0B";
      case "Menu":
        return "#EC4899";
      default:
        return "#3B82F6";
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "Ingredient":
        return "#FEF2F2";
      case "Recipe":
        return "#EFF6FF";
      case "Leave":
        return "#FFFBEB";
      case "Menu":
        return "#FDF2F8";
      default:
        return "#EFF6FF";
    }
  };

  return (
    <div className="pb-10 bg-[#F9FAFB] min-h-screen">
      <DashboardHeader
        title="Approvals"
        description="Review and approve Ingredient additions, recipes, and leave requests"
      />

      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Pending Approval"
            value={requests.filter((r) => r.status === "Pending").length}
            icon={Clock}
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
          />
          <StatsCard
            title="Approved"
            value={requests.filter((r) => r.status === "Approved").length}
            icon={CheckCircle2}
            iconColor="#10B981"
            iconBgColor="#ECFDF5"
          />
          <StatsCard
            title="Rejected"
            value={requests.filter((r) => r.status === "Rejected").length}
            icon={XCircle}
            iconColor="#EF4444"
            iconBgColor="#FEF2F2"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
          {["All", "Approved", "Rejected", "Pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setCurrentPage(1);
              }}
              className={cn(
                "px-8 py-4 text-sm font-bold transition-all border-b-2 shrink-0 cursor-pointer",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <ApprovalListSkeleton />
          ) : (
            <>
              {currentItems.map((request) => (
                <div
                  key={request.id}
                  className="bg-white p-5 rounded-xl border-border shadow-[0px_4px_16px_0px_#A9A9A940] flex items-center justify-between group hover:shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shadow-none",
                        getIconBg(request.type),
                      )}
                    >
                      {(() => {
                        const IconComponent = getIcon(request.type);
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider",
                            request.status === "Pending"
                              ? "bg-orange-100 text-orange-600"
                              : request.status === "Approved"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600",
                          )}
                        >
                          {request.status}
                        </span>
                        <h4 className="text-base font-bold text-foreground">
                          {getRequestLabel(request)}
                        </h4>
                      </div>
                      <p className="text-sm font-medium text-secondary">
                        Added by {request.addedBy}
                      </p>
                      {request.type === "Leave" && (
                        <p className="text-xs text-secondary mt-1 font-medium italic">
                          {(request.data as any).reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-xs font-bold text-gray-400">
                      {request.timestamp}
                    </p>

                    {request.status === "Pending" ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-6 py-2 bg-red-50 text-red-600 text-sm font-black rounded-lg hover:bg-red-100 transition-all cursor-pointer active:scale-95 border"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-6 py-2 bg-emerald-50 text-emerald-600 text-sm font-black rounded-lg hover:bg-emerald-100 transition-all cursor-pointer active:scale-95 border"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-2 text-gray-300 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {currentItems.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <Clock className="w-12 h-12 text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-secondary">
                    No {activeTab.toLowerCase()} requests found
                  </h3>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredRequests.length}
                    itemsPerPage={itemsPerPage}
                    currentItemsCount={currentItems.length}
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
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
