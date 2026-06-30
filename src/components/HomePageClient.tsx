"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { get4KImageUrl } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  description: string;
  images?: ProductImage[];
}

interface HomePageClientProps {
  featuredProducts: Product[];
}

export default function HomePageClient({ featuredProducts }: HomePageClientProps) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal-animation").forEach((el) => {
      revealObserver.observe(el);
    });

    // Trigger hero content animation immediately
    const heroContent = document.getElementById("hero-content");
    if (heroContent) {
      heroContent.classList.add("visible");
    }

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                `url(${get4KImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuAHSsT_BDBj4VIOcP9_Xq616OuTcE7eUV5Y4xZCZxGMCO0dBAJWKZv6Ir72gCWrbtydFcOirnQ0UZrEvpvx2B00Y9OAqMffnmkpj19aKIpph7qD0OvohukbmiNRP4XhKaoCFJ-GPRsrbc_bzDGE7HT7pDY0GfzBs5pY-SGhWOUDG87uva69C5tVXaIfMYRD4jOHfE_lPZ4xyR0PqfChfHM-o95k3DztJ3KbiK9MQtrsz8W0uVT2vL13btsj3ze8lEHhRv6msFsMQZ0')})`,
            }}
          ></div>
          <div className="absolute inset-0 hero-gradient-overlay"></div>
        </div>

        <div
          className="relative z-10 text-center px-margin-mobile md:px-0 max-w-4xl reveal-animation"
          id="hero-content"
        >
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 drop-shadow-lg">
            Experience Sound Beyond Imagination
          </h1>
          <p className="font-body-lg text-body-lg text-white/95 mb-12 drop-shadow-md">
            Premium Audio, Home Cinema & Entertainment Solutions for the discerning ear.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/speakers"
              className="bg-white text-background px-12 py-4 font-label-caps text-label-caps tracking-[0.2em] gold-glow transition-all active:scale-95"
            >
              EXPLORE PRODUCTS
            </Link>
            <Link
              href="/book-demo"
              className="glass-card text-white px-12 py-4 font-label-caps text-label-caps tracking-[0.2em] active:scale-95"
            >
              BOOK DEMO
            </Link>
          </div>
        </div>

        {/* Floating Glass Cards */}
        <div className="absolute bottom-12 left-0 w-full hidden lg:flex justify-center gap-6 px-margin-desktop z-20">
          <div className="glass-card flex-1 p-8 rounded-lg flex items-center gap-6">
            <div className="text-primary">
              <span className="material-symbols-outlined text-[40px]">speaker</span>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-white">SPEAKERS</h4>
              <p className="text-[10px] text-on-surface-variant tracking-wider">
                PURE ACOUSTIC MASTERY
              </p>
            </div>
          </div>
          <div className="glass-card flex-1 p-8 rounded-lg flex items-center gap-6">
            <div className="text-primary">
              <span className="material-symbols-outlined text-[40px]">settings_input_component</span>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-white">AMPLIFIERS</h4>
              <p className="text-[10px] text-on-surface-variant tracking-wider">
                UNCOMPROMISED POWER
              </p>
            </div>
          </div>
          <div className="glass-card flex-1 p-8 rounded-lg flex items-center gap-6">
            <div className="text-primary">
              <span className="material-symbols-outlined text-[40px]">settings_input_hdmi</span>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-white">AV RECEIVERS</h4>
              <p className="text-[10px] text-on-surface-variant tracking-wider">
                CINEMATIC PRECISION
              </p>
            </div>
          </div>
          <div className="glass-card flex-1 p-8 rounded-lg flex items-center gap-6">
            <div className="text-primary">
              <span className="material-symbols-outlined text-[40px]">stream</span>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-white">STREAMING</h4>
              <p className="text-[10px] text-on-surface-variant tracking-wider">
                LOSSLESS FREEDOM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-20 bg-surface-container-lowest border-y border-white/5 marquee-container">
        <div className="marquee-content flex gap-32 items-center">
          {[
            "Sony",
            "Samsung",
            "LG",
            "Bose",
            "JBL",
            "Yamaha",
            "Denon",
            "Onkyo",
            "Sony",
            "Samsung",
            "LG",
            "Bose",
            "JBL",
            "Yamaha",
            "Denon",
            "Onkyo",
          ].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-on-surface-variant/30 font-display-lg text-headline-md tracking-widest uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Products Block (Dynamically Loaded) */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-24 px-margin-desktop max-w-container-max mx-auto">
          <div className="mb-24 flex flex-col items-center reveal-animation">
            <span className="font-label-caps text-label-caps text-primary mb-4 tracking-[0.4em]">
              THE AURA SELECTION
            </span>
            <h2 className="font-display-lg text-headline-md text-white text-center">
              Featured Curations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {featuredProducts.map((product) => {
              const imageUrl = product.images?.[0]?.url || "/placeholder.jpg";
              return (
                <div
                  key={product.id}
                  className="glass-card rounded-xl p-8 flex flex-col group justify-between reveal-animation"
                >
                  <div>
                    <div className="w-full aspect-square relative bg-white/5 rounded-xl p-6 mb-6 overflow-hidden flex items-center justify-center">
                      <img
                        src={get4KImageUrl(imageUrl)}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="font-label-caps text-[10px] text-primary tracking-widest block mb-1">
                      {product.brand.toUpperCase()}
                    </span>
                    <h3 className="font-headline-md text-2xl text-white mb-2 font-normal">
                      {product.name}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mb-6 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="font-body-lg text-lg text-primary font-light">
                      ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex items-center gap-1 text-xs font-label-caps tracking-widest text-white group-hover:text-primary transition-colors uppercase"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Categories Grid */}
      <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-24 flex flex-col items-center reveal-animation">
          <span className="font-label-caps text-label-caps text-primary mb-4 tracking-[0.4em]">
            COLLECTIONS
          </span>
          <h2 className="font-display-lg text-headline-md text-white text-center">
            Curated Soundscapes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Large Featured Item */}
          <div className="md:col-span-8 group relative overflow-hidden glass-card rounded-xl aspect-[16/9] reveal-animation">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage:
                  `url(${get4KImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDTQvM7clTjbV9GXGsgT2LlH8V-R6p6eGDHt93Y6BGWFd6-b-A2DYNg2p1nNihAJ8BNukOsaKKU5GWLat5378nSFLIHUSyChj9nSmWkvJOUxn_ElPAf2xc5MaGzZOU8uTK9s8wyD4ab32n8SelqVqbvL8Mh07LtLb-IkjeHL7_mQPRmajrjm5pK-D8Aq-aHjIalfhSFhr5fBAGenKuG1xqIYC-o8W6jcIe0V1dnJj4cfX_g1olFbio4yCUxOq_e48SlT7dMa03_bXI')})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12">
              <h3 className="font-headline-md text-white mb-2">Home Speakers</h3>
              <p className="text-on-surface-variant mb-6 max-w-md">
                Sculptural aesthetics meet unparalleled acoustic transparency. Explore our flagship
                range.
              </p>
              <Link
                className="font-label-caps text-label-caps text-primary hover:underline underline-offset-4 tracking-[0.2em]"
                href="/speakers"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
          {/* Small Items */}
          <div className="md:col-span-4 group relative overflow-hidden glass-card rounded-xl aspect-square reveal-animation">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage:
                  `url(${get4KImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDzPLeL_fNkS4MHyjESaApTR8NZmokCUQZxNBhmCqGx77-rdCXm0p1r1juCmXIfHxrnDCRpzQZZ3xJJsvVRPKMQuNo1dav5A24L0QPPbsbNRDLRV8r9pqBdb8a3k6aNaERiFpCN7Cea40SEc5likqo2z5MmkB53Z9eQ_msu34GpfW8-9lC0MqZjGeJ5A5QkfiPEMYp2lp2YqfgrGvuwRSoAQ4Ai6THt3XpoO1f6OjPcTo1e64QhaT8BHNnJg2Tcd2PYrgjuV_wdTpo')})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-headline-md text-white mb-2">Amplifiers</h3>
              <Link
                className="font-label-caps text-label-caps text-primary hover:underline underline-offset-4 tracking-[0.2em]"
                href="/amplifiers"
              >
                DISCOVER
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 group relative overflow-hidden glass-card rounded-xl aspect-square reveal-animation">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage:
                  `url(${get4KImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDG9k6ZknVNwoLTiU4-Nxc5NHYQAmwa4TwDJhaiNMQIdIp6reBUXcCm3kJoEKagpBqyfSnIe1ZYjmY36O02PqsGEWNIUXFXv4DCIipaFeWTDmWiJLSbrsAUZ8pEHpe4vHXtfnzDE_mBdpeArCuy_fCDpdgT42U16plIDoTuH4MD-I59oOyX0hcsmG5l8hJ6ZWgA0Gzz1AsnW5CPZBlC36pb2RYbBaXkwhaYjBJDommG37MsAGwWD8YO9KSQX2x9sV1RYfKTJPlDXo4')})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-headline-md text-white mb-2">Turntables</h3>
              <Link
                className="font-label-caps text-label-caps text-primary hover:underline underline-offset-4 tracking-[0.2em]"
                href="/turntables"
              >
                DISCOVER
              </Link>
            </div>
          </div>
          {/* Large Featured Item */}
          <div className="md:col-span-8 group relative overflow-hidden glass-card rounded-xl aspect-[16/9] reveal-animation">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage:
                  `url(${get4KImageUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuAHSsT_BDBj4VIOcP9_Xq616OuTcE7eUV5Y4xZCZxGMCO0dBAJWKZv6Ir72gCWrbtydFcOirnQ0UZrEvpvx2B00Y9OAqMffnmkpj19aKIpph7qD0OvohukbmiNRP4XhKaoCFJ-GPRsrbc_bzDGE7HT7pDY0GfzBs5pY-SGhWOUDG87uva69C5tVXaIfMYRD4jOHfE_lPZ4xyR0PqfChfHM-o95k3DztJ3KbiK9MQtrsz8W0uVT2vL13btsj3ze8lEHhRv6msFsMQZ0')})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12">
              <h3 className="font-headline-md text-white mb-2">Home Cinema</h3>
              <p className="text-on-surface-variant mb-6 max-w-md">
                The absolute pinnacle of cinematic immersion for private showrooms.
              </p>
              <Link
                className="font-label-caps text-label-caps text-primary hover:underline underline-offset-4 tracking-[0.2em]"
                href="/book-demo"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-section-gap bg-surface-container-lowest">
        <div className="px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center reveal-animation">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined text-[32px]">verified</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-white mb-4">EXPERT CONSULTATION</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bespoke advice from audio engineers with decades of experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center reveal-animation transition-delay-100">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-white mb-4">GENUINE PRODUCTS</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Authorized luxury retailers for the world&apos;s most prestigious brands.
              </p>
            </div>
            <div className="flex flex-col items-center text-center reveal-animation transition-delay-200">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined text-[32px]">engineering</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-white mb-4">INSTALLATION SUPPORT</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Seamless white-glove setup and acoustic room calibration.
              </p>
            </div>
            <div className="flex flex-col items-center text-center reveal-animation transition-delay-300">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-primary mb-8">
                <span className="material-symbols-outlined text-[32px]">security</span>
              </div>
              <h4 className="font-label-caps text-label-caps text-white mb-4">EXTENDED WARRANTY</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Priority service and extended peace of mind for every investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Experience Stats */}
      <section className="py-section-gap relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full w-1/2 mx-auto"></div>
        <div className="relative z-10 px-margin-desktop max-w-container-max mx-auto text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="reveal-animation">
              <div className="font-display-lg text-primary mb-2 text-4xl md:text-[72px] font-extralight tracking-tight">10k+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                CUSTOMERS
              </div>
            </div>
            <div className="reveal-animation transition-delay-100">
              <div className="font-display-lg text-primary mb-2 text-4xl md:text-[72px] font-extralight tracking-tight">100+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                BRANDS
              </div>
            </div>
            <div className="reveal-animation transition-delay-200">
              <div className="font-display-lg text-primary mb-2 text-4xl md:text-[72px] font-extralight tracking-tight">25+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                CENTERS
              </div>
            </div>
            <div className="reveal-animation transition-delay-300">
              <div className="font-display-lg text-primary mb-2 text-4xl md:text-[72px] font-extralight tracking-tight">20+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                YEARS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-gap px-margin-desktop reveal-animation">
        <div className="glass-card p-16 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-12 border-primary/20">
          <div className="max-w-2xl text-left">
            <h2 className="font-display-lg text-headline-md text-white mb-6">
              Experience the future of audio in person.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Visit one of our private showrooms for a guided acoustic journey. We curate spaces that
              redefine how you listen.
            </p>
          </div>
          <Link
            href="/book-demo"
            className="bg-primary text-on-primary px-16 py-5 font-label-caps text-label-caps tracking-widest gold-glow transition-all active:scale-95 whitespace-nowrap"
          >
            BOOK A PRIVATE DEMO
          </Link>
        </div>
      </section>
    </div>
  );
}
