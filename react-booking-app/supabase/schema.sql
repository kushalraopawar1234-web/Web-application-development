-- React Booking App — Supabase schema
-- Run once in the SAME Supabase project, SQL Editor → New query.
--
-- The project already has `matches` and `bookings` for the Boundary app,
-- so this app uses prefixed tables to avoid a name collision:
--   ipl_matches  → fixtures + per-stand prices + available_seats
--   ipl_bookings → one row per confirmed booking

create table if not exists public.ipl_matches (
  id text primary key,
  match_no text not null,
  team1_name text not null,
  team1_short text not null,
  team2_name text not null,
  team2_short text not null,
  match_date text not null,          -- e.g. "April 5, 2026"
  start_time text not null,          -- e.g. "7:30 PM"
  venue text not null,               -- e.g. "Wankhede Stadium, Mumbai"
  general_price integer not null check (general_price >= 0),
  premium_price integer not null check (premium_price >= 0),
  vip_price integer not null check (vip_price >= 0),
  available_seats integer not null default 0 check (available_seats >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ipl_bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  match_id text not null references public.ipl_matches (id) on delete cascade,
  stand text not null check (stand in ('general', 'premium', 'vip')),
  quantity integer not null check (quantity between 1 and 10),
  total_price integer not null check (total_price >= 0),
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists ipl_bookings_match_id_idx on public.ipl_bookings (match_id);
create index if not exists ipl_bookings_created_at_idx on public.ipl_bookings (created_at desc);

-- ---------------------------------------------------------------------------
-- Sample fixtures (re-running leaves existing rows alone)
-- ---------------------------------------------------------------------------

insert into public.ipl_matches
  (id, match_no, team1_name, team1_short, team2_name, team2_short, match_date, start_time, venue,
   general_price, premium_price, vip_price, available_seats, sort_order)
values
  ('match-01', 'Match 01', 'Royal Challengers Bengaluru', 'RCB', 'Mumbai Indians', 'MI',
   'April 5, 2026', '7:30 PM', 'Wankhede Stadium, Mumbai', 1500, 3500, 7500, 120, 1),
  ('match-02', 'Match 02', 'Chennai Super Kings', 'CSK', 'Kolkata Knight Riders', 'KKR',
   'April 6, 2026', '7:30 PM', 'M. A. Chidambaram Stadium, Chennai', 1200, 3000, 6500, 84, 2),
  ('match-03', 'Match 03', 'Delhi Capitals', 'DC', 'Sunrisers Hyderabad', 'SRH',
   'April 7, 2026', '7:30 PM', 'Arun Jaitley Stadium, Delhi', 1000, 2500, 5500, 62, 3)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Privileges + row level security (demo policies — tighten before production)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on public.ipl_matches to anon, authenticated;
grant update (available_seats) on public.ipl_matches to anon, authenticated;
grant select, insert, delete on public.ipl_bookings to anon, authenticated;

alter table public.ipl_matches enable row level security;
alter table public.ipl_bookings enable row level security;

drop policy if exists "ipl matches are readable" on public.ipl_matches;
create policy "ipl matches are readable"
  on public.ipl_matches for select
  using (true);

drop policy if exists "ipl match seats can be updated" on public.ipl_matches;
create policy "ipl match seats can be updated"
  on public.ipl_matches for update
  using (true)
  with check (available_seats >= 0);

drop policy if exists "ipl bookings are readable" on public.ipl_bookings;
create policy "ipl bookings are readable"
  on public.ipl_bookings for select
  using (true);

drop policy if exists "ipl bookings can be created" on public.ipl_bookings;
create policy "ipl bookings can be created"
  on public.ipl_bookings for insert
  with check (true);

drop policy if exists "ipl bookings can be removed" on public.ipl_bookings;
create policy "ipl bookings can be removed"
  on public.ipl_bookings for delete
  using (true);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ipl_matches'
  ) then
    alter publication supabase_realtime add table public.ipl_matches;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ipl_bookings'
  ) then
    alter publication supabase_realtime add table public.ipl_bookings;
  end if;
end $$;

-- Reset the demo seat counts (uncomment and run):
-- update public.ipl_matches as m
-- set available_seats = v.seats
-- from (values ('match-01', 120), ('match-02', 84), ('match-03', 62)) as v (id, seats)
-- where m.id = v.id;
