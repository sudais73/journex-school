import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell, Panel, StatCard, type NavItem } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser, usePackages, useProfile, useRoles } from "@/hooks/use-journex";
import { formatEtb, fullName } from "@/lib/journex";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Journex Admin" },
      { name: "description", content: "Manage Journex members, packages, payments, points and compensation rules." },
      { property: "og:title", content: "Journex Admin" },
      { property: "og:description", content: "Manage members, packages, payments, points and compensation rules." },
    ],
  }),
  component: AdminPage,
});

const nav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Members", to: "/admin", icon: Users },
  { label: "Packages", to: "/admin", icon: BookOpen },
  { label: "Payments", to: "/admin", icon: CreditCard },
  { label: "Compensation rules", to: "/admin", icon: Settings2 },
];

function AdminPage() {
  const { user } = useAuthUser();
  const { data: roles, isLoading } = useRoles(user?.id);
  const { data: profile } = useProfile(user?.id);
  const isAdmin = (roles ?? []).includes("admin");

  const members = useQuery({
    queryKey: ["admin-members"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const payments = useQuery({
    queryKey: ["admin-payments"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rules = useQuery({
    queryKey: ["admin-rules"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("compensation_rules").select("*").order("code");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: packages } = usePackages();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to Journex administrators.
          </p>
          <Button asChild className="mt-5">
            <Link to="/dashboard">Back to my dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = (payments.data ?? [])
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount_etb), 0);

  return (
    <DashboardShell nav={nav} name={fullName(profile ?? undefined) || "Admin"} levelLabel="Administrator">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Journex control centre</p>
          <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Members" value={members.data?.length ?? 0} icon={Users} />
          <StatCard label="Packages" value={packages?.length ?? 0} icon={BookOpen} />
          <StatCard label="Payments" value={payments.data?.length ?? 0} icon={CreditCard} />
          <StatCard label="Revenue (paid)" value={formatEtb(totalRevenue)} icon={Sparkles} />
        </div>

        <Panel id="members" title="Members" description="Everyone registered on Journex">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(members.data ?? []).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{fullName(m)}</TableCell>
                    <TableCell className="text-muted-foreground">@{m.referral_username}</TableCell>
                    <TableCell className="text-muted-foreground">{m.phone ?? "—"}</TableCell>
                    <TableCell><Badge variant="secondary">{m.level}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel id="packages" title="Packages" description="Learning journeys and pricing">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(packages ?? []).map((p) => (
              <div key={p.id} className="rounded-xl border border-border/70 p-4">
                <p className="text-xs text-muted-foreground">{p.language}</p>
                <p className="font-semibold">{p.tier}</p>
                <p className="mt-2 font-display text-xl font-bold">{formatEtb(p.price_etb)}</p>
                <p className="text-xs text-muted-foreground">{p.pjp_reward} PJP</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel id="payments" title="Payments" description="Latest transactions">
          {(payments.data ?? []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No payments recorded yet. Chapa / Telebirr checkout can be connected later.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payments.data ?? []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatEtb(p.amount_etb)}</TableCell>
                    <TableCell>{p.provider}</TableCell>
                    <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>

        <CompensationRules rules={rules.data ?? []} />
      </div>
    </DashboardShell>
  );
}

function CompensationRules({
  rules,
}: {
  rules: Array<{
    id: string;
    code: string;
    label: string;
    description: string | null;
    point_type: string;
    points: number;
    depth: number;
    is_active: boolean;
  }>;
}) {
  const queryClient = useQueryClient();

  async function update(
    id: string,
    patch: { points?: number; depth?: number; is_active?: boolean },
  ) {
    const { error } = await supabase.from("compensation_rules").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Rule updated");
    queryClient.invalidateQueries({ queryKey: ["admin-rules"] });
  }

  return (
    <Panel
      id="compensation-rules"
      title="Compensation rules"
      description="Control how many points each action awards and how deep the team benefits."
    >
      <div className="space-y-4">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border/70 p-4"
          >
            <div className="min-w-56 flex-1">
              <p className="font-medium">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <Badge variant="secondary" className="mt-2">{r.point_type}</Badge>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Points</label>
              <Input
                type="number"
                defaultValue={r.points}
                className="w-24"
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v !== r.points) update(r.id, { points: v });
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Depth</label>
              <Input
                type="number"
                defaultValue={r.depth}
                className="w-20"
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v !== r.depth) update(r.id, { depth: v });
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={r.is_active} onCheckedChange={(v) => update(r.id, { is_active: v })} />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}