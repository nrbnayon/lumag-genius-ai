"use client";

import { X, ExternalLink } from "lucide-react";

interface StaffCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  staffName: string | undefined;
}

export function StaffCVModal({
  isOpen,
  onClose,
  cvUrl,
  staffName,
}: StaffCVModalProps) {
  if (!isOpen) return null;

  // Convert Google Drive view link to preview link for embedding
  const embedUrl = cvUrl.replace("/view?usp=drive_link", "/preview");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {staffName}'s CV / Resume
            </h2>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <iframe
            src={embedUrl}
            className="w-full h-full border-none"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
