"use client";

import React from "react";
import {
  Maximize2,
  Compass,
  Sliders,
  RotateCcw,
  Save,
  FolderOpen,
  Volume2,
  Layers,
  Sparkles,
} from "lucide-react";

export default function RoomControls({
  dimensions,
  setDimensions,
  roomType,
  setRoomType,
  audioSetup,
  setAudioSetup,
  budget,
  setBudget,
  onCameraPreset,
  onSaveDesign,
  onLoadDesign,
  onResetDesign,
  activeView,
  setActiveView,
}) {
  const isFeet = dimensions.unit === "FT";

  const handleUnitToggle = (newUnit) => {
    if (newUnit === dimensions.unit) return;

    if (newUnit === "METERS") {
      // FT -> METERS
      setDimensions({
        length: Math.round(dimensions.length * 0.3048 * 10) / 10,
        width: Math.round(dimensions.width * 0.3048 * 10) / 10,
        height: Math.round(dimensions.height * 0.3048 * 10) / 10,
        unit: "METERS",
      });
    } else {
      // METERS -> FT
      setDimensions({
        length: Math.round(dimensions.length / 0.3048),
        width: Math.round(dimensions.width / 0.3048),
        height: Math.round(dimensions.height / 0.3048),
        unit: "FT",
      });
    }
  };

  const handleDimensionChange = (field, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setDimensions((prev) => ({
      ...prev,
      [field]: Math.max(isFeet ? 8 : 2.5, Math.min(isFeet ? 50 : 15, num)),
    }));
  };

  const roomTypes = [
    { id: "music-room", label: "Music Room", desc: "Pure two-channel stereo staging & analog acoustics" },
    { id: "home-cinema", label: "Home Cinema", desc: "Immersive multi-channel surround & low-frequency pressure" },
    { id: "living-room", label: "Living Room", desc: "Architectural integration & wide acoustic dispersion" },
    { id: "gaming-room", label: "Gaming Room", desc: "High-dynamic near-field immersion & spatial cues" },
  ];

  const audioSetups = [
    { id: "2.0", label: "2.0 Stereo", desc: "Reference Left & Right pair" },
    { id: "2.1", label: "2.1 Stereo + Sub", desc: "Stereo towers + active subwoofer" },
    { id: "5.1", label: "5.1 Surround", desc: "Fronts, Center, Subwoofer, Surrounds" },
    { id: "7.1", label: "7.1 Immersive", desc: "Adds Rear Surround satellites" },
    { id: "5.1.2", label: "5.1.2 Atmos", desc: "Adds downward ceiling acoustic modules" },
  ];

  return (
    <div className="space-y-6">
      {/* 2D / 3D Dual View Toggle & Camera Presets Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* View Switcher */}
        <div className="flex bg-[#141414] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveView("3d")}
            className={`px-4 py-2 rounded-lg font-label-caps text-xs tracking-widest font-semibold transition-all cursor-pointer ${
              activeView === "3d"
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            3D STUDIO
          </button>
          <button
            onClick={() => setActiveView("2d")}
            className={`px-4 py-2 rounded-lg font-label-caps text-xs tracking-widest font-semibold transition-all cursor-pointer ${
              activeView === "2d"
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            2D BLUEPRINT
          </button>
        </div>

        {/* Camera Presets (Only applicable in 3D mode) */}
        {activeView === "3d" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-label-caps tracking-widest text-on-surface-variant/60 uppercase mr-1">
              Camera:
            </span>
            {[
              { id: "overview", label: "Overview" },
              { id: "front", label: "Front" },
              { id: "listening", label: "Sweet Spot" },
              { id: "system", label: "Hardware" },
              { id: "reset", label: "Reset" },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => onCameraPreset?.(preset.id)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 text-[10px] font-label-caps tracking-wider text-on-surface hover:text-white transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. ROOM DIMENSIONS & UNIT */}
      <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-5">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-primary" />
            <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
              Room Dimensions
            </h3>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#151515] p-0.5 rounded-lg border border-white/10 text-xs font-mono font-semibold">
            <button
              onClick={() => handleUnitToggle("FT")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                isFeet ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-white"
              }`}
            >
              FT
            </button>
            <button
              onClick={() => handleUnitToggle("METERS")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                !isFeet ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-white"
              }`}
            >
              M
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Length */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-on-surface-variant">Length</span>
              <span className="text-primary font-bold">
                {dimensions.length} {dimensions.unit}
              </span>
            </div>
            <input
              type="range"
              min={isFeet ? 12 : 3.5}
              max={isFeet ? 40 : 12.5}
              step={isFeet ? 1 : 0.5}
              value={dimensions.length}
              onChange={(e) => handleDimensionChange("length", e.target.value)}
              className="w-full accent-primary bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Width */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-on-surface-variant">Width</span>
              <span className="text-primary font-bold">
                {dimensions.width} {dimensions.unit}
              </span>
            </div>
            <input
              type="range"
              min={isFeet ? 10 : 3.0}
              max={isFeet ? 32 : 10.0}
              step={isFeet ? 1 : 0.5}
              value={dimensions.width}
              onChange={(e) => handleDimensionChange("width", e.target.value)}
              className="w-full accent-primary bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-on-surface-variant">Height (Ceiling)</span>
              <span className="text-primary font-bold">
                {dimensions.height} {dimensions.unit}
              </span>
            </div>
            <input
              type="range"
              min={isFeet ? 8 : 2.4}
              max={isFeet ? 16 : 5.0}
              step={isFeet ? 0.5 : 0.2}
              value={dimensions.height}
              onChange={(e) => handleDimensionChange("height", e.target.value)}
              className="w-full accent-primary bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. ROOM TYPE SELECTOR */}
      <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
            Room Type
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {roomTypes.map((type) => {
            const isSelected = roomType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setRoomType(type.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 text-on-surface-variant"
                }`}
              >
                <div>
                  <h4
                    className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                      isSelected ? "text-primary" : "text-white"
                    }`}
                  >
                    {type.label}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/75 font-light leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. AUDIO SETUP SELECTION */}
      <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Volume2 className="w-4 h-4 text-primary" />
          <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
            Audio Configuration
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {audioSetups.map((setup) => {
            const isSelected = audioSetup === setup.id;
            return (
              <button
                key={setup.id}
                onClick={() => setAudioSetup(setup.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 text-on-surface-variant"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold block mb-1 ${
                    isSelected ? "text-primary" : "text-white"
                  }`}
                >
                  {setup.label}
                </span>
                <span className="text-[10px] text-on-surface-variant/70 font-light leading-tight">
                  {setup.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DESIGN ACTIONS: SAVE / LOAD / RESET */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDesign}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary font-label-caps text-xs tracking-widest uppercase font-semibold text-white transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-primary" /> Save Design
          </button>
          <button
            onClick={onLoadDesign}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary font-label-caps text-xs tracking-widest uppercase font-semibold text-white transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-primary" /> Load Design
          </button>
        </div>

        <button
          onClick={onResetDesign}
          className="flex items-center gap-2 text-on-surface-variant/70 hover:text-error font-label-caps text-xs tracking-widest uppercase transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}
