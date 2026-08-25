"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-xl mx-auto min-h-[70vh] pb-24 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full border border-error/30 flex items-center justify-center text-error bg-error/5 mb-8 shadow-inner animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>
      
      <span className="font-label-caps text-xs text-error tracking-[0.4em] font-bold block mb-4 uppercase">
        SECURED FIREWALL
      </span>
      
      <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-6">
        Access Denied
      </h1>
      
      <p className="font-body-md text-on-surface-variant/80 max-w-md mx-auto mb-12 font-light leading-relaxed">
        The requested system registry or administrative interface requires specialized credentials. Your current access level is insufficient.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link
          href="/"
          className="bg-white text-background px-8 py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Gallery
        </Link>
        <Link
          href="/login"
          className="glass-card border border-white/10 text-white px-8 py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:border-primary transition-all flex items-center justify-center uppercase"
        >
          Authenticate Profile
        </Link>
      </div>
    </main>
  );
}
