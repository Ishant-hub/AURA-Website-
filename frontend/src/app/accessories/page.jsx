import React from "react";
import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "AURA | Acoustic Accessories & Controls",
  description: "Complete control units, balanced signal cables, and bespoke room tuning devices.",
};

export const dynamic = "force-dynamic";

export default function Accessories() {
  return (
    <CategoryPage
      categorySlug="accessories"
      title="Accessories"
      description="Refined control nodes, haptic mesh interfaces, and balanced silver core interconnects. The invisible lines that hold the Aura acoustic experience together."
    />
  );
}
