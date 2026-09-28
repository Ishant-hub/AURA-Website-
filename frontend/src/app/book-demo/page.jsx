"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    showroom: "milan",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-populate message or showroom from referral queries (AURA AI or 3D Room Configurator)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prefillMessage = params.get("message");
      const prefillProduct = params.get("product");
      const prefillShowroom = params.get("showroom");

      if (prefillMessage) {
        setFormData((prev) => ({ ...prev, message: prefillMessage }));
      } else if (prefillProduct) {
        setFormData((prev) => ({
          ...prev,
          message: `I would like to arrange a private listening session to audition the ${prefillProduct}.`,
        }));
      }

      if (prefillShowroom) {
        setFormData((prev) => ({ ...prev, showroom: prefillShowroom.toLowerCase() }));
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setErrorMsg(data.message || "Failed to submit booking request. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="mt-32 px-4 md:px-margin-desktop max-w-2xl mx-auto min-h-[60vh] pb-24 text-center flex flex-col items-center justify-center">
        <CheckCircle2 className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-4 animate-[fadeIn_0.5s_ease-out]">
          Reservation Requested
        </h1>
        <p className="font-body-md text-on-surface-variant/80 max-w-md mx-auto mb-12 font-light leading-relaxed">
          Thank you, {formData.name}. Our concierge in the {formData.showroom.toUpperCase()} showroom will review your request and call you within 2 hours to confirm your private booking.
        </p>
        <a
          href="/"
          className="bg-primary text-on-primary px-12 py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
        >
          RETURN TO HOME
        </a>
      </main>
    );
  }

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-3xl mx-auto min-h-screen pb-24">
      {/* Header */}
      <header className="mb-12 text-center">
        <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-3 uppercase">
          AURA CONCIERGE
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl text-white font-extralight tracking-tight mb-4">
          Bespoke Showroom Booking
        </h1>
        <p className="font-body-md text-on-surface-variant/75 max-w-lg mx-auto font-light leading-relaxed">
          Request an exclusive listing session to feel the raw, unfiltered presence of the Aura audio ecosystem in our acoustic spaces.
        </p>
      </header>

      {/* Form */}
      <div className="glass-panel p-8 md:p-12 rounded-2xl border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                placeholder="Lord Byron"
              />
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                placeholder="byron@luxe.com"
              />
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                placeholder="+39 02 1234567"
              />
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                PREFERRED SHOWROOM
              </label>
              <select
                name="showroom"
                value={formData.showroom}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary focus:outline-none transition-colors text-white text-sm"
              >
                <option value="milan">Milan, Italy</option>
                <option value="munich">Munich, Germany</option>
                <option value="new-york">New York, USA</option>
                <option value="london">London, UK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
              INTERESTS & BESPOKE REQUESTS
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary focus:outline-none transition-colors text-white text-sm resize-none"
              placeholder="I am interested in experiencing the Acoustic Pillar X1 paired with the Vacuum Master Amp..."
            />
          </div>

          {errorMsg && (
            <p className="text-error text-xs font-label-caps tracking-widest uppercase font-semibold">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isSubmitting ? "TRANSMITTING..." : "SUBMIT RESERVATION REQUEST"}
          </button>
        </form>
      </div>
    </main>
  );
}
