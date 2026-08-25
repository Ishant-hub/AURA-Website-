"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { get4KImageUrl } from "@/lib/utils";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const { requireAuth, user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedFinish, setSelectedFinish] = useState("matte-black");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Parse specifications JSON
  let specsObj = {};
  try {
    specsObj = JSON.parse(product.specs);
  } catch (e) {
    console.error("Failed to parse product specifications", e);
  }

  const imageUrl = product.images?.[0]?.url || "/placeholder.jpg";

  // Post-login action redirect handler
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add-to-cart" && user) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        image: imageUrl,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      // Remove the action parameters from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, user, product, imageUrl, addToCart]);

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!requireAuth(undefined, "add-to-cart")) {
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-container-max mx-auto min-h-screen pb-24">
      {/* Back button */}
      <Link
        href={`/${product.slug === "eclipse-x1" || product.slug === "aether-mono-s1" || product.slug === "sonus-pro-h1" || product.slug === "pulse-monitor-r4" ? "speakers" : "amplifiers"}`}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-xs tracking-widest uppercase mb-12"
      >
        <ArrowLeft className="w-4 h-4" /> Back to curations
      </Link>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Left Side: Premium Image Canvas */}
        <div className="flex-1">
          <div className="glass-panel p-10 aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden group">
            {/* Soft decorative background glow */}
            <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <img
              src={get4KImageUrl(imageUrl)}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Interactive Panel */}
        <div className="w-full lg:w-[500px] flex flex-col justify-between">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold mb-2 uppercase">
                {product.brand} Luxe
              </p>
              <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="font-body-lg text-2xl text-primary font-light">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Description */}
            <p className="font-body-md text-sm text-on-surface-variant/80 font-light leading-relaxed">
              {product.description}
            </p>

            <div className="w-full h-[1px] bg-white/5"></div>

            {/* Configurator / Finish */}
            <div>
              <h4 className="font-label-caps text-xs text-primary tracking-widest font-semibold mb-4 uppercase">
                SELECT CUSTOM FINISH
              </h4>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedFinish("matte-black")}
                  className={`flex-1 glass-panel py-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    selectedFinish === "matte-black"
                      ? "border-primary text-primary"
                      : "border-white/10 text-on-surface-variant opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#131313] border border-white/20"></div>
                  MATTE BLACK
                </button>
                <button
                  onClick={() => setSelectedFinish("gold-glint")}
                  className={`flex-1 glass-panel py-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    selectedFinish === "gold-glint"
                      ? "border-primary text-primary"
                      : "border-white/10 text-on-surface-variant opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E9C349] border border-white/20"></div>
                  AURA GOLD
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.isOutOfStock || product.stock === 0}
                className="w-full bg-primary text-on-primary py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> ADDED TO CURATION
                  </>
                ) : product.isOutOfStock || product.stock === 0 ? (
                  "OUT OF STOCK"
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD TO CURATION
                  </>
                )}
              </button>
              <Link
                href="/book-demo"
                className="w-full glass-card border border-white/10 py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold text-center block text-white hover:border-primary transition-all duration-300"
              >
                SCHEDULE PRIVATE LISTENING
              </Link>
            </div>
          </div>

          {/* Specifications Drawer */}
          {Object.keys(specsObj).length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="font-label-caps text-xs text-primary tracking-widest font-semibold mb-6 uppercase">
                Technical Specifications
              </h4>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-light">
                {Object.entries(specsObj).map(([key, val]) => (
                  <div key={key} className="border-b border-white/5 pb-2">
                    <dt className="text-on-surface-variant/50 uppercase tracking-wider mb-1 font-semibold">
                      {key}
                    </dt>
                    <dd className="text-white">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
