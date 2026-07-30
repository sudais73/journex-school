import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { BRAND } from "@/lib/journex";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-navy-foreground/15 font-display text-lg font-bold">
              J
            </span>
            <span className="font-display text-lg font-bold">{BRAND.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">{BRAND.mission}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/70">
            <li><a href="#about" className="hover:text-navy-foreground">About Journex</a></li>
            <li><a href="#packages" className="hover:text-navy-foreground">Learning packages</a></li>
            <li><a href="#teachers" className="hover:text-navy-foreground">Our teachers</a></li>
            <li><Link to="/auth" className="hover:text-navy-foreground">Join the network</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/70">
            <li className="flex items-center gap-2"><Phone className="size-4" /> +251 900 000 000</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> hello@journex.et</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> Addis Ababa, Ethiopia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/15">
        <div className="section-shell py-5 text-xs text-navy-foreground/60">
          © {new Date().getFullYear()} Journex. Education, leadership and ethical opportunity.
        </div>
      </div>
    </footer>
  );
}