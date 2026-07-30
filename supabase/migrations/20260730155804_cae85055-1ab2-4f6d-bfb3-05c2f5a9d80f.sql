CREATE OR REPLACE FUNCTION public.my_referrer()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT referred_by FROM public.profiles WHERE id = auth.uid()
$$;

DROP POLICY IF EXISTS "read own referrer" ON public.profiles;

CREATE POLICY "read own referrer" ON public.profiles
FOR SELECT TO authenticated
USING (id = public.my_referrer());