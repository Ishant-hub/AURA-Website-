import React from "react";
import db from "@/lib/db";
import { Package, Truck, Compass, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { get4KImageUrl } from "@/lib/utils";

interface TrackPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export const metadata = {
  title: "AURA | Track Your Curation",
  description: "Monitor the real-time concierge delivery and room calibration status of your luxury audio purchase.",
};

export default async function TrackOrder({ searchParams }: TrackPageProps) {
  const { orderNumber } = await searchParams;
  let order = null;
  let errorMsg = "";

  if (orderNumber) {
    order = await db.order.findUnique({
      where: { orderNumber: orderNumber.trim() },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      errorMsg = `Order "${orderNumber}" was not found in our showroom registry.`;
    }
  }

  // Helper to determine status steps
  const getStatusStep = (status: string) => {
    switch (status) {
      case "PLACED":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0; // Cancelled or other
    }
  };

  const statusStep = order ? getStatusStep(order.status) : 0;

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-4xl mx-auto min-h-screen pb-24">
      {/* Search Header */}
      <header className="mb-12 text-center">
        <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-3 uppercase">
          CONCIERGE TRACKING
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl text-white font-extralight tracking-tight mb-4">
          Curation Delivery Status
        </h1>
        <p className="font-body-md text-on-surface-variant/75 max-w-md mx-auto font-light leading-relaxed mb-8">
          Enter your unique AURA order registry number to track logistics and white-glove acoustic calibration setup.
        </p>

        {/* Search Input */}
        <form method="GET" className="max-w-md mx-auto flex gap-4">
          <input
            type="text"
            name="orderNumber"
            defaultValue={orderNumber || ""}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary focus:outline-none transition-colors text-white font-mono placeholder:text-on-surface-variant/30 text-sm"
            placeholder="e.g. AURA-801292"
          />
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 uppercase"
          >
            TRACK
          </button>
        </form>
      </header>

      {/* Error Message */}
      {errorMsg && (
        <div className="glass-panel p-6 rounded-xl border-error-container/20 bg-error-container/5 flex gap-4 items-center justify-center max-w-md mx-auto">
          <AlertTriangle className="w-5 h-5 text-error" />
          <p className="text-xs font-label-caps tracking-widest uppercase font-semibold text-error text-center">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Tracking Results */}
      {order && (
        <div className="space-y-12">
          {/* Tracking Stepper */}
          <div className="glass-panel p-8 md:p-12 rounded-2xl border-white/5 space-y-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-white/5 pb-8">
              <div>
                <p className="text-[10px] font-label-caps text-primary tracking-widest font-semibold uppercase mb-1">
                  ORDER REGISTRY
                </p>
                <h2 className="font-display-lg text-2xl text-white font-light font-mono">
                  {order.orderNumber}
                </h2>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-label-caps text-on-surface-variant/50 tracking-widest font-semibold uppercase mb-1">
                  TRANSACTION STATE
                </p>
                <span
                  className={`inline-block text-[10px] font-label-caps tracking-widest font-bold px-3 py-1 rounded-full ${
                    order.paymentStatus === "PAID"
                      ? "bg-primary-container/20 text-primary border border-primary/20"
                      : "bg-error-container/20 text-error border border-error-container/20"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Stepper Steps */}
            {order.status === "CANCELLED" ? (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-error mx-auto mb-3" />
                <h3 className="font-headline-md text-lg text-white font-normal uppercase tracking-wider">
                  Curation Cancelled
                </h3>
                <p className="text-sm text-on-surface-variant/75 mt-1 font-light">
                  This order has been cancelled. Please contact your private concierge.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 relative">
                {/* Connector line */}
                <div className="absolute top-5 left-[16.6%] right-[16.6%] h-[2px] bg-white/10 z-0">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width: statusStep === 1 ? "0%" : statusStep === 2 ? "50%" : "100%",
                    }}
                  ></div>
                </div>

                {/* Step 1: Placed */}
                <div className="flex flex-col items-center text-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      statusStep >= 1
                        ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                        : "bg-surface border-white/10 text-on-surface-variant/50"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="font-label-caps text-[10px] text-white tracking-widest font-bold mt-4 uppercase">
                    PLACED
                  </h4>
                  <p className="text-[9px] text-on-surface-variant/60 tracking-wider mt-1 uppercase font-semibold">
                    Concierge Registered
                  </p>
                </div>

                {/* Step 2: Shipped */}
                <div className="flex flex-col items-center text-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      statusStep >= 2
                        ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                        : "bg-surface border-white/10 text-on-surface-variant/50"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-label-caps text-[10px] text-white tracking-widest font-bold mt-4 uppercase">
                    TRANSIT
                  </h4>
                  <p className="text-[9px] text-on-surface-variant/60 tracking-wider mt-1 uppercase font-semibold">
                    White-Glove Dispatch
                  </p>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center text-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      statusStep >= 3
                        ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20"
                        : "bg-surface border-white/10 text-on-surface-variant/50"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="font-label-caps text-[10px] text-white tracking-widest font-bold mt-4 uppercase">
                    INSTALLED
                  </h4>
                  <p className="text-[9px] text-on-surface-variant/60 tracking-wider mt-1 uppercase font-semibold">
                    Calibrated & Tuned
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details & Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border-white/5 space-y-6 md:col-span-2">
              <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
                CURATED ITEMS
              </h3>
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 glass-panel rounded-xl flex items-center justify-center p-2 bg-white/5 flex-shrink-0">
                      <img
                        src={get4KImageUrl(item.product.name === "Eclipse X1" ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI" : "https://lh3.googleusercontent.com/aida-public/AB6AXuDzPLeL_fNkS4MHyjESaApTR8NZmokCUQZxNBhmCqGx77-rdCXm0p1r1juCmXIfHxrnDCRpzQZZ3xJJsvVRPKMQuNo1dav5A24L0QPPbsbNRDLRV8r9pqBdb8a3k6aNaERiFpCN7Cea40SEc5likqo2z5MmkB53Z9eQ_msu34GpfW8-9lC0MqZjGeJ5A5QkfiPEMYp2lp2YqfgrGvuwRSoAQ4Ai6THt3XpoO1f6OjPcTo1e64QhaT8BHNnJg2Tcd2PYrgjuV_wdTpo")}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline-md text-sm text-white font-normal">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant/60 font-light">
                        Qty: {item.quantity} × ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-white font-light font-mono">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-white/5 space-y-6">
              <h3 className="font-label-caps text-xs text-primary tracking-widest font-bold uppercase">
                DELIVERY DETAILS
              </h3>
              <div className="space-y-4 text-xs font-light">
                <div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-wider font-semibold uppercase mb-1">
                    RECIPIENT
                  </p>
                  <p className="text-white font-normal">{order.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-wider font-semibold uppercase mb-1">
                    DESTINATION
                  </p>
                  <p className="text-white leading-relaxed">
                    {order.address}, <br />
                    {order.city} - {order.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-wider font-semibold uppercase mb-1">
                    CONTACT REGISTRY
                  </p>
                  <p className="text-white">
                    {order.email} <br />
                    {order.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
