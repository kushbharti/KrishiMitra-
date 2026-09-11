"use client";

import React from "react";
import { Check, ChevronDown, Sprout } from "lucide-react";

interface CropSelectorProps {
  crops: string[];
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  disabled?: boolean;
}

export default function CropSelector({
  crops,
  selectedCrop,
  onSelectCrop,
  disabled = false,
}: CropSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Supported Crops Badges Showcase */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Supported Crops ({crops.length})
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50/80 rounded-xl border border-gray-200/60 backdrop-blur-sm">
          {crops.map((crop) => {
            const isSelected = crop === selectedCrop;
            return (
              <button
                key={crop}
                type="button"
                onClick={() => !disabled && onSelectCrop(crop)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 shadow-sm"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Sprout
                  size={12}
                  className={isSelected ? "text-white" : "text-emerald-600"}
                />
                {crop}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandatory Dropdown Selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="crop-select"
          className="block text-sm font-semibold text-gray-800"
        >
          Step 1: Select Your Crop <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={(e) => onSelectCrop(e.target.value)}
            disabled={disabled}
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              -- Choose a crop from the supported list --
            </option>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <ChevronDown size={18} />
          </div>
        </div>
        {!selectedCrop && (
          <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
            ⚠️ You must select a crop before uploading a leaf image.
          </p>
        )}
      </div>
    </div>
  );
}
