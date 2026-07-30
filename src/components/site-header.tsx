import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-journex";

const links = [
  { label: "About", href: "#about" },
  { label: "Why us", href: "#why" },
  { label: "Teachers", href: "#teachers" },
  { label: "Packages", href: "#packages" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
            J
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Journex</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">My dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start today
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="section-shell flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <Link to={user ? "/dashboard" : "/auth"}>{user ? "My dashboard" : "Start today"}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}