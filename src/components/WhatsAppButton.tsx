import { WhatsAppGlyph } from "./Icons";
import { company } from "@/data/site";

export function WhatsAppButton() {
  return (
    <a
      href={company.whatsapp}
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-5 right-5 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-buy text-primary-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-14 md:w-14"
    >
      <WhatsAppGlyph className="h-8 w-8" />
    </a>
  );
}
