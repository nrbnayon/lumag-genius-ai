"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronDown, PencilLine } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function SettingsClient() {
  // Section Edit Modes
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);

  // Form States
  const [accountInfo, setAccountInfo] = useState({
    email: "example@gmail.com",
    phone: "000-0000-000",
    address: "123 Admin Street, Dhaka",
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [language, setLanguage] = useState("English");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveAccount = () => {
    setIsEditingAccount(false);
    toast.success("Account information updated");
  };

  const handleUpdatePassword = () => {
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsEditingSecurity(false);
    setSecurityInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Password updated successfully");
  };

  const handleSaveLanguage = () => {
    setIsEditingLanguage(false);
    toast.success(`Language set to ${language}`);
  };

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
                  Account Information
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  Update your account details
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
              {isEditingAccount ? (
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) =>
                        setAccountInfo({
                          ...accountInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1F2937]">
                      Phone Number
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
                      Address
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
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      Email Address
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">
                      Phone Number
                    </p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1F2937]">Address</p>
                    <p className="text-sm text-[#4B5563] font-medium">
                      {accountInfo.address}
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
                  Security
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  Manage password and security settings
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
                      Current Password
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
                        New Password
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
                        Confirm New Password
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
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1F2937]">
                    Current Password
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#4B5563] font-medium tracking-widest">
                      *********
                    </p>
                    <button className="text-gray-300 hover:text-gray-400 cursor-pointer">
                      <EyeOff className="w-5 h-5" />
                    </button>
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
                  Language
                </h2>
                <p className="text-sm text-[#4B5563] font-medium">
                  Manage your language settings
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
                      Selected Language
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Portuguese">Portuguese</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveLanguage}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1F2937]">
                    Selected Language
                  </p>
                  <p className="text-sm text-[#4B5563] font-medium">
                    {language}
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
