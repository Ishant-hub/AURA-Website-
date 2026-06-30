import React from "react";
import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "AURA | Vacuum Tube & Reference Amplifiers",
  description: "Bespoke amplification circuitry featuring vacuum tube warmth and zero-loss signal paths.",
};

export default function Amplifiers() {
  return (
    <CategoryPage
      categorySlug="amplifiers"
      title="Amplifiers"
      description="Hand-wired tube transformers and pure linear paths. Providing the clean, massive power required to unlock the potential of any soundscape."
    />
  );
}
