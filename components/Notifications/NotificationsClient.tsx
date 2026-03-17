"use client";

import { useState } from "react";
import { ApprovalItem, ApprovalType } from "@/types/approvals";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Shared/Pagination";
import { Bell } from "lucide-react";
import Image from "next/image";
import { ApprovalDetailModal } from "../Protected/Approvals/ApprovalDetailModal";
import { ConfirmationModal } from "../Shared/ConfirmationModal";
import { toast } from "sonner";
import { NotificationListSkeleton } from "../Skeleton/ApprovalSkeleton";
import {
  useGetApprovalsQuery,
  useApproveActionMutation,
} from "@/redux/services/approvalsApi";

export default function NotificationsClient() {
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // We map "Unread" to "pending" status if required, or simply fetch all based on the tab.
  const { data: response, isLoading, isFetching } = useGetApprovalsQuery({
    status: activeTab === "Unread" ? "pending" : undefined,
    page: currentPage,
    per_page: itemsPerPage,
  });

  const [approveAction] = useApproveActionMutation();

  const notifications: ApprovalItem[] = response?.data?.items || [];
  const pagination = response?.data?.pagination;

  const [selectedNotification, setSelectedNotification] =
    useState<ApprovalItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [notificationToReject, setNotificationToReject] = useState<{
    id: string | number;
    type: ApprovalType;
  } | null>(null);

  const handleViewDetails = (notification: ApprovalItem) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (id: string | number, type: ApprovalType) => {
    try {
      await approveAction({ id, type, action: "approved" }).unwrap();
      toast.success("Request approved successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve request.");
    }
  };

  const handleRejectInitiate = (id: string | number, type: ApprovalType) => {
    setNotificationToReject({ id, type });
    setIsRejectConfirmOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (notificationToReject) {
      try {
        await approveAction({
          id: notificationToReject.id,
          type: notificationToReject.type,
          action: "rejected",
        }).unwrap();
        toast.error("Request rejected successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to reject request.");
      } finally {
        setIsRejectConfirmOpen(false);
        setNotificationToReject(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50 p-6 md:p-8 min-h-[600px]">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 mb-8">
        {(["All", "Unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative min-w-fit cursor-pointer",
              activeTab === tab
                ? "text-primary"
                : "text-gray-400 hover:text-secondary",
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute -bottom-px left-0 w-full h-[3px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4 mb-8">
        {isLoading || isFetching ? (
          <NotificationListSkeleton />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={`${notification.type}_${notification.id}`}
              className={cn(
                "p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between group gap-4",
                notification.approval_status === "pending"
                  ? "bg-blue-50/10 border-blue-100/50"
                  : "bg-white border-gray-50",
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 relative bg-gray-100">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      notification.created_by_name || "User",
                    )}&background=random`}
                    alt={notification.created_by_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-foreground">
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}{" "}
                      Approval Request
                    </h3>
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider",
                        notification.approval_status === "pending"
                          ? "bg-orange-100 text-orange-600"
                          : notification.approval_status === "approved"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600",
                      )}
                    >
                      {notification.approval_status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-secondary">
                    {notification.created_by_name} wants to add a{" "}
                    {notification.type}: <strong>{notification.name}</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleViewDetails(notification)}
                      className="px-4 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                    {notification.approval_status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(notification.id, notification.type)
                          }
                          className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded border border-green-100 hover:bg-green-100 transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleRejectInitiate(notification.id, notification.type)
                          }
                          className="px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-secondary">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-bold">No notifications found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          onPageChange={setCurrentPage}
          totalItems={pagination.total_items}
          itemsPerPage={itemsPerPage}
          currentItemsCount={notifications.length}
        />
      )}

      {/* Modals */}
      <ApprovalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedNotification}
        onApprove={(id, type) => {
          handleApprove(id, type);
          setIsDetailModalOpen(false);
        }}
        onReject={(id, type) => {
          handleRejectInitiate(id, type);
          setIsDetailModalOpen(false);
        }}
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
