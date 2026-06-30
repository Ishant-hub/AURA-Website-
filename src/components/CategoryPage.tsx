import React from "react";
import Link from "next/link";
import db from "@/lib/db";
import { ArrowRight, Speaker, Heart } from "lucide-react";
import { get4KImageUrl } from "@/lib/utils";

interface CategoryPageProps {
  categorySlug: string;
  title: string;
  description: string;
}

export default async function CategoryPage({ categorySlug, title, description }: CategoryPageProps) {
  // Query DB for the category and its products
  const categoryData = await db.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        include: {
          images: true,
        },
      },
    },
  });

  const products = categoryData?.products || [];

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-container-max mx-auto min-h-screen pb-24">
      {/* Page Header */}
      <header className="mb-16">
        <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-3">
          AURA COLLECTION
        </span>
        <h1 className="font-display-lg text-4xl md:text-5xl text-white font-extralight tracking-tight mb-4">
          {title}
        </h1>
        <p className="font-body-md text-on-surface-variant/80 max-w-2xl font-light">
          {description}
        </p>
      </header>

      {/* Grid List */}
      {products.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <p className="text-on-surface-variant font-light text-lg">
            No curations available in this collection at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {products.map((product) => {
            const imageUrl = product.images?.[0]?.url || "/placeholder.jpg";
            return (
              <div
                key={product.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Heart wishlist button */}
                <button className="absolute top-8 right-8 text-on-surface-variant/40 hover:text-primary transition-colors z-10">
                  <Heart className="w-5 h-5" />
                </button>

                <div>
                  {/* Image Container */}
                  <div className="w-full aspect-square bg-white/5 rounded-xl p-8 mb-6 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={get4KImageUrl(imageUrl)}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Brand & Stock status */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-caps text-[10px] text-primary tracking-widest font-semibold">
                      {product.brand.toUpperCase()}
                    </span>
                    {product.stock <= 2 && product.stock > 0 && (
                      <span className="text-[10px] font-label-caps text-primary tracking-wider uppercase font-semibold animate-pulse">
                        Only {product.stock} Left
                      </span>
                    )}
                    {product.isOutOfStock || product.stock === 0 ? (
                      <span className="text-[10px] font-label-caps text-error tracking-wider uppercase font-semibold">
                        Sold Out
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h3 className="font-headline-md text-xl text-white mb-2 font-normal group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm text-on-surface-variant/75 line-clamp-2 mb-6 font-light">
                    {product.description}
                  </p>
                </div>

                {/* Price and Call-to-action */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="font-body-lg text-lg text-white font-light group-hover:text-primary transition-colors">
                    ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-1.5 text-xs font-label-caps tracking-widest text-primary hover:text-white transition-colors uppercase font-semibold"
                  >
                    Curate <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
