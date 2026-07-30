import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartHandshake,
  Languages,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-journex.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePackages } from "@/hooks/use-journex";
import { BRAND, formatEtb } from "@/lib/journex";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Journex | Learn English & Arabic in Ethiopia" },
      {
        name: "description",
        content:
          "Journex offers structured English and Arabic learning journeys, expert teachers, and a rewarding referral network. Your journey begins here.",
      },
      { property: "og:title", content: "Journex | Learn English & Arabic in Ethiopia" },
      {
        property: "og:description",
        content:
          "Journex offers structured English and Arabic learning journeys, expert teachers, and a rewarding referral network. Your journey begins here.",
      },
    ],
  }),
  component: Index,
});

const whyUs = [
  {
    icon: GraduationCap,
    title: "Structured journeys",
    body: "Four progressive levels per language, from Foundation to Excellence — you always know your next step.",
  },
  {
    icon: Users,
    title: "Live, small classes",
    body: "Practice-first sessions with real speaking time, not passive lectures.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted and transparent",
    body: "Clear pricing in ETB, honest compensation rules, and no hidden fees.",
  },
  {
    icon: HeartHandshake,
    title: "Earn while you grow",
    body: "Invite others with your referral username and earn points as your team grows.",
  },
];

const teachers = [
  { name: "Ustaz Kalid Ahmed", role: "Lead Arabic Instructor", detail: "12 years teaching classical & modern Arabic" },
  { name: "Selam Getachew", role: "Senior English Instructor", detail: "CELTA certified, IELTS specialist" },
  { name: "Yonas Bekele", role: "Business English Coach", detail: "Corporate communication & interview coaching" },
  { name: "Amina Nur", role: "Foundation Program Lead", detail: "Beginner methodology & learner support" },
];

const testimonials = [
  {
    quote:
      "I started at Foundation with almost no confidence. Eight months later I passed my job interview fully in English.",
    name: "Hanna T.",
    role: "Progress graduate",
  },
  {
    quote:
      "The Arabic Mastery track is serious work, but the teachers make it feel achievable every single week.",
    name: "Ibrahim S.",
    role: "Arabic Mastery student",
  },
  {
    quote:
      "I invited five friends and watched my team points grow. Journex rewards you for lifting other people up.",
    name: "Meron A.",
    role: "Partner",
  },
];

const faqs = [
  {
    q: "Do I need to pay to join Journex?",
    a: "No. You can create a free account, get your referral username, invite others and earn Team Journey Points. Paying for a learning journey unlocks courses, progress tracking and certificates.",
  },
  {
    q: "How does the referral system work?",
    a: "Every member receives a unique referral username. When someone registers with your username they join your team. You earn Personal Journey Points for direct referrals and Team Journey Points as your team grows deeper — even if they never purchase.",
  },
  {
    q: "What is the difference between PJP and TJP?",
    a: "Personal Journey Points (PJP) come from your own actions: purchasing a journey or directly inviting a new member. Team Journey Points (TJP) come from the growth and activity of the team below you.",
  },
  {
    q: "How are classes delivered?",
    a: "Live small-group sessions with a workbook, weekly speaking practice and assessments. Each journey lasts between 8 and 28 weeks depending on the level.",
  },
  {
    q: "Can I upgrade my package later?",
    a: "Yes. You can move up from Foundation to Progress, Mastery or Excellence at any time and only pay the difference in your dashboard.",
  },
];

function Index() {
  const { data: packages } = usePackages();
  const english = (packages ?? []).filter((p) => p.language === "English");
  const arabic = (packages ?? []).filter((p) => p.language === "Arabic");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="section-shell grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="text-navy-foreground">
            <Badge className="border-0 bg-navy-foreground/15 text-navy-foreground hover:bg-navy-foreground/20">
              <Sparkles className="mr-1 size-3" /> Education • Leadership • Opportunity
            </Badge>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-extrabold md:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-navy-foreground/80">
              Learn English &amp; Arabic with structured journeys, expert teachers and a community
              that rewards you for helping others grow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth" search={{ mode: "signup" }}>Start Today</Link>
              </Button>
              <Button asChild variant="onNavy" size="xl">
                <a href="#packages">View packages</a>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                ["8", "Learning journeys"],
                ["2", "Languages"],
                ["100%", "Points transparency"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold">{v}</dt>
                  <dd className="text-xs text-navy-foreground/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elevated)]">
              <img
                src={heroImage}
                alt="Journex student holding books in a modern study space"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-background p-4 shadow-[var(--shadow-card)] sm:block">
              <p className="text-xs text-muted-foreground">Personal Journey Points</p>
              <p className="font-display text-2xl font-bold text-primary">+50 PJP</p>
              <p className="text-xs text-muted-foreground">per direct referral</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20" style={{ background: "var(--gradient-soft)" }}>
        <div className="section-shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">About Journex</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              An education network built on trust
            </h2>
            <p className="mt-5 text-muted-foreground">
              Journex combines high-quality language education with leadership development and an
              ethical business opportunity. Members learn English and Arabic through guided
              journeys, then grow by bringing others along with them.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every member starts as a Partner. Your level grows with your learning and with the
              team you build — under compensation rules that are published and administered
              transparently.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="border-border/70 shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <Compass className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Our Vision</h3>
                <p className="mt-2 text-sm text-muted-foreground">{BRAND.vision}</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <Target className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Our Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground">{BRAND.mission}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">Why choose us</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Learning that pays forward</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <Card key={item.title} className="border-border/70 shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className="bg-surface py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">Our teachers</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Guided by people who care</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teachers.map((t) => (
              <Card key={t.name} className="border-border/70 bg-background shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <span className="grid size-12 place-items-center rounded-full bg-primary/10 font-display font-bold text-primary">
                    {t.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                  </span>
                  <h3 className="mt-4 font-semibold">{t.name}</h3>
                  <p className="text-sm text-primary">{t.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Learning journey packages
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Choose where your journey starts</h2>
          </div>

          {[
            { title: "English Learning Journey", icon: BookOpen, list: english },
            { title: "Arabic Learning Journey", icon: Languages, list: arabic },
          ].map((group) => (
            <div key={group.title} className="mt-12">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <group.icon className="size-5 text-primary" /> {group.title}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {group.list.map((p, i) => (
                  <Card
                    key={p.id}
                    className={`relative border-border/70 shadow-[var(--shadow-card)] ${
                      i === 2 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {i === 2 && (
                      <Badge className="absolute -top-3 left-6">Most popular</Badge>
                    )}
                    <CardContent className="flex h-full flex-col p-6">
                      <p className="text-sm font-semibold text-primary">{p.tier}</p>
                      <p className="mt-2 font-display text-2xl font-bold">{formatEtb(p.price_etb)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                      <ul className="mt-5 flex-1 space-y-2">
                        {((p.features as string[]) ?? []).map((f) => (
                          <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-xs text-muted-foreground">
                        {p.duration_weeks} weeks • earns {p.pjp_reward} PJP
                      </p>
                      <Button asChild className="mt-4 w-full">
                        <Link to="/auth" search={{ mode: "signup" }}>Start this journey</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Student testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Journeys already underway</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/70 bg-background shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <Quote className="size-6 text-primary/40" />
                  <p className="mt-4 text-sm leading-relaxed">{t.quote}</p>
                  <p className="mt-5 font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Questions, answered</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Still unsure? Reach out and a Journex advisor will walk you through the journeys and
              the reward system.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="pb-20">
        <div className="section-shell">
          <div
            className="rounded-3xl px-8 py-14 text-center text-navy-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Award className="mx-auto size-8" />
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
              Your journey begins here
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-foreground/80">
              Create your free account, claim your referral username, and choose the journey that
              fits your goals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth" search={{ mode: "signup" }}>Create my account</Link>
              </Button>
              <Button asChild variant="onNavy" size="xl">
                <a href="mailto:hello@journex.et">Talk to an advisor</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
