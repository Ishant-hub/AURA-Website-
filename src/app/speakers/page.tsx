import React from "react";
import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "AURA | Loudspeakers Collection",
  description: "Sculptural aesthetics meet unparalleled acoustic transparency. Explore our flagship range of speakers.",
};

export const dynamic = "force-dynamic";

export default function Speakers() {
  return (
    <CategoryPage
      categorySlug="speakers"
      title="Loudspeakers"
      description="Architectural design combined with state-of-the-art transducer engineering. The ultimate expression of pure acoustic fidelity."
    />
  );
}
