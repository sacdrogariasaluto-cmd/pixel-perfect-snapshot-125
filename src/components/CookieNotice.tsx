import { useEffect, useState } from "react";

export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("vc-cookies") !== "ok") setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 z-[60] w-[330px] rounded-md border border-border bg-surface p-4 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <p className="text-muted-foreground">
        Usamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com
        a nossa{" "}
        <a href="#" className="text-brand underline">
          política de privacidade
        </a>
        .
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("vc-cookies", "ok");
          setShow(false);
        }}
        className="mt-3 rounded bg-buy px-4 py-2 font-bold text-white hover:bg-buy-hover"
      >
        Aceitar
      </button>
    </div>
  );
}
