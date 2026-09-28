"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Sparkles, Check } from "lucide-react";

export default function SaveDesignModal({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) {
  const [designName, setDesignName] = useState("");
  const [error, setError] = useState("");

  // Default suggested design name based on current room setup
  useEffect(() => {
    if (isOpen && currentConfig) {
      const { roomType = "living-room", dimensions, audioSetup } = currentConfig;
      const typeLabel = roomType
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const defaultName = `${typeLabel} (${dimensions?.length || 20}×${dimensions?.width || 15} ${dimensions?.unit || "FT"})`;
      setDesignName(defaultName);
      setError("");
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = designName.trim();
    if (!trimmed) {
      setError("Please provide a name for this design.");
      return;
    }
    onSave(trimmed);
    onClose();
  };

  const { dimensions, roomType, audioSetup, selectedSpeaker } = currentConfig || {};
  const speakerLabel = (selectedSpeaker || "").toLowerCase().includes("aether")
    ? "Aether Mono S1"
    : "Eclipse X1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div
        className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#0e0d0c] border border-primary/30 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-primary" />
            <h3 className="font-display-lg text-lg text-white font-light tracking-wide">
              Save Your Room
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Snapshot Summary */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Dimensions:</span>
            <span className="text-white font-semibold">
              {dimensions?.length} × {dimensions?.width} × {dimensions?.height} {dimensions?.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Audio Setup:</span>
            <span className="text-primary font-semibold">{audioSetup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Room Type:</span>
            <span className="text-white capitalize">
              {(roomType || "").replace("-", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Primary Speakers:</span>
            <span className="text-white">{speakerLabel}</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-label-caps tracking-widest text-on-surface-variant uppercase font-semibold block">
              Design Name:
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => {
                setDesignName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. My Living Room"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-primary text-white text-sm focus:outline-none transition-colors"
            />
            {error && <p className="text-xs text-error mt-1">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-label-caps tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-xs tracking-widest uppercase font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Design</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
