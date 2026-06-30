import React from "react";
import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "AURA | Reference Turntables",
  description: "Magnetic levitation bearing systems and carbon fiber tonearms for flawless analog retrieval.",
};

export default function Turntables() {
  return (
    <CategoryPage
      categorySlug="turntables"
      title="Turntables"
      description="Absolute rotational stability. Magnetic isolation platters designed to extract the most delicate detail from standard and heavy-weight analog vinyl presses."
    />
  );
}
