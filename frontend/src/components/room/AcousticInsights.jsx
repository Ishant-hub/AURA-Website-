"use client";

import React from "react";
import { Activity, CheckCircle2, AlertCircle, Compass, Zap } from "lucide-react";

export default function AcousticInsights({ dimensions, roomType, audioSetup }) {
  const isFeet = dimensions.unit === "FT";
  const length = dimensions.length;
  const width = dimensions.width;
  const height = dimensions.height;

  // Cubic volume
  const volume = Math.round(length * width * height);
  const volumeCuFt = isFeet ? volume : Math.round(volume * 35.3147);

  // Volume scale classification
  let roomScale = "Medium Studio";
  let volumeGuidance = "Balanced acoustic volume. Ideal for reference active floorstanders.";
  if (volumeCuFt < 1600) {
    roomScale = "Intimate Acoustic Space";
    volumeGuidance =
      "Compact volume. Bass boundary reinforcement is high; consider near-field monitors or controlled bass.";
  } else if (volumeCuFt > 3600) {
    roomScale = "Grand Listening Salon";
    volumeGuidance =
      "Substantial cubic volume. High-displacement multi-driver floorstanders and dedicated subwoofers recommended.";
  }

  // Dimension Ratios (Axial Mode Check)
  const ratioLW = length / width;
  const isSquare = Math.abs(ratioLW - 1) < 0.15;
  const isGolden = Math.abs(ratioLW - 1.6) < 0.25;

  let ratioStatus = "Favorable Proportions";
  let ratioColor = "text-primary";
  let ratioDesc =
    "Room length and width are well staggered, dispersing low-frequency standing waves naturally.";

  if (isSquare) {
    ratioStatus = "Square Room Alert";
    ratioColor = "text-error";
    ratioDesc =
      "Length and width are nearly identical. Coincident axial room modes may cause bass buildup around 45-60Hz. Stagger speaker positioning.";
  } else if (isGolden) {
    ratioStatus = "Golden Acoustic Ratio (~1.618)";
    ratioColor = "text-primary";
    ratioDesc =
      "Approaching the Bolt golden acoustic ratio. Natural distribution of eigenmodes minimizes acoustic flutter.";
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
            Acoustic Room Insights
          </h3>
        </div>
        <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase">
          Dynamic Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Volume & Pressurization */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono">Cubic Volume</span>
            <span className="text-white font-mono font-bold">
              {volume.toLocaleString()} {isFeet ? "cu.ft" : "m³"}
            </span>
          </div>
          <p className="text-xs font-semibold text-primary">{roomScale}</p>
          <p className="text-[11px] text-on-surface-variant/75 font-light leading-relaxed">
            {volumeGuidance}
          </p>
        </div>

        {/* Metric 2: Dimensional Modal Proportions */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono">Length/Width Ratio</span>
            <span className="text-white font-mono font-bold">
              1 : {ratioLW.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isSquare ? (
              <AlertCircle className="w-3.5 h-3.5 text-error shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
            <p className={`text-xs font-semibold ${ratioColor}`}>{ratioStatus}</p>
          </div>
          <p className="text-[11px] text-on-surface-variant/75 font-light leading-relaxed">
            {ratioDesc}
          </p>
        </div>

        {/* Metric 3: Configuration Sweet Spot */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono">Stereo Triangle</span>
            <span className="text-primary font-mono font-bold">60° Equilateral</span>
          </div>
          <p className="text-xs font-semibold text-white">Acoustic Focal Center</p>
          <p className="text-[11px] text-on-surface-variant/75 font-light leading-relaxed">
            {audioSetup !== "2.0"
              ? "Dedicated active subwoofer handles <80Hz low-pass, freeing main floorstanders for uncompressed dynamics."
              : "Pure two-channel stereo staging with minimal phase cancellation."}
          </p>
        </div>
      </div>
    </div>
  );
}
