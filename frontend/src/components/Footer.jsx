import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background w-full pt-24 pb-8 border-t border-surface-variant">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-gutter px-4 md:px-margin-desktop max-w-container-max mx-auto mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display-lg text-headline-md text-primary mb-8">AURA</div>
          <p className="font-body-md text-on-surface-variant max-w-xs text-sm leading-relaxed">
            Elevating the standard of high-fidelity entertainment for global collectors and enthusiasts.
          </p>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-white mb-8">PRODUCTS</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/speakers" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Speakers
              </Link>
            </li>
            <li>
              <Link href="/amplifiers" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Amplifiers
              </Link>
            </li>
            <li>
              <Link href="/turntables" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Turntables
              </Link>
            </li>
            <li>
              <Link href="/accessories" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Accessories
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-white mb-8">SOLUTIONS</h5>
          <ul className="space-y-4">
            <li>
              <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Home Cinema
              </a>
            </li>
            <li>
              <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Smart Audio
              </a>
            </li>
            <li>
              <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Acoustic Calibration
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-white mb-8">COMPANY</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/showrooms" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Showrooms
              </Link>
            </li>
            <li>
              <Link href="/careers" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/book-demo" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Contact &amp; Demo
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-white mb-8">SUPPORT</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/track-order" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Track Curation
              </Link>
            </li>
            <li>
              <Link href="/login" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block font-medium">
                Admin Console
              </Link>
            </li>
            <li>
              <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 inline-block">
                Warranty &amp; Services
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto border-t border-surface-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-body-md text-xs text-on-surface-variant">
          © 2026 AURA PRIVATE SHOWROOM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8">
          <a className="font-body-md text-xs text-on-surface-variant hover:text-primary" href="#">
            Privacy Policy
          </a>
          <a className="font-body-md text-xs text-on-surface-variant hover:text-primary" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
