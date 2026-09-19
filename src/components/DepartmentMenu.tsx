import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ChevronRight } from "./Icons";
import { departments, departmentSlugs } from "@/data/site";

export function DepartmentMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 w-[245px] rounded-b-md bg-surface py-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
      role="menu"
      aria-label="Departamentos"
    >
      {departments.map((d) => (
        <Link
          key={d}
          to="/$slug"
          params={{ slug: departmentSlugs[d] ?? "medicamentos" }}
          onClick={onClose}
          role="menuitem"
          className="flex items-center justify-between px-5 py-2 text-sm text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
        >
          {d}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
      <p className="px-5 pt-3 text-[11px] leading-snug text-muted-foreground">
        Ramificações profundas dependem de conferência na loja de referência.
      </p>
    </div>
  );
}
