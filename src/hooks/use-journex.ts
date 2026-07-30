import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useRoles(userId?: string) {
  return useQuery({
    queryKey: ["roles", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role);
    },
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePoints(userId?: string) {
  return useQuery({
    queryKey: ["points", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("point_events")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const events = data ?? [];
      const pjp = events.filter((e) => e.point_type === "PJP").reduce((s, e) => s + e.points, 0);
      const tjp = events.filter((e) => e.point_type === "TJP").reduce((s, e) => s + e.points, 0);
      return { events, pjp, tjp };
    },
  });
}

export function useReferralTeam(enabled: boolean) {
  return useQuery({
    queryKey: ["referral-team"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_referral_team", { _max_depth: 5 });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useWallet(userId?: string) {
  return useQuery({
    queryKey: ["wallet", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEnrollments(userId?: string) {
  return useQuery({
    queryKey: ["enrollments", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, packages(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCertificates(userId?: string) {
  return useQuery({
    queryKey: ["certificates", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId!)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}