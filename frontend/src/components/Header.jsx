"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, ShoppingCart, User as UserIcon, LogOut, Shield } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Speakers", href: "/speakers" },
    { name: "Amplifiers", href: "/amplifiers" },
    { name: "Turntables", href: "/turntables" },
    { name: "Accessories", href: "/accessories" },
    { name: "Design Your Room", href: "/design-your-room" },
    { name: "Book Demo", href: "/book-demo" },
    { name: "Track Order", href: "/track-order" },
  ]; 

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-margin-desktop py-4">
      {/* Brand Logo */}
      <Link href="/" className="font-display-lg text-headline-md tracking-tighter text-primary hover:opacity-80 transition-opacity">
        AURA
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`font-label-caps text-label-caps tracking-[0.15em] transition-all duration-300 ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary pb-1"
              }`}
            >
              {link.name.toUpperCase()}
            </Link>
          );
        })}
      </div>

      {/* Action / Cart Icon & Profile */}
      <div className="flex items-center gap-6">
        <Link
          href="/checkout"
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 relative p-2"
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-label-caps animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User Profile / Login Dropdown (Desktop) */}
        <div className="hidden md:block">
          {loading ? (
            <div className="w-8 h-8 rounded-full border border-white/10 animate-pulse bg-white/5"></div>
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-semibold font-label-caps text-xs cursor-pointer">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0E0E0E]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-2 hidden group-hover:block hover:block shadow-2xl z-50">
                <div className="px-4 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-[9px] text-primary font-label-caps tracking-wider uppercase font-semibold">Welcome</p>
                  <p className="text-xs text-white truncate font-medium">{user.name}</p>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-label-caps tracking-widest text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  >
                    <Shield className="w-3.5 h-3.5" /> ADMIN PANEL
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-label-caps tracking-widest text-error hover:bg-error/5 transition-colors rounded-lg cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> LOG OUT
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary tracking-widest transition-colors"
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0E0E0E]/95 backdrop-blur-2xl border-b border-white/10 flex flex-col p-8 gap-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-caps text-label-caps tracking-[0.15em] text-on-surface-variant hover:text-primary text-lg"
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
          <div className="w-full h-[1px] bg-white/5 my-2"></div>
          {user ? (
            <div className="space-y-4">
              <div className="px-1">
                <p className="text-[10px] text-primary font-label-caps tracking-wider uppercase font-semibold">Logged in as</p>
                <p className="text-sm text-white truncate font-medium">{user.name}</p>
              </div>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-caps text-xs tracking-widest uppercase font-bold py-1"
                >
                  <Shield className="w-4 h-4" /> ADMIN PANEL
                </Link>
              )}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-error font-label-caps text-xs tracking-widest uppercase font-bold py-1 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> LOG OUT
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-primary font-label-caps text-xs tracking-widest uppercase font-bold py-1"
            >
              <UserIcon className="w-4 h-4" /> LOGIN
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
