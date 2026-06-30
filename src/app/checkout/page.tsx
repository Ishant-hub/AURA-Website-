"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Shield, Plus, Minus, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function Checkout() {
  const { cart, updateQuantity, removeFromCart, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart review, 2: Shipping/Payment info, 3: Completed
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    email: "",
  });

  // Prepopulate email and name if user is logged in
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCart = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode || !shippingInfo.phone || !shippingInfo.email) {
      setErrorMsg("Please fill out all shipping fields.");
      return;
    }

    if (paymentMethod === "credit-card" && (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv)) {
      setErrorMsg("Please fill out credit card details.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo,
          paymentMethod,
          cartItems: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCompletedOrderNumber(data.orderNumber);
        setCurrentStep(3);
        clearCart();
      } else {
        setErrorMsg(data.message || "Failed to process order. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentStep === 3) {
    return (
      <main className="mt-32 px-4 md:px-margin-desktop max-w-2xl mx-auto min-h-screen pb-24 text-center flex flex-col items-center justify-center">
        <CheckCircle className="w-20 h-20 text-primary mb-6 animate-bounce" />
        <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-4">
          Curation Confirmed
        </h1>
        <p className="font-body-lg text-lg text-primary mb-2">
          Order #{completedOrderNumber}
        </p>
        <p className="font-body-md text-on-surface-variant/80 max-w-md mx-auto mb-12 font-light leading-relaxed">
          An invitation to your private setup and delivery scheduling has been sent to {shippingInfo.email}. Our concierge will be in touch shortly.
        </p>
        <a
          href="/"
          className="bg-primary text-on-primary px-12 py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
        >
          RETURN TO GALLERY
        </a>
      </main>
    );
  }

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-container-max mx-auto min-h-screen pb-24">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => cart.length > 0 && setCurrentStep(1)}
          disabled={cart.length === 0}
          className={`font-label-caps text-xs tracking-widest font-bold pb-1 ${
            currentStep === 1 ? "text-primary border-b-2 border-primary" : "text-on-surface-variant/50 hover:text-on-surface-variant"
          }`}
        >
          01. SHOPPING CART
        </button>
        <div className="w-8 h-[1px] bg-white/10"></div>
        <div
          className={`font-label-caps text-xs tracking-widest font-bold pb-1 ${
            currentStep === 2 ? "text-primary border-b-2 border-primary" : "text-on-surface-variant/50"
          }`}
        >
          02. CHECKOUT
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Left Side: Interactive Canvas */}
        <div className="flex-1">
          {/* STEP 1: CART SUMMARY */}
          {currentStep === 1 && (
            <section className="step-transition">
              <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-12">
                Review Your Curation
              </h1>

              {cart.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                  <p className="text-on-surface-variant font-light text-lg mb-8">
                    Your luxury curation is currently empty.
                  </p>
                  <a
                    href="/speakers"
                    className="bg-primary text-on-primary px-12 py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold"
                  >
                    DISCOVER SPEAKERS
                  </a>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                      <div className="w-24 h-24 bg-white/5 glass-panel p-3 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-label-caps text-[10px] text-primary tracking-widest font-semibold uppercase mb-1">
                              AURA CORE SERIES
                            </p>
                            <h3 className="font-headline-md text-lg text-white font-normal">
                              {item.name}
                            </h3>
                          </div>
                          <p className="font-body-lg text-lg text-white font-light">
                            ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-white/10 rounded-lg p-1 bg-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-on-surface-variant hover:text-primary transition-colors p-1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-label-caps text-xs px-3 text-white">{String(item.quantity).padStart(2, "0")}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-on-surface-variant hover:text-primary transition-colors p-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-on-surface-variant/40 hover:text-error transition-colors flex items-center gap-1 text-[10px] font-label-caps tracking-widest uppercase font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="w-full h-[1px] bg-white/5 my-8"></div>
                  <div className="flex items-center gap-4 text-on-surface-variant/80">
                    <Shield className="w-5 h-5 text-primary" />
                    <p className="font-label-caps text-xs tracking-widest font-semibold">
                      White Glove Delivery & Tuning Included
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {currentStep === 2 && (
            <section className="step-transition">
              <h1 className="font-display-lg text-3xl md:text-4xl text-white font-extralight tracking-tight mb-12">
                Secured Checkout
              </h1>
              <form onSubmit={handleCompletePurchase} className="space-y-12">
                {/* Shipping Details */}
                <div>
                  <h2 className="font-label-caps text-xs text-primary tracking-widest font-bold mb-6 uppercase">
                    SHIPPING DESTINATION
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <input
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Full Name"
                        type="text"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Delivery Address"
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="City"
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Postal Code"
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Phone Number"
                        type="tel"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Email Address"
                        type="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div>
                  <h2 className="font-label-caps text-xs text-primary tracking-widest font-bold mb-6 uppercase">
                    PAYMENT METHOD
                  </h2>
                  <div className="flex gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit-card")}
                      className={`flex-1 glass-panel py-6 rounded-xl flex flex-col items-center gap-2 border transition-all ${
                        paymentMethod === "credit-card"
                          ? "border-primary text-primary"
                          : "border-white/10 text-on-surface-variant/60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">credit_card</span>
                      <span className="font-label-caps text-[9px] tracking-widest font-bold">CREDIT CARD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("apple-pay")}
                      className={`flex-1 glass-panel py-6 rounded-xl flex flex-col items-center gap-2 border transition-all ${
                        paymentMethod === "apple-pay"
                          ? "border-primary text-primary"
                          : "border-white/10 text-on-surface-variant/60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                      <span className="font-label-caps text-[9px] tracking-widest font-bold">APPLE PAY</span>
                    </button>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-6">
                      <input
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                        placeholder="Card Number"
                        type="text"
                        required
                      />
                      <div className="grid grid-cols-2 gap-6">
                        <input
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentChange}
                          className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                          placeholder="Expiry (MM/YY)"
                          type="text"
                          required
                        />
                        <input
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className="w-full bg-transparent border-b border-white/10 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-on-surface-variant/30 text-white"
                          placeholder="CVV"
                          type="password"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-error text-xs font-label-caps tracking-widest uppercase font-semibold">
                    {errorMsg}
                  </p>
                )}
              </form>
            </section>
          )}
        </div>

        {/* Right Side: Sticky Order Summary */}
        <aside className="w-full lg:w-[400px]">
          <div className="glass-panel p-8 md:p-10 rounded-2xl sticky top-32 space-y-8">
            <h2 className="font-label-caps text-xs text-on-surface-variant/60 border-b border-white/5 pb-4 tracking-widest font-bold uppercase">
              CURATION SUMMARY
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between font-body-md text-sm">
                <span className="text-on-surface-variant/80 font-light">Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-body-md text-sm">
                <span className="text-on-surface-variant/80 font-light">White Glove Shipping</span>
                <span className="text-primary font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between font-body-md text-sm">
                <span className="text-on-surface-variant/80 font-light">Estimated Tax (8%)</span>
                <span className="text-white">${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase">
                ESTIMATED TOTAL
              </span>
              <span className="font-headline-md text-2xl text-white font-normal">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-4">
              {currentStep === 1 ? (
                <button
                  onClick={handleProceedToCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-primary text-on-primary py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  PROCEED TO CHECKOUT
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleCompletePurchase}
                    disabled={isProcessing}
                    className="w-full bg-primary text-on-primary py-5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  >
                    {isProcessing ? "PROCESSING..." : "COMPLETE PURCHASE"}
                  </button>
                  <button
                    onClick={handleBackToCart}
                    className="w-full text-center text-on-surface-variant/75 hover:text-primary transition-colors font-label-caps text-[10px] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 py-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to curation
                  </button>
                </div>
              )}
            </div>
            <div className="text-center pt-4">
              <p className="text-[10px] font-label-caps text-on-surface-variant/40 leading-relaxed tracking-wider font-semibold">
                SECURED BY AES-256 ENCRYPTION.
                <br />
                ALL TRANSACTIONS ARE FINAL FOR LIMITED EDITIONS.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
