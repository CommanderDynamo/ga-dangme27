-- Events the site displays (Upcoming / Current / Past is computed from start_date/end_date)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  poster_url text,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);

-- RSVPs submitted by site visitors
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  guest_count integer not null default 1 check (guest_count between 1 and 20),
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Anyone can submit an RSVP...
create policy "Anyone can RSVP"
  on public.rsvps for insert
  with check (true);

-- ...but nobody can read the list back through the public API — attendee
-- names/emails stay private. View responses via the Supabase Table Editor
-- (the dashboard uses your service role, which bypasses RLS).

-- Seed the current upcoming event
insert into public.events (title, description, location, poster_url, start_date)
values (
  'HOMOWO Festival',
  'Come and celebrate HOMOWO Festival with us in Amsterdam. Meet GaDangmes from across the Netherlands as we honour our heritage together.',
  'Amsterdam, The Netherlands',
  '/og-events-poster.jpg',
  '2026-09-19'
);
