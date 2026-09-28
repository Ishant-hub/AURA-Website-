"use client";

import React, { useState } from "react";
import { X, FolderOpen, Trash2, Check, AlertTriangle, ArrowRight } from "lucide-react";

export default function MyDesignsModal({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDeleteDesign,
}) {
  const [designToDelete, setDesignToDelete] = useState(null);

  if (!isOpen) return null;

  const handleDeleteConfirm = () => {
    if (designToDelete) {
      onDeleteDesign(designToDelete.id);
      setDesignToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-[#0e0d0c] border border-primary/30 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-label-caps tracking-[0.3em] text-primary font-bold uppercase block">
                SAVED ARCHIVE
              </span>
              <h3 className="font-display-lg text-xl text-white font-light tracking-wide">
                My Room Designs
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Designs List or Empty State */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
          {savedDesigns.length === 0 ? (
            /* Empty State */
            <div className="py-14 px-6 text-center space-y-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <FolderOpen className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
              <h4 className="text-base text-white font-medium">No saved rooms yet.</h4>
              <p className="text-xs text-on-surface-variant/70 max-w-sm mx-auto font-light leading-relaxed">
                Create your first room in the 3D studio, configure your acoustic space, and save it here for instant recall.
              </p>
            </div>
          ) : (
            /* Saved Designs Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDesigns.map((design) => {
                const { id, name, formattedDate, date, dimensions, audioSetup, roomType, selectedSpeaker } = design;
                const speakerLabel = (selectedSpeaker || "").toLowerCase().includes("aether")
                  ? "Aether Mono S1"
                  : "Eclipse X1";

                return (
                  <div
                    key={id}
                    className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider line-clamp-1">
                          {name}
                        </h4>
                        <span className="text-[10px] font-mono text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                          {audioSetup}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-on-surface-variant/80">
                        <p className="text-white/90">
                          {dimensions?.length} × {dimensions?.width} × {dimensions?.height} {dimensions?.unit}
                        </p>
                        <p className="text-[11px] capitalize text-on-surface-variant/70">
                          {(roomType || "").replace("-", " ")} • {speakerLabel}
                        </p>
                      </div>

                      <p className="text-[10px] font-mono text-on-surface-variant/50">
                        Saved: {formattedDate || date || "Recent"}
                      </p>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          onLoadDesign(design);
                          onClose();
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary font-label-caps text-[11px] tracking-wider uppercase font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span>Load</span>
                      </button>

                      <button
                        onClick={() => setDesignToDelete(design)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-error/15 text-on-surface-variant hover:text-error border border-white/5 hover:border-error/30 transition-colors cursor-pointer"
                        title="Delete design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {designToDelete && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-[#141210] border border-error/40 space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Delete this saved room?
                </h4>
                <p className="text-xs text-on-surface-variant/80 font-mono">
                  &ldquo;{designToDelete.name}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDesignToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-label-caps tracking-wider text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-lg bg-error hover:bg-error/90 text-white text-xs font-label-caps tracking-wider uppercase font-bold transition-all cursor-pointer shadow-lg shadow-error/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
