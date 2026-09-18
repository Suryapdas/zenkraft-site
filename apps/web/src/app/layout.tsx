import type { Metadata } from "next";
import { Libre_Caslon_Text, Metrophobic } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { api } from "@/lib/api-client";

const display = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Metrophobic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZENKRAFT Design Studios",
    template: "%s | ZENKRAFT Design Studios",
  },
  description: "Premium interior design, architecture, construction and turnkey execution studio.",
};

// Every page fetches live content (projects/services/contact) from the API.
// Force per-request rendering rather than build-time static generation so
// (a) `next build` never depends on the API being reachable at build time,
// and (b) admin-CMS content changes appear immediately, not after an ISR
// window or a full rebuild.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [home, contact] = await Promise.all([api.getHomeContent(), api.getContact()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader primaryCta={home.hero.primaryCta} displayName={home.brand.displayName} />
        <main id="main-content" className="pt-20">
          {children}
        </main>
        <SiteFooter contact={contact} displayName={home.brand.displayName} tagline={home.brand.tagline} />
      </body>
    </html>
  );
}
