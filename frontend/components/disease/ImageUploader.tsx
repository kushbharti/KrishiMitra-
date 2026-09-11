"use client";

import React, { useRef, useState, useCallback } from "react";
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function ImageUploader({
  onImageSelect,
  preview,
  onClear,
  disabled = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndProcessFile = useCallback(
    (file: File) => {
      setValidationError(null);

      // 1. Extension validation
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (
        !ALLOWED_EXTENSIONS.includes(ext) ||
        !ALLOWED_MIME_TYPES.includes(file.type)
      ) {
        setValidationError(
          "Invalid file format. Please upload only JPG, JPEG, PNG, or WEBP leaf images.",
        );
        return;
      }

      // 2. File size validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setValidationError(
          `File size exceeds ${MAX_FILE_SIZE_MB}MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB uploaded). Please compress your image.`,
        );
        return;
      }

      onImageSelect(file);
    },
    [onImageSelect],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        Step 2: Upload Leaf Image <span className="text-red-500">*</span>
      </label>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gray-900 shadow-lg group">
          <img
            src={preview}
            alt="Leaf preview"
            className="h-64 w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
            <span className="text-xs font-medium text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
              Step 3: Ready for Analysis
            </span>
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="rounded-full bg-red-600/90 p-2 text-white shadow-md hover:bg-red-700 transition-all focus:outline-none"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer ${
            disabled
              ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              : isDragging
                ? "border-emerald-500 bg-emerald-50/50 scale-[0.99]"
                : "border-gray-300 bg-gray-50/50 hover:border-emerald-400 hover:bg-emerald-50/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-3 shadow-inner">
            <UploadCloud size={28} />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Click to upload{" "}
            <span className="font-normal text-gray-500">or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Supported formats: JPG, JPEG, PNG, WEBP (Max size: 5MB)
          </p>
        </div>
      )}

      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-shake">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
