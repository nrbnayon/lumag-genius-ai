"use client";

import { useState, useMemo, useEffect } from "react";
import { notificationsData } from "@/data/notificationsData";
import { ApprovalRequest } from "@/types/approvals";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Shared/Pagination";
import { Bell } from "lucide-react";
import Image from "next/image";
import { ApprovalDetailModal } from "../Protected/Approvals/ApprovalDetailModal";
import { ConfirmationModal } from "../Shared/ConfirmationModal";
import { toast } from "sonner";
import { NotificationListSkeleton } from "../Skeleton/ApprovalSkeleton";

export default function NotificationsClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");
  const [notifications, setNotifications] =
    useState<ApprovalRequest[]>(notificationsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedNotification, setSelectedNotification] =
    useState<ApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [notificationToReject, setNotificationToReject] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "Unread") {
      return notifications.filter((n) => n.readStatus === "unread");
    }
    return notifications;
  }, [activeTab, notifications]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentItems = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readStatus: "read" } : n)),
    );
  };

  const handleViewDetails = (notification: ApprovalRequest) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
    handleMarkAsRead(notification.id);
  };

  const handleApprove = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Approved" } : n)),
    );
    toast.success("Request approved successfully");
  };

  const handleRejectInitiate = (id: string) => {
    setNotificationToReject(id);
    setIsRejectConfirmOpen(true);
  };

  const handleRejectConfirm = () => {
    if (notificationToReject) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationToReject ? { ...n, status: "Rejected" } : n,
        ),
      );
      toast.error("Request rejected successfully");
      setIsRejectConfirmOpen(false);
      setNotificationToReject(null);
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
        {isLoading ? (
          <NotificationListSkeleton />
        ) : currentItems.length > 0 ? (
          currentItems.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-5 rounded-2xl border transition-all flex items-center justify-between group",
                notification.readStatus === "unread"
                  ? "bg-blue-50/10 border-blue-100/50"
                  : "bg-white border-gray-50",
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 relative">
                  <Image
                    src={
                      notification.avatar ||
                      `https://i.pravatar.cc/150?u=${notification.addedBy}`
                    }
                    alt={notification.addedBy}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">
                    {notification.title}
                  </h3>
                  <p className="text-xs font-medium text-secondary">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleViewDetails(notification)}
                      className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded border border-green-100 hover:bg-green-100 transition-all cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRejectInitiate(notification.id)}
                      className="px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-secondary">
                  {notification.timestamp}
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
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredNotifications.length}
          itemsPerPage={itemsPerPage}
          currentItemsCount={currentItems.length}
        />
      )}

      {/* Modals */}
      <ApprovalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        request={selectedNotification}
        onApprove={(id) => {
          handleApprove(id);
          setIsDetailModalOpen(false);
        }}
        onReject={(id) => {
          handleRejectInitiate(id);
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
