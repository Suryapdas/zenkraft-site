"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`font-label-caps text-label-caps uppercase text-on-surface-variant transition-colors duration-300 hover:text-primary ${
        isActive ? "border-b border-primary pb-1 text-primary" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader({ primaryCta, displayName }: { primaryCta: string; displayName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-background">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="font-display text-headline-sm tracking-tight text-primary">
          {displayName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact#enquiry-form"
            className="bg-primary px-6 py-3 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
          >
            {primaryCta}
          </Link>
        </div>

        <button
          type="button"
          className="text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-outline-variant bg-background md:hidden">
          <ul className="flex flex-col gap-1 px-margin-mobile py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact#enquiry-form"
                className="block bg-primary px-5 py-3 text-center font-label-caps text-label-caps uppercase text-on-primary"
                onClick={() => setMenuOpen(false)}
              >
                {primaryCta}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
