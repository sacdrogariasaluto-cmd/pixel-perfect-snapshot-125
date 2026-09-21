import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  BarChart3,
  Bell,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  House,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { amIAdmin, claimFirstAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Drogaria Vera Cruz" },
      { name: "description", content: "Gestão de vendas, pedidos, clientes e promoções da Drogaria Vera Cruz." },
      { property: "og:title", content: "Administração — Drogaria Vera Cruz" },
      { property: "og:description", content: "Gestão da operação da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof BarChart3; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: Package },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/cupons", label: "Marketing", icon: Tag },
];

const SECONDARY_NAV = [
  { label: "Produtos", icon: Boxes },
  { label: "Pagamentos", icon: WalletCards },
  { label: "Frete", icon: Truck },
  { label: "Checkout", icon: CircleDollarSign },
  { label: "Loja virtual", icon: ShoppingBag },
  { label: "Configurações", icon: Settings },
];


function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const check = useServerFn(amIAdmin);
  const { data, isLoading } = useQuery({ queryKey: ["am-i-admin"], queryFn: () => check() });
  const claimFn = useServerFn(claimFirstAdmin);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-buy" />
      <header className="fixed inset-x-0 top-1 z-40 h-14 border-b border-border bg-surface">
        <div className="flex h-full items-center gap-3 px-3 lg:px-5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <Link to="/admin" className="flex w-44 items-center gap-2 text-base font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-buy text-primary-foreground"><Store className="h-4 w-4" /></span>
            Vera Cruz Admin
          </Link>
          <div className="mx-auto hidden w-full max-w-md md:block">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-8 bg-background pl-9 text-xs" placeholder="Pesquisar no painel..." />
            </label>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Notificações"><Bell /></Button>
            <Link to="/" className="hidden px-2 text-xs font-semibold text-muted-foreground hover:text-foreground sm:block">Ver loja</Link>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut /> <span className="hidden sm:inline">Sair</span></Button>
          </div>
        </div>
      </header>

      {menuOpen ? <button type="button" className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" /> : null}
       <aside className={`fixed bottom-0 left-0 top-[60px] z-30 w-48 border-r border-border bg-sidebar p-3 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="space-y-1">
          <Link to="/" className="mb-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
            <House className="h-4 w-4" /> Início
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              activeOptions={{ exact: item.exact ?? false }}
              activeProps={{ className: "bg-brand/10 text-brand" }}
              inactiveProps={{ className: "text-sidebar-foreground hover:bg-sidebar-accent" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold"
            >
              <item.icon className="h-4 w-4" /> {item.label}<ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
            </Link>
          ))}
          <div className="my-3 border-t border-sidebar-border" />
          {SECONDARY_NAV.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground">
              <item.icon className="h-4 w-4" /> {item.label}<ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
            </div>
          ))}
        </nav>
      </aside>

       <div className="pt-[60px] lg:pl-48">
         <main className="mx-auto min-w-0 max-w-[1160px] px-4 py-5 lg:px-6 lg:py-5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : data?.admin ? (
            <Outlet />
          ) : (
            <div className="rounded-md border border-border bg-surface p-8 shadow-sm">
              <h2 className="text-lg font-bold">Acesso restrito</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua conta ainda não tem permissão de administrador. Se você é o dono da loja e este é o primeiro
                acesso, libere sua conta abaixo.
              </p>
              <Button
                onClick={() => claim.mutate()}
                disabled={claim.isPending}
                className="mt-4"
              >
                Liberar meu acesso de administrador
              </Button>
              {claimMsg ? <p className="mt-2 text-sm text-muted-foreground">{claimMsg}</p> : null}
            </div>

          )}
        </main>
      </div>
    </div>
  );
}
