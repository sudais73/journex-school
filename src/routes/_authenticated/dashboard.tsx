import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Copy,
  LayoutDashboard,
  Share2,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell, Panel, StatCard, type NavItem } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  useAuthUser,
  useCertificates,
  useEnrollments,
  useNotifications,
  usePoints,
  useProfile,
  useReferralTeam,
  useRoles,
  useWallet,
} from "@/hooks/use-journex";
import { formatEtb, fullName, referralLink } from "@/lib/journex";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Journex Dashboard" },
      { name: "description", content: "Track your courses, points, referral team and rewards on Journex." },
      { property: "og:title", content: "My Journex Dashboard" },
      { property: "og:description", content: "Track your courses, points, referral team and rewards." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuthUser();
  const uid = user?.id;
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useProfile(uid);
  const { data: roles } = useRoles(uid);
  const { data: points } = usePoints(uid);
  const { data: team } = useReferralTeam(Boolean(uid));
  const { data: wallet } = useWallet(uid);
  const { data: notifications } = useNotifications(uid);
  const { data: enrollments } = useEnrollments(uid);
  const { data: certificates } = useCertificates(uid);

  // Members who confirmed their email after signing up still need their profile,
  // wallet, role and referral link created from the registration data we stored.
  useEffect(() => {
    if (!uid || profileLoading || profile) return;
    const registration = (user?.user_metadata as { registration?: Json })
      ?.registration;
    if (!registration) return;
    supabase.rpc("complete_registration", { _payload: registration }).then(({ error }) => {
      if (!error) queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    });
  }, [uid, profile, profileLoading, user, queryClient]);

  const isStudent = (roles ?? []).includes("partner") || (enrollments ?? []).length > 0;
  const isAdmin = (roles ?? []).includes("admin");
  const name = fullName(profile ?? undefined) || user?.email || "Member";

  const nav = useMemo<NavItem[]>(() => {
    const base: NavItem[] = [
      { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
      ...(isStudent
        ? [
            { label: "My courses", to: "/dashboard", icon: BookOpen },
            { label: "Certificates", to: "/dashboard", icon: BadgeCheck },
          ]
        : []),
      { label: "Referral team", to: "/dashboard", icon: Users },
      { label: "Wallet", to: "/dashboard", icon: Wallet },
      { label: "Notifications", to: "/dashboard", icon: Bell },
      { label: "Profile", to: "/dashboard", icon: User },
    ];
    return base;
  }, [isStudent]);

  if (profileLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Finish your registration</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We couldn't find your Journex profile. Complete the registration form to activate your
            account and referral username.
          </p>
          <Button asChild className="mt-5">
            <Link to="/auth" search={{ mode: "signup" }}>Complete registration</Link>
          </Button>
        </div>
      </div>
    );
  }

  const link = referralLink(profile.referral_username);

  return (
    <DashboardShell nav={nav} name={name} levelLabel={`${profile.level} • ${isStudent ? "Student" : "User"}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-3xl font-bold">{profile.first_name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{profile.level}</Badge>
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin">Admin panel</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Personal Journey Points" value={points?.pjp ?? 0} hint="PJP" icon={Award} />
          <StatCard label="Team Journey Points" value={points?.tjp ?? 0} hint="TJP" icon={TrendingUp} />
          <StatCard label="Referral members" value={team?.length ?? 0} hint="Across 5 levels" icon={Users} />
          <StatCard
            label="Wallet balance"
            value={formatEtb(wallet?.balance_etb ?? 0)}
            hint={`Lifetime ${formatEtb(wallet?.lifetime_earned_etb ?? 0)}`}
            icon={Wallet}
          />
        </div>

        {isStudent && (
          <>
            <Panel id="my-courses" title="My courses" description="Your active learning journeys">
              {(enrollments ?? []).length === 0 ? (
                <EmptyState
                  text="You haven't joined a learning journey yet."
                  cta={<Button asChild><Link to="/">Browse packages</Link></Button>}
                />
              ) : (
                <ul className="space-y-4">
                  {(enrollments ?? []).map((e) => (
                    <li key={e.id} className="rounded-xl border border-border/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{e.packages?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.packages?.language} • {e.packages?.tier}
                          </p>
                        </div>
                        <Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={e.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{e.progress}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel id="certificates" title="Certificates" description="Issued when you complete a journey">
              {(certificates ?? []).length === 0 ? (
                <EmptyState text="No certificates issued yet." />
              ) : (
                <ul className="space-y-3">
                  {(certificates ?? []).map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl border border-border/70 p-4">
                      <span className="font-medium">{c.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.issued_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </>
        )}

        <Panel
          id="referral-team"
          title="Referral link"
          description="Share your username — every member who joins with it becomes part of your team."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Input readOnly value={link} className="max-w-md font-mono text-xs" />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Referral link copied");
              }}
            >
              <Copy /> Copy link
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(profile.referral_username);
                toast.success("Referral username copied");
              }}
            >
              <Share2 /> {profile.referral_username}
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Referral members</h3>
            {(team ?? []).length === 0 ? (
              <EmptyState text="No one has joined with your username yet." />
            ) : (
              <ul className="mt-3 divide-y divide-border/70">
                {(team ?? []).map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {m.first_name} {m.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">@{m.referral_username}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Level {m.depth}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.joined_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel id="wallet" title="Wallet & rewards" description="Points history and reward balance">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs text-muted-foreground">Available balance</p>
              <p className="font-display text-2xl font-bold">{formatEtb(wallet?.balance_etb ?? 0)}</p>
            </div>
            <ul className="mt-4 space-y-3">
              {(points?.events ?? []).slice(0, 6).map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{e.reason}</span>
                  <span className="font-semibold text-primary">
                    +{e.points} {e.point_type}
                  </span>
                </li>
              ))}
              {(points?.events ?? []).length === 0 && <EmptyState text="No points earned yet." />}
            </ul>
          </Panel>

          <Panel id="notifications" title="Notifications">
            {(notifications ?? []).length === 0 ? (
              <EmptyState text="Nothing new right now." />
            ) : (
              <ul className="space-y-3">
                {(notifications ?? []).map((n) => (
                  <li
                    key={n.id}
                    className={`rounded-xl border p-4 ${n.is_read ? "border-border/60" : "border-primary/40 bg-accent/40"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                      </div>
                      {!n.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
                            queryClient.invalidateQueries({ queryKey: ["notifications", uid] });
                          }}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <ProfilePanel profile={profile} uid={uid!} />
      </div>
    </DashboardShell>
  );
}

function EmptyState({ text, cta }: { text: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

function ProfilePanel({
  profile,
  uid,
}: {
  profile: Record<string, unknown> & { first_name: string; last_name: string };
  uid: string;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    job: (profile.job as string) ?? "",
    address: (profile.address as string) ?? "",
    phone: (profile.phone as string) ?? "",
    account_number: (profile.account_number as string) ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", uid);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    queryClient.invalidateQueries({ queryKey: ["profile", uid] });
  }

  return (
    <Panel id="profile" title="Profile" description="Keep your details up to date">
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Work / job", "job"],
            ["Phone number", "phone"],
            ["Address", "address"],
            ["Account number", "account_number"],
          ] as const
        ).map(([label, key]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <Input
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <Button className="mt-5" onClick={save} disabled={saving}>
        Save changes
      </Button>
    </Panel>
  );
}