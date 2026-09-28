"use client";

import React, { useState } from "react";
import { useAuraConcierge } from "@/context/AuraConciergeContext";

/**
 * Four-point diamond sparkle SVG icon — the AURA emblem.
 * Matches the luxury reference: a clean four-point star with warm gold fill.
 */
function AuraSparkleIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C12 2 13.5 8.5 12 12C10.5 8.5 12 2 12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 22C12 22 10.5 15.5 12 12C13.5 15.5 12 22 12 22Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M2 12C2 12 8.5 10.5 12 12C8.5 13.5 2 12 2 12Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M22 12C22 12 15.5 13.5 12 12C15.5 10.5 22 12 22 12Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Diagonal subtle rays */}
      <path
        d="M5 5C5 5 9.5 9 12 12C9 9.5 5 5 5 5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M19 5C19 5 14.5 9 12 12C15 9.5 19 5 19 5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M5 19C5 19 9.5 15 12 12C9 14.5 5 19 5 19Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M19 19C19 19 14.5 15 12 12C15 14.5 19 19 19 19Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

export default function AuraFloatingTrigger() {
  const { isOpen, toggleConcierge, hasContextAlert, activeContext } = useAuraConcierge();
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) return null;

  // Context label for tooltip
  const getContextHint = () => {
    if (activeContext.pathname?.startsWith("/product/")) return "Product Consultation";
    if (activeContext.pathname === "/design-your-room") return "3D Room Advisor";
    if (activeContext.pathname === "/speakers") return "Loudspeaker Curation";
    if (activeContext.pathname === "/book-demo") return "Showroom Concierge";
    return "Your audio concierge";
  };

  return (
    <div
      className="fixed bottom-5 right-4 md:bottom-7 md:right-7 z-40 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Tooltip — elegant minimal pill */}
      <div
        className="absolute bottom-full right-0 mb-3 flex items-center gap-2.5 pointer-events-none transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(6px)",
        }}
      >
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111111]/95 border border-[#f2ca50]/20 backdrop-blur-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase whitespace-nowrap"
              style={{ fontFamily: "var(--font-label-caps)" }}
            >
              Ask AURA
            </span>
            <span className="text-[9px] tracking-wider text-[#f2ca50]/60 uppercase whitespace-nowrap"
              style={{ fontFamily: "var(--font-label-caps)" }}
            >
              {getContextHint()}
            </span>
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#f2ca50]/50 shrink-0">
            <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ─── Main Circular Button ─── */}
      <button
        onClick={toggleConcierge}
        aria-label="Open AURA Audio Concierge"
        className="aura-trigger-btn relative cursor-pointer group"
        style={{
          width: "64px",
          height: "64px",
        }}
      >
        {/* Outermost orbit ring — very subtle decorative */}
        <div
          className="absolute inset-[-4px] rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            border: "1px solid rgba(242, 202, 80, 0.08)",
            opacity: isHovered ? 1 : 0.5,
          }}
        />

        {/* Gold metallic ring border */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 pointer-events-none"
          style={{
            background: `conic-gradient(
              from 0deg,
              rgba(242, 202, 80, 0.45) 0deg,
              rgba(212, 175, 55, 0.7) 60deg,
              rgba(242, 202, 80, 0.3) 120deg,
              rgba(212, 175, 55, 0.65) 180deg,
              rgba(242, 202, 80, 0.35) 240deg,
              rgba(212, 175, 55, 0.6) 300deg,
              rgba(242, 202, 80, 0.45) 360deg
            )`,
            padding: "2px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: isHovered ? 1 : 0.7,
          }}
        />

        {/* Inner obsidian glass surface */}
        <div
          className="absolute inset-[2px] rounded-full overflow-hidden transition-all duration-500"
          style={{
            background: `radial-gradient(
              ellipse at 40% 35%,
              rgba(35, 35, 35, 1) 0%,
              rgba(18, 18, 18, 1) 50%,
              rgba(10, 10, 10, 1) 100%
            )`,
            boxShadow: isHovered
              ? "inset 0 1px 6px rgba(242, 202, 80, 0.08), 0 6px 30px -6px rgba(0,0,0,0.9), 0 0 20px rgba(242, 202, 80, 0.12)"
              : "inset 0 1px 4px rgba(255,255,255,0.04), 0 4px 20px -4px rgba(0,0,0,0.8), 0 0 12px rgba(242, 202, 80, 0.05)",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
          }}
        >
          {/* Subtle glass highlight — top-left arc */}
          <div
            className="absolute top-[3px] left-[6px] right-[6px] h-[40%] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Four-point AURA sparkle icon */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500"
          style={{
            transform: isHovered ? "scale(1.04)" : "scale(1)",
          }}
        >
          <AuraSparkleIcon
            className="w-[22px] h-[22px] transition-all duration-500"
            style={{
              color: isHovered ? "#f2ca50" : "rgba(242, 202, 80, 0.75)",
              filter: isHovered
                ? "drop-shadow(0 0 6px rgba(242, 202, 80, 0.4))"
                : "drop-shadow(0 0 3px rgba(242, 202, 80, 0.15))",
            }}
          />
          {/* AURA text below star */}
          <span
            className="mt-[2px] text-[7.5px] tracking-[0.3em] font-semibold uppercase transition-colors duration-500"
            style={{
              fontFamily: "var(--font-label-caps)",
              color: isHovered ? "rgba(242, 202, 80, 0.85)" : "rgba(242, 202, 80, 0.5)",
            }}
          >
            AURA
          </span>
        </div>

        {/* Subtle breathing outer glow (animation via CSS) */}
        <div
          className="absolute inset-[-6px] rounded-full pointer-events-none aura-breathing-glow"
          style={{
            background: "radial-gradient(circle, rgba(242, 202, 80, 0.06) 0%, transparent 70%)",
          }}
        />

        {/* Context alert ping dot */}
        {hasContextAlert && (
          <span
            className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#f2ca50] animate-ping pointer-events-none"
            style={{ boxShadow: "0 0 6px rgba(242, 202, 80, 0.6)" }}
          />
        )}
      </button>

      {/* ─── Mobile: smaller sizing ─── */}
      <style jsx>{`
        @media (max-width: 768px) {
          .aura-trigger-btn {
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>
    </div>
  );
}
