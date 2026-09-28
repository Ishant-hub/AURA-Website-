"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  RotateCcw,
  ArrowUp,
  ShoppingBag,
  ExternalLink,
  Box,
  Check,
} from "lucide-react";
import { useAuraConcierge } from "@/context/AuraConciergeContext";
import { useCart } from "@/context/CartContext";
import { get4KImageUrl } from "@/lib/utils";

/**
 * Miniature four-point sparkle used inline.
 */
function AuraMiniSparkle({ size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C12 2 13.5 8.5 12 12C10.5 8.5 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 22C12 22 10.5 15.5 12 12C13.5 15.5 12 22 12 22Z"
        fill="currentColor"
      />
      <path
        d="M2 12C2 12 8.5 10.5 12 12C8.5 13.5 2 12 2 12Z"
        fill="currentColor"
      />
      <path
        d="M22 12C22 12 15.5 13.5 12 12C15.5 10.5 22 12 22 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AuraConciergeModal() {
  const {
    isOpen,
    closeConcierge,
    messages,
    isTyping,
    sendMessage,
    resetConversation,
    activeContext,
  } = useAuraConcierge();

  const { addToCart } = useCart();
  const router = useRouter();

  const [inputVal, setInputVal] = useState("");
  const [addedIds, setAddedIds] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal.trim();
    setInputVal("");
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.imageUrl,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddBundleToCart = (bundle) => {
    bundle.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        slug: item.slug,
        image: item.imageUrl,
      });
    });
    setAddedIds((prev) => ({ ...prev, [bundle.title]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [bundle.title]: false }));
    }, 2500);
  };

  // Helper to format plain text with markdown bold & lists
  const renderFormattedText = (text) => {
    if (!text) return null;
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      const lines = para.split("\n");
      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed font-light text-[13px] text-[#d5d0c8]">
          {lines.map((line, lIdx) => {
            // Process bold formatting **bold**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <span key={lIdx} className="block last:inline">
                {parts.map((part, idx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={idx} className="font-semibold text-white">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <aside
      aria-label="AURA Audio Concierge"
      className="fixed inset-x-0 bottom-0 md:inset-x-auto md:bottom-7 md:right-7 z-50 w-full md:w-[420px] h-[88vh] md:h-[640px] md:max-h-[86vh] flex flex-col overflow-hidden md:rounded-2xl rounded-t-2xl"
      style={{
        background: "linear-gradient(180deg, rgba(16, 16, 16, 0.97) 0%, rgba(10, 10, 10, 0.98) 100%)",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(242, 202, 80, 0.1)",
        boxShadow: "0 25px 60px -12px rgba(0,0,0,0.95), 0 0 30px rgba(242, 202, 80, 0.06)",
        animation: "auraSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      }}
    >
      {/* Decorative top gold hairline */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(242, 202, 80, 0.35) 50%, transparent 95%)",
        }}
      />

      {/* ─── Header ─── */}
      <header
        className="px-5 py-3.5 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          {/* AURA emblem */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "radial-gradient(circle at 40% 35%, #1e1e1e, #0e0e0e)",
              border: "1px solid rgba(242, 202, 80, 0.3)",
              boxShadow: "0 0 10px rgba(242, 202, 80, 0.08)",
            }}
          >
            <AuraMiniSparkle size={14} className="text-[#f2ca50]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-[13px] tracking-[0.25em] text-white font-semibold uppercase"
                style={{ fontFamily: "var(--font-display-lg)" }}
              >
                AURA
              </h2>
              <span
                className="text-[9px] tracking-[0.15em] text-[#f2ca50]/50 uppercase font-medium"
                style={{ fontFamily: "var(--font-label-caps)" }}
              >
                Concierge
              </span>
            </div>
            <p className="text-[10px] text-[#d0c5af]/50 font-light truncate max-w-[200px]">
              {activeContext.currentProduct
                ? `Advising on ${activeContext.currentProduct.name}`
                : activeContext.pathname === "/design-your-room"
                ? "3D Room Configurator"
                : "Personal audio consultant"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={resetConversation}
            title="Reset Conversation"
            className="p-2 text-white/30 hover:text-[#f2ca50] transition-colors rounded-lg hover:bg-white/[0.03] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closeConcierge}
            title="Close"
            className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/[0.03] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ─── Message Feed ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 aura-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            {/* Sender + timestamp */}
            <div className="flex items-center gap-2 mb-1 px-0.5">
              <span
                className="text-[9px] tracking-[0.15em] uppercase font-medium"
                style={{
                  fontFamily: "var(--font-label-caps)",
                  color: msg.role === "user" ? "rgba(255,255,255,0.35)" : "rgba(242, 202, 80, 0.45)",
                }}
              >
                {msg.role === "user" ? "You" : "✦ AURA"}
              </span>
              <span className="text-[8px] text-white/20 font-mono">
                {msg.timestamp}
              </span>
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-xl max-w-[90%] transition-all ${
                msg.role === "user"
                  ? "rounded-tr-sm"
                  : "rounded-tl-sm"
              }`}
              style={{
                background: msg.role === "user"
                  ? "rgba(242, 202, 80, 0.07)"
                  : "rgba(255, 255, 255, 0.025)",
                border: msg.role === "user"
                  ? "1px solid rgba(242, 202, 80, 0.2)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: msg.role === "user"
                  ? "none"
                  : "0 2px 12px -4px rgba(0,0,0,0.5)",
              }}
            >
              {renderFormattedText(msg.content)}

              {/* Product Card Embed */}
              {msg.type === "product_card" && msg.product && (
                <div
                  className="mt-3 pt-3 rounded-lg p-3"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex gap-3 items-center mb-3">
                    <div className="w-14 h-14 rounded-lg bg-white/5 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={get4KImageUrl(msg.product.imageUrl)}
                        alt={msg.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[8px] tracking-[0.15em] text-[#f2ca50] font-semibold uppercase block"
                        style={{ fontFamily: "var(--font-label-caps)" }}
                      >
                        {msg.product.category}
                      </span>
                      <h4 className="text-[13px] font-medium text-white truncate">
                        {msg.product.name}
                      </h4>
                      <p className="text-xs text-[#f2ca50] font-mono font-semibold">
                        ${msg.product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 text-[9px] tracking-[0.12em] uppercase font-semibold"
                    style={{ fontFamily: "var(--font-label-caps)" }}
                  >
                    <Link
                      href={`/product/${msg.product.slug}`}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.04] border border-white/8 hover:border-[#f2ca50]/40 text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-[#f2ca50]" /> View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(msg.product)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#f2ca50] text-[#1a1500] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {addedIds[msg.product.id] ? (
                        <>
                          <Check className="w-3 h-3" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Product Comparison Embed */}
              {msg.type === "product_comparison" && msg.comparison && (
                <div
                  className="mt-3 pt-3 rounded-lg p-3 space-y-2.5"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {/* Item 1 */}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col justify-between">
                      <div>
                        <span
                          className="text-[8px] text-[#f2ca50] uppercase font-bold block mb-1"
                          style={{ fontFamily: "var(--font-label-caps)" }}
                        >
                          Option A
                        </span>
                        <h5 className="font-semibold text-white mb-1 text-[12px]">
                          {msg.comparison.item1.name}
                        </h5>
                        <p className="text-xs text-[#f2ca50] font-mono mb-2">
                          ${msg.comparison.item1.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#d0c5af]/60 font-light leading-relaxed">
                          {msg.comparison.item1.soundProfile}
                        </p>
                      </div>
                      <Link
                        href={`/product/${msg.comparison.item1.slug}`}
                        className="mt-2 text-[9px] tracking-wider text-[#f2ca50] hover:underline flex items-center gap-1"
                        style={{ fontFamily: "var(--font-label-caps)" }}
                      >
                        Inspect <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col justify-between">
                      <div>
                        <span
                          className="text-[8px] text-[#f2ca50] uppercase font-bold block mb-1"
                          style={{ fontFamily: "var(--font-label-caps)" }}
                        >
                          Option B
                        </span>
                        <h5 className="font-semibold text-white mb-1 text-[12px]">
                          {msg.comparison.item2.name}
                        </h5>
                        <p className="text-xs text-[#f2ca50] font-mono mb-2">
                          ${msg.comparison.item2.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#d0c5af]/60 font-light leading-relaxed">
                          {msg.comparison.item2.soundProfile}
                        </p>
                      </div>
                      <Link
                        href={`/product/${msg.comparison.item2.slug}`}
                        className="mt-2 text-[9px] tracking-wider text-[#f2ca50] hover:underline flex items-center gap-1"
                        style={{ fontFamily: "var(--font-label-caps)" }}
                      >
                        Inspect <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div
                    className="p-2.5 rounded-lg text-xs"
                    style={{
                      background: "rgba(242, 202, 80, 0.04)",
                      border: "1px solid rgba(242, 202, 80, 0.12)",
                    }}
                  >
                    <p
                      className="text-[9px] text-[#f2ca50] uppercase font-bold tracking-wider mb-1"
                      style={{ fontFamily: "var(--font-label-caps)" }}
                    >
                      AURA Verdict
                    </p>
                    <p className="text-[10px] text-[#d0c5af]/75 font-light leading-relaxed">
                      {msg.comparison.verdict}
                    </p>
                  </div>
                </div>
              )}

              {/* Recommendation Bundle Embed */}
              {msg.type === "recommendation_bundle" && msg.bundle && (
                <div
                  className="mt-3 pt-3 rounded-lg p-3 space-y-2.5"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <h5 className="text-xs font-semibold text-white tracking-wide">
                      {msg.bundle.title}
                    </h5>
                    <span className="text-xs text-[#f2ca50] font-mono font-bold">
                      ${msg.bundle.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Itemized List */}
                  <div className="space-y-1.5">
                    {msg.bundle.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/[0.02]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <AuraMiniSparkle size={8} className="text-[#f2ca50]/60 shrink-0" />
                          <span className="text-white truncate font-medium text-[11px]">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-white/30">
                            ({item.category})
                          </span>
                        </div>
                        <span className="text-[#f2ca50]/80 font-mono text-[10px] shrink-0 ml-2">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rationale */}
                  <p className="text-[10px] text-[#d0c5af]/60 font-light leading-relaxed italic">
                    {msg.bundle.rationale}
                  </p>

                  {/* Action Buttons */}
                  <div
                    className="grid grid-cols-2 gap-2 pt-1 text-[9px] tracking-[0.12em] uppercase font-bold"
                    style={{ fontFamily: "var(--font-label-caps)" }}
                  >
                    <button
                      onClick={() => handleAddBundleToCart(msg.bundle)}
                      className="py-2.5 px-3 rounded-lg bg-[#f2ca50] text-[#1a1500] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {addedIds[msg.bundle.title] ? (
                        <>
                          <Check className="w-3 h-3" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" /> Add Setup
                        </>
                      )}
                    </button>
                    <Link
                      href="/design-your-room"
                      className="py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/8 hover:border-[#f2ca50]/30 text-white transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      <Box className="w-3 h-3 text-[#f2ca50]" /> View in 3D
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Suggestion Chips */}
            {msg.quickActions && msg.quickActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                {msg.quickActions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(chip.prompt)}
                    className="text-[10px] px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#d0c5af",
                      fontFamily: "var(--font-body-md)",
                    }}
                  >
                    <AuraMiniSparkle size={9} className="text-[#f2ca50]/50" />
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2.5 text-white/40 text-xs px-1">
            <AuraMiniSparkle size={10} className="text-[#f2ca50]/60 animate-pulse" />
            <span className="font-light italic text-[11px]">
              AURA is analyzing acoustic parameters…
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Tray ─── */}
      <footer
        className="p-3.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AURA anything about sound, equipment, or your room…"
            className="flex-1 bg-white/[0.03] border border-white/8 focus:border-[#f2ca50]/40 rounded-xl px-3.5 py-2.5 text-white text-[13px] placeholder:text-white/25 focus:outline-none transition-colors"
            style={{ fontFamily: "var(--font-body-md)" }}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
            style={{
              background: "linear-gradient(135deg, #f2ca50, #d4af37)",
              color: "#1a1500",
              boxShadow: "0 2px 10px -2px rgba(242, 202, 80, 0.25)",
            }}
          >
            <ArrowUp className="w-4 h-4 font-bold" />
          </button>
        </form>
        <div className="flex justify-between items-center px-0.5 mt-1.5 text-[8px] text-white/20 font-mono">
          <span>Press Enter to send</span>
          <span>AURA Acoustic Engine v2.4</span>
        </div>
      </footer>
    </aside>
  );
}
