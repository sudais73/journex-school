import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/journex";

export type NavItem = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };

export function DashboardShell({
  nav,
  name,
  levelLabel,
  children,
}: {
  nav: NavItem[];
  name: string;
  levelLabel: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-5">
          <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-display text-lg font-bold text-sidebar-primary-foreground">
            J
          </span>
          <span className="font-display text-lg font-bold">Journex</span>
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <a
                key={item.label}
                href={item.to.startsWith("#") ? item.to : undefined}
                onClick={(e) => {
                  if (!item.to.startsWith("#")) {
                    e.preventDefault();
                    document.getElementById(item.label.toLowerCase().replace(/\s+/g, "-"))
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-semibold">
              {initials(name || "J")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="text-xs text-sidebar-foreground/60">{levelLabel}</p>
            </div>
          </div>
          <Button variant="onNavy" className="mt-3 w-full" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4 lg:hidden">
          <Link to="/" className="font-display font-bold">Journex</Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </header>
        <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({
  id,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-border/70 bg-background p-6 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}