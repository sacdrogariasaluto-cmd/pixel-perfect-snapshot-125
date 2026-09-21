import type { ReactNode } from "react";
import { PromoBar } from "./PromoBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieNotice } from "./CookieNotice";
import { WhatsAppButton } from "./WhatsAppButton";
import { CartDrawer } from "./CartDrawer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PromoBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieNotice />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}
