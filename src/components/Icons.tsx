import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const HeadsetIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M20 14h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1z" />
    <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
  </svg>
);

export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const UserIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 19a6 6 0 0 1 11 0" />
  </svg>
);

export const BasketIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 8h15l-2 9a2 2 0 0 1-2 1.6H9.6A2 2 0 0 1 7.6 17L5.4 5H2" />
    <circle cx="9.5" cy="21" r="0.8" />
    <circle cx="17" cy="21" r="0.8" />
  </svg>
);

export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ChevronLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const TrashIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);

export const PlusCircle = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const MinusCircle = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" />
  </svg>
);

export const LockIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const ZoomIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6" />
    <path d="M11 8v6M8 11h6M20 20l-4.4-4.4" />
  </svg>
);

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const TruckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

export const CardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

export const StoreIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 10v9h16v-9M3 6h18l-1 4H4z" />
    <path d="M10 19v-5h4v5" />
  </svg>
);

export const ShieldIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 5-3.4 8.6-7 10-3.6-1.4-7-5-7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export function Stars({ value, count }: { value: number; count: number }) {
  return (
    <span className="flex items-center gap-[2px]" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            d="m12 3 2.6 5.6 6 .7-4.4 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6L3.4 9.3l6-.7z"
            fill={i <= Math.round(value) ? "#f5a623" : "#d8d8d8"}
          />
        </svg>
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({count})</span>
    </span>
  );
}

export const WhatsAppGlyph = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2s-1.1-1.5-1.1-2.8 .7-2 .9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.2.1.3 0 .5s-.2.4-.4.6-.3.4-.1.7c.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6s.5.1.7-.1c.2-.2.8-.9 1-1.2s.4-.3.7-.2 1.7.8 2 1 .5.3.6.4c0 .2 0 .7-.2 1.2z" />
  </svg>
);
