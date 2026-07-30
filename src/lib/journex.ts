export const BRAND = {
  name: "Journex",
  tagline: "Your Journey Begins Here",
  vision:
    "To become the world's most trusted education and leadership network, empowering millions of people.",
  mission:
    "To provide high-quality education, develop leaders, and create ethical business opportunities.",
};

export function formatEtb(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `${new Intl.NumberFormat("en-US").format(Math.round(n))} ETB`;
}

export function fullName(p?: {
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
}) {
  if (!p) return "";
  return [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(" ");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function referralLink(username: string, origin?: string) {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/auth?ref=${username}`;
}