import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
  ref: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Join Journex | Create your account" },
      {
        name: "description",
        content:
          "Register or sign in to your Journex account to access your learning journey, referral team and reward points.",
      },
      { property: "og:title", content: "Join Journex | Create your account" },
      {
        property: "og:description",
        content: "Register or sign in to access your Journex learning journey and referral team.",
      },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  first_name: z.string().trim().min(2, "First name is required").max(60),
  middle_name: z.string().trim().max(60).optional().or(z.literal("")),
  last_name: z.string().trim().min(2, "Last name is required").max(60),
  job: z.string().trim().max(80).optional().or(z.literal("")),
  age: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  account_number: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").max(255),
  gender: z.string().optional().or(z.literal("")),
  educational_status: z.string().optional().or(z.literal("")),
  referral_code: z.string().trim().max(40).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const empty = {
  first_name: "",
  middle_name: "",
  last_name: "",
  job: "",
  age: "",
  address: "",
  phone: "",
  account_number: "",
  email: "",
  gender: "",
  educational_status: "",
  referral_code: "",
  password: "",
};

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [form, setForm] = useState({ ...empty, referral_code: search.ref ?? "" });
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const set = (k: keyof typeof empty) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { password: _pw, ...registration } = parsed.data;
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { registration },
        },
      });
      if (error) throw error;

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("login");
        return;
      }

      const { error: rpcError } = await supabase.rpc("complete_registration", {
        _payload: registration,
      });
      if (rpcError) throw rpcError;

      toast.success("Welcome to Journex!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create your account");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = identifier.includes("@");
      if (!isEmail) {
        toast.error("Please sign in with the email address you registered with.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password,
      });
      if (error) throw error;
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign you in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-shell flex min-h-screen flex-col items-center justify-center py-12">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
            J
          </span>
          <span className="font-display text-lg font-bold">Journex</span>
        </Link>

        <Card className="w-full max-w-2xl border-border/70 shadow-[var(--shadow-card)]">
          <CardContent className="p-6 md:p-8">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
            </Tabs>

            {mode === "login" ? (
              <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                <h1 className="font-display text-2xl font-bold">Welcome back</h1>
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email</Label>
                  <Input
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@gmail.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Log in
                </Button>
              </form>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSignup}>
                <div>
                  <h1 className="font-display text-2xl font-bold">Create your account</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Everyone starts as a Partner. Your referral username is generated automatically.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="First name" required value={form.first_name} onChange={set("first_name")} />
                  <Field label="Middle name" value={form.middle_name} onChange={set("middle_name")} />
                  <Field label="Last name" required value={form.last_name} onChange={set("last_name")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Work / job" value={form.job} onChange={set("job")} />
                  <Field label="Age" type="number" value={form.age} onChange={set("age")} />
                  <Field label="Phone number" required value={form.phone} onChange={set("phone")} />
                  <Field label="Account number" value={form.account_number} onChange={set("account_number")} />
                  <Field label="Address" value={form.address} onChange={set("address")} />
                  <Field
                    label="Email (Gmail)"
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                  />

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={set("gender")}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Educational status</Label>
                    <Select value={form.educational_status} onValueChange={set("educational_status")}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High school">High school</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Degree">Degree</SelectItem>
                        <SelectItem value="Masters or above">Masters or above</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Field
                    label="Referral username (optional)"
                    value={form.referral_code}
                    onChange={set("referral_code")}
                  />
                  <Field
                    label="Password"
                    required
                    type="password"
                    value={form.password}
                    onChange={set("password")}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Start today
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}