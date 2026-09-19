import { WhatsAppGlyph } from "./Icons";
import { company } from "@/data/site";

export function WhatsAppButton() {
  return (
    <a
      href={company.whatsapp}
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppGlyph className="h-8 w-8" />
    </a>
  );
}
