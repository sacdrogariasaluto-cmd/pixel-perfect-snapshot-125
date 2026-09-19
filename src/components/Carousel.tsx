import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";

export function Carousel({
  children,
  className = "",
  step = 400,
  arrowClass = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  arrowClass?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => ref.current?.scrollBy({ left: dir * step, behavior: "smooth" });

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`${label}: anterior`}
        onClick={() => scrollBy(-1)}
        className={`absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-brand ${arrowClass}`}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div
        ref={ref}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth ${className}`}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label={`${label}: próximo`}
        onClick={() => scrollBy(1)}
        className={`absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-brand ${arrowClass}`}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
