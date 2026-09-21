import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { BarChart3, LogOut, Package, Store, Tag, Users } from "lucide-react";
import { amIAdmin, claimFirstAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Faturamento", icon: BarChart3, exact: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: Package },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/cupons", label: "Cupons", icon: Tag },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const check = useServerFn(amIAdmin);
  const { data, isLoading } = useQuery({ queryKey: ["am-i-admin"], queryFn: () => check() });
  const claimFn = useServerFn(claimFirstAdmin);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: (res) => {
      setClaimMsg(res.message);
      queryClient.invalidateQueries({ queryKey: ["am-i-admin"] });
    },
    onError: () => setClaimMsg("Não foi possível liberar o acesso."),
  });


  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold">
            <Store className="h-5 w-5 text-brand" /> Painel da loja
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Ver loja
            </Link>
            <button onClick={signOut} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-6 lg:flex-row">
        <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              activeProps={{ className: "bg-brand text-primary-foreground" }}
              inactiveProps={{ className: "bg-surface text-foreground hover:bg-surface/70" }}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : data?.admin ? (
            <Outlet />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-8">
              <h2 className="text-lg font-bold">Acesso restrito</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua conta ainda não tem permissão de administrador. Se você é o dono da loja e este é o primeiro
                acesso, libere sua conta abaixo.
              </p>
              <button
                onClick={() => claim.mutate()}
                disabled={claim.isPending}
                className="mt-4 h-10 rounded-full bg-brand px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
              >
                Liberar meu acesso de administrador
              </button>
              {claimMsg ? <p className="mt-2 text-sm text-muted-foreground">{claimMsg}</p> : null}
            </div>

          )}
        </main>
      </div>
    </div>
  );
}
