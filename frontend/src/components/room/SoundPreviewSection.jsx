"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Square, Volume2, Sparkles, SlidersHorizontal, Info } from "lucide-react";
import {
  calculateSoundCharacter,
  getRoomSoundPreviewEngine,
} from "@/lib/roomAudioPreview";

export default function SoundPreviewSection({
  dimensions,
  roomType,
  audioSetup,
  selectedSpeaker = "eclipse-x1",
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(7);
  const [hasChangedSincePlay, setHasChangedSincePlay] = useState(false);
  const prevConfigRef = useRef(null);

  // Calculate dynamic acoustic character profile
  const profile = useMemo(() => {
    return calculateSoundCharacter({
      dimensions,
      roomType,
      audioSetup,
      selectedSpeaker,
    });
  }, [dimensions, roomType, audioSetup, selectedSpeaker]);

  // Track changes to configuration
  useEffect(() => {
    const currentConfigStr = JSON.stringify({
      dimensions,
      roomType,
      audioSetup,
      selectedSpeaker,
    });

    if (prevConfigRef.current && prevConfigRef.current !== currentConfigStr) {
      setHasChangedSincePlay(true);
      // If audio is playing while config changed, stop gracefully
      const engine = getRoomSoundPreviewEngine();
      if (engine && engine.isPlaying) {
        engine.stop(false);
      }
    }
    prevConfigRef.current = currentConfigStr;
  }, [dimensions, roomType, audioSetup, selectedSpeaker]);

  // Clean up audio on component unmount
  useEffect(() => {
    const engine = getRoomSoundPreviewEngine();
    return () => {
      if (engine) {
        engine.stop(false);
      }
    };
  }, []);

  const handleTogglePreview = () => {
    const engine = getRoomSoundPreviewEngine();
    if (!engine) return;

    if (isPlaying) {
      engine.stop(false);
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setHasChangedSincePlay(false);
    setIsPlaying(true);
    setProgress(0);
    setRemainingTime(7);

    engine.onStateChange = (playing) => {
      setIsPlaying(playing);
      if (!playing) {
        setProgress(0);
      }
    };

    engine.onProgress = ({ progress: prog, remainingSeconds }) => {
      setProgress(prog);
      setRemainingTime(Math.ceil(remainingSeconds));
    };

    engine.play(profile, () => {
      setIsPlaying(false);
      setProgress(0);
    });
  };

  const metrics = [
    { label: "Warmness", value: profile.warmness },
    { label: "Bass", value: profile.bass },
    { label: "Clarity", value: profile.clarity },
    { label: "Soundstage", value: profile.soundstage },
  ];

  return (
    <div className="glass-panel p-6 md:p-7 rounded-2xl border-white/5 space-y-6 relative overflow-hidden bg-[#0c0b0a]/90 backdrop-blur-xl">
      {/* Subtle top champagne accent glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      {/* Header with Title and Update Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-label-caps tracking-[0.3em] text-primary font-bold uppercase">
              EXPERIENCE YOUR ROOM
            </span>
          </div>
          <h3 className="font-display-lg text-lg text-white font-light tracking-wide">
            Illustrative Sound Preview
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasChangedSincePlay && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-label-caps tracking-wider text-primary font-medium animate-pulse">
              <Sparkles className="w-3 h-3" />
              Preview updated
            </span>
          )}
          <span className="text-[10px] font-mono text-on-surface-variant/70 uppercase">
            {profile.sizeLabel}
          </span>
        </div>
      </div>

      {/* Main Interaction Area: Button & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Playback Controls Column */}
        <div className="md:col-span-5 space-y-3">
          <button
            onClick={handleTogglePreview}
            className={`w-full py-3.5 px-6 rounded-xl font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-3 transition-all cursor-pointer relative overflow-hidden ${
              isPlaying
                ? "bg-[#1f1b14] border border-primary text-primary shadow-lg shadow-primary/15"
                : "bg-primary text-on-primary hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20"
            }`}
          >
            {/* Live Progress Bar Fill */}
            {isPlaying && (
              <div
                className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-75 pointer-events-none"
                style={{ width: `${progress * 100}%` }}
              ></div>
            )}

            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-primary text-primary animate-pulse relative z-10" />
                <span className="relative z-10">Stop Preview ({remainingTime}s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current relative z-10" />
                <span className="relative z-10">Preview Sound</span>
              </>
            )}
          </button>

          {/* Descriptive caption */}
          <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant/75 font-light leading-relaxed">
            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p>
              An illustrative sound preview based on your room and system configuration. Automatically stops in 7 seconds.
            </p>
          </div>
        </div>

        {/* Current Sound Character Profile Meters */}
        <div className="md:col-span-7 space-y-3.5 bg-black/30 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-label-caps tracking-widest text-on-surface-variant/80 uppercase">
            <span>Current Sound Character</span>
            <span className="text-primary font-mono lowercase text-[10px]">
              {profile.roomScale} space • {audioSetup}
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-on-surface-variant/80 text-[11px]">
                    {metric.label}
                  </span>
                  <span className="text-primary font-semibold text-[11px]">
                    {metric.value}%
                  </span>
                </div>

                {/* Minimalist Champagne Gold & Graphite Slider Track */}
                <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-visible flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-300"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                  {/* Subtle thumb node */}
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full bg-primary border border-[#0c0b0a] shadow-sm shadow-primary/60 transition-all duration-300 -translate-x-1/2"
                    style={{ left: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Contextual Sonic Descriptor */}
          <p className="text-[11px] text-on-surface-variant/85 italic border-t border-white/5 pt-2 mt-2 leading-relaxed">
            &ldquo;{profile.descriptor}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
