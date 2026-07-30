-- =========================================================
-- Roles
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'partner', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Profiles
-- =========================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  job text,
  age integer,
  address text,
  phone text,
  account_number text,
  email text,
  gender text,
  educational_status text,
  referral_username text NOT NULL UNIQUE,
  referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  level text NOT NULL DEFAULT 'Partner',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX profiles_referred_by_idx ON public.profiles (referred_by);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "read direct referrals" ON public.profiles
  FOR SELECT TO authenticated USING (referred_by = auth.uid());
CREATE POLICY "read own referrer" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT p.referred_by FROM public.profiles p WHERE p.id = auth.uid()));
CREATE POLICY "admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admins update profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Packages
-- =========================================================
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language text NOT NULL,
  tier text NOT NULL,
  name text NOT NULL,
  description text,
  price_etb numeric(12,2) NOT NULL,
  pjp_reward integer NOT NULL DEFAULT 0,
  duration_weeks integer,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (language, tier)
);
GRANT SELECT ON public.packages TO anon, authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages are public" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage packages" ON public.packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.packages (language, tier, name, description, price_etb, pjp_reward, duration_weeks, features, sort_order) VALUES
('English','Foundation','English Foundation','Build a confident base in everyday English.',6800,68,8,'["Live foundation classes","Course workbook","Weekly speaking practice","Completion certificate"]',1),
('English','Progress','English Progress','Move from basics to fluent everyday conversation.',12500,125,12,'["Everything in Foundation","Small group conversation labs","Grammar intensives","Progress assessments"]',2),
('English','Mastery','English Mastery','Professional-level written and spoken English.',19850,198,20,'["Everything in Progress","Business writing module","1:1 coaching sessions","Mock interviews"]',3),
('English','Excellence','English Excellence','Exam-ready mastery with leadership coaching.',24500,245,28,'["Everything in Mastery","Exam preparation track","Leadership workshops","Priority mentor access"]',4),
('Arabic','Foundation','Arabic Foundation','Read, write and speak your first Arabic.',5400,54,8,'["Live foundation classes","Alphabet and script training","Weekly speaking practice","Completion certificate"]',5),
('Arabic','Progress','Arabic Progress','Grow into confident daily Arabic conversation.',9650,96,12,'["Everything in Foundation","Conversation labs","Grammar intensives","Progress assessments"]',6),
('Arabic','Mastery','Arabic Mastery','Advanced Arabic for work and study.',15390,153,20,'["Everything in Progress","Classical text reading","1:1 coaching sessions","Advanced writing"]',7),
('Arabic','Excellence','Arabic Excellence','Complete Arabic mastery with leadership coaching.',21436,214,28,'["Everything in Mastery","Certification preparation","Leadership workshops","Priority mentor access"]',8);

-- =========================================================
-- Enrollments
-- =========================================================
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX enrollments_user_idx ON public.enrollments (user_id);
GRANT SELECT, INSERT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read enrollments" ON public.enrollments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "create own enrollment" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins manage enrollments" ON public.enrollments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Payments
-- =========================================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
  amount_etb numeric(12,2) NOT NULL,
  provider text NOT NULL DEFAULT 'manual',
  reference text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payments_user_idx ON public.payments (user_id);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own payments" ON public.payments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Compensation rules
-- =========================================================
CREATE TABLE public.compensation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  point_type text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  depth integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.compensation_rules TO anon, authenticated;
GRANT ALL ON public.compensation_rules TO service_role;
ALTER TABLE public.compensation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active rules are public" ON public.compensation_rules FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "admins manage rules" ON public.compensation_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER compensation_rules_updated_at BEFORE UPDATE ON public.compensation_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.compensation_rules (code, label, description, point_type, points, depth) VALUES
('referral_signup','Direct referral joins','Points you earn when someone joins using your referral username.','PJP',50,1),
('team_growth','Team growth','Points earned by upline members when the team grows below them.','TJP',20,5),
('course_purchase','Course purchase','Personal points earned when you purchase a learning journey.','PJP',0,1),
('team_purchase','Team purchase','Team points earned by upline when a team member purchases.','TJP',30,5);

-- =========================================================
-- Points ledger
-- =========================================================
CREATE TABLE public.point_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  point_type text NOT NULL,
  points integer NOT NULL,
  rule_code text,
  reason text NOT NULL,
  source_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  depth integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX point_events_user_idx ON public.point_events (user_id, point_type);
GRANT SELECT ON public.point_events TO authenticated;
GRANT ALL ON public.point_events TO service_role;
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own points" ON public.point_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read points" ON public.point_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage points" ON public.point_events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Wallets
-- =========================================================
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_etb numeric(12,2) NOT NULL DEFAULT 0,
  lifetime_earned_etb numeric(12,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own wallet" ON public.wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage wallets" ON public.wallets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Notifications
-- =========================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, is_read);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "update own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins manage notifications" ON public.notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Certificates
-- =========================================================
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
  title text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  file_url text
);
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own certificates" ON public.certificates FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage certificates" ON public.certificates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Points engine
-- =========================================================
CREATE OR REPLACE FUNCTION public.award_referral_points(_new_user uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _rule_direct public.compensation_rules%ROWTYPE;
  _rule_team public.compensation_rules%ROWTYPE;
  _current uuid;
  _level int := 1;
BEGIN
  SELECT * INTO _rule_direct FROM public.compensation_rules WHERE code = 'referral_signup' AND is_active;
  SELECT * INTO _rule_team FROM public.compensation_rules WHERE code = 'team_growth' AND is_active;

  SELECT referred_by INTO _current FROM public.profiles WHERE id = _new_user;

  WHILE _current IS NOT NULL AND _level <= COALESCE(_rule_team.depth, 5) LOOP
    IF _level = 1 AND _rule_direct.id IS NOT NULL THEN
      INSERT INTO public.point_events (user_id, point_type, points, rule_code, reason, source_user_id, depth)
      VALUES (_current, 'PJP', _rule_direct.points, _rule_direct.code, 'Direct referral joined Journex', _new_user, 1);
      INSERT INTO public.notifications (user_id, title, body)
      VALUES (_current, 'New referral joined', 'You earned ' || _rule_direct.points || ' PJP from a new direct referral.');
    ELSIF _rule_team.id IS NOT NULL THEN
      INSERT INTO public.point_events (user_id, point_type, points, rule_code, reason, source_user_id, depth)
      VALUES (_current, 'TJP', GREATEST(_rule_team.points - ((_level - 2) * 5), 1), _rule_team.code,
              'Team grew at level ' || _level, _new_user, _level);
    END IF;

    SELECT referred_by INTO _current FROM public.profiles WHERE id = _current;
    _level := _level + 1;
  END LOOP;
END; $$;

CREATE OR REPLACE FUNCTION public.generate_referral_username(_first text, _last text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _base text; _candidate text; _i int := 0;
BEGIN
  _base := lower(regexp_replace(coalesce(_first,'') || coalesce(_last,''), '[^a-zA-Z0-9]', '', 'g'));
  IF length(_base) < 3 THEN _base := _base || 'journex'; END IF;
  _base := left(_base, 14);
  LOOP
    _candidate := CASE WHEN _i = 0 THEN _base ELSE _base || _i::text END;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_username = _candidate);
    _i := _i + 1;
  END LOOP;
  RETURN _candidate;
END; $$;

CREATE OR REPLACE FUNCTION public.complete_registration(_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _referrer uuid;
  _username text;
  _ref_input text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = _uid) THEN
    RETURN jsonb_build_object('status', 'exists');
  END IF;

  _ref_input := nullif(lower(trim(_payload->>'referral_code')), '');
  IF _ref_input IS NOT NULL THEN
    SELECT id INTO _referrer FROM public.profiles WHERE referral_username = _ref_input;
  END IF;

  _username := public.generate_referral_username(_payload->>'first_name', _payload->>'last_name');

  INSERT INTO public.profiles (
    id, first_name, middle_name, last_name, job, age, address, phone,
    account_number, email, gender, educational_status, referral_username, referred_by
  ) VALUES (
    _uid,
    coalesce(nullif(trim(_payload->>'first_name'), ''), 'Member'),
    nullif(trim(_payload->>'middle_name'), ''),
    coalesce(nullif(trim(_payload->>'last_name'), ''), 'Member'),
    nullif(trim(_payload->>'job'), ''),
    nullif(_payload->>'age', '')::int,
    nullif(trim(_payload->>'address'), ''),
    nullif(trim(_payload->>'phone'), ''),
    nullif(trim(_payload->>'account_number'), ''),
    nullif(trim(_payload->>'email'), ''),
    nullif(trim(_payload->>'gender'), ''),
    nullif(trim(_payload->>'educational_status'), ''),
    _username,
    _referrer
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'user') ON CONFLICT DO NOTHING;
  INSERT INTO public.wallets (user_id) VALUES (_uid) ON CONFLICT DO NOTHING;
  INSERT INTO public.notifications (user_id, title, body)
  VALUES (_uid, 'Welcome to Journex', 'Your journey begins here. Share your referral link to start earning points.');

  IF _referrer IS NOT NULL THEN
    PERFORM public.award_referral_points(_uid);
  END IF;

  RETURN jsonb_build_object('status', 'created', 'referral_username', _username);
END; $$;

REVOKE ALL ON FUNCTION public.complete_registration(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.complete_registration(jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.award_referral_points(uuid) FROM public;
REVOKE ALL ON FUNCTION public.generate_referral_username(text, text) FROM public;

-- Referral tree for a member (their downline)
CREATE OR REPLACE FUNCTION public.get_referral_team(_max_depth int DEFAULT 5)
RETURNS TABLE (
  id uuid, first_name text, last_name text, referral_username text,
  level text, depth int, joined_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH RECURSIVE tree AS (
    SELECT p.id, p.first_name, p.last_name, p.referral_username, p.level, 1 AS depth, p.created_at
    FROM public.profiles p WHERE p.referred_by = auth.uid()
    UNION ALL
    SELECT c.id, c.first_name, c.last_name, c.referral_username, c.level, t.depth + 1, c.created_at
    FROM public.profiles c JOIN tree t ON c.referred_by = t.id
    WHERE t.depth < _max_depth
  )
  SELECT id, first_name, last_name, referral_username, level, depth, created_at FROM tree
  ORDER BY depth, created_at;
$$;
REVOKE ALL ON FUNCTION public.get_referral_team(int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_referral_team(int) TO authenticated;

CREATE OR REPLACE FUNCTION public.referral_username_exists(_username text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE referral_username = lower(trim(_username)))
$$;
REVOKE ALL ON FUNCTION public.referral_username_exists(text) FROM public;
GRANT EXECUTE ON FUNCTION public.referral_username_exists(text) TO anon, authenticated;