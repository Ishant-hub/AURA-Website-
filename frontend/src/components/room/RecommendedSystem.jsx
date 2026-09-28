"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Calendar, Sparkles, Check, ExternalLink } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuraConcierge } from "@/context/AuraConciergeContext";
import { get4KImageUrl } from "@/lib/utils";

export default function RecommendedSystem({ dimensions, roomType, audioSetup }) {
  const { addToCart } = useCart();
  const { openConcierge } = useAuraConcierge();
  const router = useRouter();
  const [addedAll, setAddedAll] = useState(false);

  // Dynamic system curation based on room setup and room type
  const isCinema = roomType === "home-cinema";

  const mainSpeaker = isCinema
    ? {
        id: "eclipse-x1",
        name: "Eclipse X1 (Pair)",
        role: "Main Front Loudspeakers",
        price: 12999.0,
        slug: "eclipse-x1",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0",
      }
    : {
        id: "aether-mono-s1",
        name: "Aether Mono S1 (Pair)",
        role: "Reference Loudspeakers",
        price: 12400.0,
        slug: "aether-mono-s1",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0",
      };

  const amplifier = isCinema
    ? {
        id: "flux-reference-a2",
        name: "Flux Reference A2",
        role: "High-Power Tube Amplification (150W)",
        price: 8950.0,
        slug: "flux-reference-a2",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDzPLeL_fNkS4MHyjESaApTR8NZmokCUQZxNBhmCqGx77-rdCXm0p1r1juCmXIfHxrnDCRpzQZZ3xJJsvVRPKMQuNo1dav5A24L0QPPbsbNRDLRV8r9pqBdb8a3k6aNaERiFpCN7Cea40SEc5likqo2z5MmkB53Z9eQ_msu34GpfW8-9lC0MqZjGeJ5A5QkfiPEMYp2lp2YqfgrGvuwRSoAQ4Ai6THt3XpoO1f6OjPcTo1e64QhaT8BHNnJg2Tcd2PYrgjuV_wdTpo=s0",
      }
    : {
        id: "vacuum-master-amp",
        name: "Vacuum Master Amp",
        role: "Pure Class-A Tube Amplification",
        price: 8200.0,
        slug: "vacuum-master-amp",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tusR3YOw6Ym-te8NuXKRCCPvd5cxhaVrp1Z2WjpDCNaEypGRE1uVZURzcUDIQvymSPIT986ywZ1XIoOcq68zbp7awuk9CB9tqQ6Pl3e311Ys7A8x4C8uCMvVuaKrwWxKGqQ0HKobSW8ZIrS0QtnOy6cc_LDyXdOZFJEUFAaHE7MiRtFvvi4kvARSNidt-ojB2xF7yLYMZjI1KKV_yMD-WRg34VZx6yg07K69hVwP15mC6ZzCAbLw_7N6Je80J5EDgzt1lXE0FyA=s0",
      };

  const sourceItem = isCinema
    ? {
        id: "command-core",
        name: "Command Core",
        role: "Acoustic Ecosystem Controller",
        price: 1150.0,
        slug: "command-core",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBfiBlharM4IBX3TWZ6oeeoWpRoRe9dV5rG2r6EWY8IwKdAjWkk38LeBM8LeRvE0C4qcNzflSvWHOnJ_VjAnyAreNyfgWN-vbPi2EpDK_tsMf9bwVb6iQWK8URdmQjZ9hk3AGNHq5gLCsN0sXbcHM5BDtV9D9v5AlcNFdNWCRs3kZKdFoHmnARBxgMocV26sZ89QcPM-bRtJ46xf-TTbked_ur0pu7relej2f4VrAte8CRiUUQPBzWucdYuW3mTMnzn_H6hViXISV4=s0",
      }
    : {
        id: "orbit-v3-platter",
        name: "Orbit V3 Platter",
        role: "Magnetic Levitation Turntable",
        price: 6200.0,
        slug: "orbit-v3-platter",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA3EWlC44YeWj3fLTTVEnkqsTdJl9ESnKucTzO83D9T0-5gNNeiff2TJOouPnPTws8BWeaSIyfq8fJqebPt6yGtcq7pYaisdMWjQAoISBv0_C_lBSKW5rZT6eJ0jleX0uXc_og_ultV5giONoJOvmNI8HaTYKRafPggimVsm3Ir8ywIn0wy97A0KT8w_2aFJ0nXuoJRROrfqCzM_Pwr83KPcn9YCepwZX9hyni29ttPC0S8PPbFhjC_d7sFnUqGNrSwFuH0NDZwvs8=s0",
      };

  const curatedComponents = [mainSpeaker, amplifier, sourceItem];

  if (audioSetup !== "2.0") {
    curatedComponents.push({
      id: "monolith-reference",
      name: "Monolith Reference Subwoofer",
      role: "Seismic Active Subwoofer",
      price: 8900.0,
      slug: "eclipse-x1",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI=s0",
    });
  }

  const totalEstimate = curatedComponents.reduce((acc, curr) => acc + curr.price, 0);

  const handleAddAllToCart = () => {
    curatedComponents.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        slug: item.slug,
        image: item.imageUrl,
      });
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const handleBookDemoForSetup = () => {
    const message = encodeURIComponent(
      `[3D ROOM CONFIGURATION] I would like to audition the recommended system for a ${dimensions.length}x${dimensions.width}x${dimensions.height} ${dimensions.unit} ${roomType.replace("-", " ").toUpperCase()} with a ${audioSetup} setup (Total: $${totalEstimate.toLocaleString()}).`
    );
    router.push(`/book-demo?message=${message}`);
  };

  const handleAskAura = () => {
    openConcierge(
      `I am designing a ${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit} ${roomType.replace("-", " ")} with a ${audioSetup} audio setup. Can you review this configuration and advise on amplifier synergy and acoustic treatment?`
    );
  };

  return (
    <div className="glass-panel p-8 md:p-10 rounded-3xl border-white/5 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-2 uppercase">
            CURATED HARDWARE SYNERGY
          </span>
          <h2 className="font-display-lg text-2xl md:text-3xl text-white font-extralight tracking-tight">
            YOUR AURA SYSTEM
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant/75 font-light mt-1">
            Engineered specifically to pressurize your {dimensions.length} × {dimensions.width} {dimensions.unit} room.
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-[10px] font-label-caps tracking-widest text-on-surface-variant/60 block uppercase">
            Estimated Total
          </span>
          <span className="font-body-lg text-2xl md:text-3xl text-primary font-light">
            ${totalEstimate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {curatedComponents.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-primary/40 transition-all duration-300"
          >
            <div>
              <div className="w-full aspect-video rounded-xl bg-white/5 p-4 mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={get4KImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-[9px] font-label-caps text-primary tracking-widest uppercase font-semibold block mb-1">
                {item.role}
              </span>
              <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors mb-1">
                {item.name}
              </h4>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
              <span className="text-xs font-mono text-white/90">
                ${item.price.toLocaleString()}
              </span>
              <Link
                href={`/product/${item.slug}`}
                className="text-[10px] font-label-caps text-primary hover:text-white uppercase tracking-wider flex items-center gap-1 font-semibold"
              >
                Details <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Add All to Cart */}
        <button
          onClick={handleAddAllToCart}
          className="py-4 px-6 rounded-xl bg-primary text-on-primary font-label-caps text-xs tracking-widest font-bold uppercase hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {addedAll ? (
            <>
              <Check className="w-4 h-4" /> ALL ITEMS ADDED
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> ADD ENTIRE SETUP TO CART
            </>
          )}
        </button>

        {/* Book Demo for Setup */}
        <button
          onClick={handleBookDemoForSetup}
          className="py-4 px-6 rounded-xl glass-card border border-white/10 hover:border-primary text-white font-label-caps text-xs tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-primary" /> BOOK SHOWROOM AUDITION
        </button>

        {/* Ask AURA About This Room */}
        <button
          onClick={handleAskAura}
          className="py-4 px-6 rounded-xl glass-panel border border-primary/30 hover:border-primary text-primary hover:bg-primary/5 font-label-caps text-xs tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-primary font-bold">✦</span> ASK AURA ABOUT THIS ROOM
        </button>
      </div>
    </div>
  );
}
