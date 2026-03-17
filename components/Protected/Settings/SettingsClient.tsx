"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  ChevronDown,
  PencilLine,
  Camera,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import Image from "next/image";
import TranslatedText from "@/components/Shared/TranslatedText";
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} from "@/redux/services/authApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsClient() {
  const { data: response, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Section Edit Modes
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);

  // Form States
  const [accountInfo, setAccountInfo] = useState({
    image: "/images/user.webp",
    name: "",
    email_address: "",
    phone: "",
    address: "",
    language: "english"
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (response?.data) {
      const p = response.data;
      setAccountInfo({
        image: p.avatar || "/images/user.webp",
        name: p.full_name || "",
        email_address: p.email_address || "",
        phone: p.phone_number || "",
        address: p.location || "",
        language: p.language || "english"
      });
    }
  }, [response]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        await updateProfile(formData).unwrap();
        toast.success("Profile image updated");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to update profile image");
      }
    }
  };

  const handleRemoveImage = async () => {
    // Usually removing means setting to null or a default
    // If the API doesn't have a specific delete avatar, we might not be able to "remove" it easily via FormData PATCH if it expects a file.
    // For now, let's just toast
    toast.info("Feature to remove image coming soon");
  };

  const handleSaveAccount = async () => {
    const formData = new FormData();
    formData.append("full_name", accountInfo.name);
    formData.append("phone_number", accountInfo.phone);
    formData.append("location", accountInfo.address);

    try {
      await updateProfile(formData).unwrap();
      setIsEditingAccount(false);
      toast.success("Account information updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update account information");
    }
  };

  const handleUpdatePassword = async () => {
    if (!securityInfo.currentPassword || !securityInfo.newPassword || !securityInfo.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        current_password: securityInfo.currentPassword,
        new_password: securityInfo.newPassword,
        confirm_password: securityInfo.confirmPassword,
      }).unwrap();
      
      setIsEditingSecurity(false);
      setSecurityInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  const handleSaveLanguage = async () => {
    const formData = new FormData();
    formData.append("language", accountInfo.language);

    try {
      await updateProfile(formData).unwrap();
      setIsEditingLanguage(false);
      toast.success(`Language set to ${accountInfo.language}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to set language");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="pb-10">
        <DashboardHeader
          title="Settings"
          description="Manage your account and application preferences"
        />
        <main className="px-4 md:px-8 space-y-6 mx-auto mt-5">
           <Skeleton className="h-64 w-full rounded-3xl" />
           <Skeleton className="h-64 w-full rounded-3xl" />
           <Skeleton className="h-48 w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <DashboardHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <main className="px-4 md:px-8 space-y-6 mx-auto animate-in fade-in duration-500 mt-5">
        {/* Account Information Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937] mb-1">
                  <TranslatedText text="Account Information" />
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  <TranslatedText text="Update your account details" />
                </p>
              </div>
              {!isEditingAccount && (
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="p-2 text-gray-400 hover:text-primary transition-all cursor-pointer"
                >
                  <PencilLine className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              {/* Profile Image Section */}
              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-primary/20 p-1 flex items-center justify-center shrink-0">
                      <Image
                        src={accountInfo.image}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    </div>
                    {isEditingAccount && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Profile Image" />
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!isEditingAccount || isUpdatingProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        <TranslatedText text="Change Image" />
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        disabled={
                          !isEditingAccount ||
                          !response?.data?.avatar
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <TranslatedText text="Remove" />
                      </button>
                    </div>
                    <p className="text-[10px] text-[#4B5563] font-medium uppercase tracking-wider">
                      JPG, PNG, WEBP (MAX 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {isEditingAccount ? (
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Full Name" />
                    </label>
                    <input
                      type="text"
                      value={accountInfo.name}
                      onChange={(e) =>
                        setAccountInfo({
                          ...accountInfo,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Email Address" />
                    </label>
                    <input
                      type="email"
                      value={accountInfo.email_address}
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-500 cursor-not-allowed transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Phone Number" />
                    </label>
                    <input
                      type="text"
                      value={accountInfo.phone}
                      onChange={(e) =>
                        setAccountInfo({
                          ...accountInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Address" />
                    </label>
                    <input
                      type="text"
                      value={accountInfo.address}
                      onChange={(e) =>
                        setAccountInfo({
                          ...accountInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveAccount}
                      disabled={isUpdatingProfile}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                      <TranslatedText text="Save Changes" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Full Name" />
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Email Address" />
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.email_address}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Phone Number" />
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.phone || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Address" />
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      <TranslatedText text={accountInfo.address || "N/A"} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937] mb-1">
                  <TranslatedText text="Security" />
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  <TranslatedText text="Manage password and security settings" />
                </p>
              </div>
              {!isEditingSecurity && (
                <button
                  onClick={() => setIsEditingSecurity(true)}
                  className="p-2 text-gray-400 hover:text-primary transition-all cursor-pointer"
                >
                  <PencilLine className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              {isEditingSecurity ? (
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Current Password" />
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={securityInfo.currentPassword}
                        onChange={(e) =>
                          setSecurityInfo({
                            ...securityInfo,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-12"
                      />
                      <button
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1F2937]">
                        <TranslatedText text="New Password" />
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter New Password"
                          value={securityInfo.newPassword}
                          onChange={(e) =>
                            setSecurityInfo({
                              ...securityInfo,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-12"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1F2937]">
                        <TranslatedText text="Confirm New Password" />
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter Password"
                          value={securityInfo.confirmPassword}
                          onChange={(e) =>
                            setSecurityInfo({
                              ...securityInfo,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-12"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isChangingPassword}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                      <TranslatedText text="Update Password" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1F2937]">
                    <TranslatedText text="Current Password" />
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#4B5563] font-medium tracking-widest">
                      *********
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937] mb-1">
                  <TranslatedText text="Language For Ai Chat" />
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  <TranslatedText text="Manage your ai chat language settings" />
                </p>
              </div>
              {!isEditingLanguage && (
                <button
                  onClick={() => setIsEditingLanguage(true)}
                  className="p-2 text-gray-400 hover:text-primary transition-all cursor-pointer"
                >
                  <PencilLine className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              {isEditingLanguage ? (
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      <TranslatedText text="Selected Language" />
                    </label>
                    <div className="relative">
                      <select
                        value={accountInfo.language}
                        onChange={(e) =>
                          setAccountInfo({ ...accountInfo, language: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="english">English</option>
                        <option value="portuguese">Portuguese</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveLanguage}
                      disabled={isUpdatingProfile}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                      <TranslatedText text="Save Changes" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1F2937]">
                    <TranslatedText text="Selected Language" />
                  </p>
                  <p className="text-sm text-[#4B5563] font-medium capitalize">
                    {accountInfo.language}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
