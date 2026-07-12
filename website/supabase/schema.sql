-- ============================================================
-- Selin Weikard CRM – vollständiges Datenbankschema
-- Einmalig im Supabase SQL Editor ausführen (idempotent).
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ========================= WISSEN =============================
create table if not exists public.wissen_artikel (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published boolean not null default false,
  slug text unique,
  titel text not null,
  beschreibung text,
  kategorie text,
  lesezeit text,
  bild_url text,
  image_label text,
  inhalt text,
  pub_date date not null default current_date
);

-- ========================= GALERIE ============================
create table if not exists public.galerie (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  published boolean not null default true,
  bild_url text not null,
  geschichte text check (char_length(geschichte) <= 250),
  sort integer not null default 0
);

-- =================== ERST-CHECK LEADS =========================
create table if not exists public.erst_check_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  ergebnis_typ text,
  antworten jsonb,
  consent boolean not null default false
);

-- ============================ LEADS ===========================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text, email text, phone text,
  source text,
  consent boolean not null default false,
  status text not null default 'neu'
    check (status in ('neu','kontaktiert','qualifiziert','kunde','archiviert')),
  notes text
);

-- ========================== ANFRAGEN ==========================
create table if not exists public.anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  name text, email text, phone text,
  channel text not null default 'whatsapp',
  paket text,
  message text,
  status text not null default 'offen'
    check (status in ('offen','in_bearbeitung','beantwortet','geschlossen'))
);

-- =========================== TERMINE ==========================
create table if not exists public.termine (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text default 'Online',
  status text not null default 'geplant'
    check (status in ('geplant','bestätigt','abgesagt','erledigt')),
  notes text
);

-- ========================= DOKUMENTE ==========================
create table if not exists public.dokumente (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  url text,
  type text,
  size_bytes bigint
);

-- ======================== SOCIAL POSTS ========================
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  plattform text not null default 'instagram',
  inhalt text,
  link text,
  status text not null default 'idee'
    check (status in ('idee','geplant','veroeffentlicht')),
  geplant_am timestamptz
);

-- ===================== NEWSLETTER =============================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  name text,
  consent boolean not null default false,
  confirmed boolean not null default false,
  status text not null default 'aktiv' check (status in ('aktiv','abgemeldet'))
);

-- ===================== FINANZEN ==============================
create table if not exists public.transaktionen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  betrag numeric(10,2) not null,
  waehrung text not null default 'EUR',
  beschreibung text,
  typ text not null default 'einnahme' check (typ in ('einnahme','ausgabe')),
  status text not null default 'offen' check (status in ('offen','bezahlt','storniert')),
  bezahlt_am timestamptz
);

-- ---------- updated_at Trigger ----------
drop trigger if exists trg_wissen_updated on public.wissen_artikel;
create trigger trg_wissen_updated before update on public.wissen_artikel for each row execute function public.set_updated_at();
drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists trg_anfragen_updated on public.anfragen;
create trigger trg_anfragen_updated before update on public.anfragen for each row execute function public.set_updated_at();
drop trigger if exists trg_termine_updated on public.termine;
create trigger trg_termine_updated before update on public.termine for each row execute function public.set_updated_at();
drop trigger if exists trg_social_updated on public.social_posts;
create trigger trg_social_updated before update on public.social_posts for each row execute function public.set_updated_at();
drop trigger if exists trg_transaktionen_updated on public.transaktionen;
create trigger trg_transaktionen_updated before update on public.transaktionen for each row execute function public.set_updated_at();

-- ---------- Indexe ----------
create index if not exists idx_wissen_pub on public.wissen_artikel(published, pub_date desc);
create index if not exists idx_galerie_sort on public.galerie(published, sort, created_at desc);
create index if not exists idx_leads_created on public.leads(created_at desc);
create index if not exists idx_anfragen_created on public.anfragen(created_at desc);
create index if not exists idx_termine_start on public.termine(start_at);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.wissen_artikel        enable row level security;
alter table public.galerie                enable row level security;
alter table public.erst_check_leads       enable row level security;
alter table public.leads                  enable row level security;
alter table public.anfragen               enable row level security;
alter table public.termine                enable row level security;
alter table public.dokumente              enable row level security;
alter table public.social_posts           enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.transaktionen          enable row level security;

-- Eingeloggte CRM-Nutzer dürfen alles
do $$
declare t text;
begin
  foreach t in array array[
    'wissen_artikel','galerie','erst_check_leads','leads','anfragen','termine',
    'dokumente','social_posts','newsletter_subscribers','transaktionen'
  ] loop
    execute format('drop policy if exists admin_all_%1$s on public.%1$s;', t);
    execute format('create policy admin_all_%1$s on public.%1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Öffentlich lesbar: nur veröffentlichte Wissen-Artikel & Galerie-Einträge
drop policy if exists public_read_wissen on public.wissen_artikel;
create policy public_read_wissen on public.wissen_artikel for select to anon using (published = true);
drop policy if exists public_read_galerie on public.galerie;
create policy public_read_galerie on public.galerie for select to anon using (published = true);

-- Öffentlich anlegbar (nur Insert): Lead-Erfassung
drop policy if exists public_insert_erstcheck on public.erst_check_leads;
create policy public_insert_erstcheck on public.erst_check_leads for insert to anon with check (true);
drop policy if exists public_insert_leads on public.leads;
create policy public_insert_leads on public.leads for insert to anon with check (true);
drop policy if exists public_insert_anfragen on public.anfragen;
create policy public_insert_anfragen on public.anfragen for insert to anon with check (true);
drop policy if exists public_insert_newsletter on public.newsletter_subscribers;
create policy public_insert_newsletter on public.newsletter_subscribers for insert to anon with check (true);

-- ============================================================
-- Storage: öffentlicher Bucket "media" für Bilder/Dokumente
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media','media', true)
on conflict (id) do update set public = true;

-- Öffentlich lesen (Bucket ist public); Schreiben/Löschen nur für Eingeloggte
drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select to public using (bucket_id = 'media');
drop policy if exists media_auth_insert on storage.objects;
create policy media_auth_insert on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists media_auth_update on storage.objects;
create policy media_auth_update on storage.objects for update to authenticated using (bucket_id = 'media');
drop policy if exists media_auth_delete on storage.objects;
create policy media_auth_delete on storage.objects for delete to authenticated using (bucket_id = 'media');

-- ============================================================
-- Seed: Beispiel-Galerie (Bilder liegen unter /galerie/… im public-Ordner)
-- ============================================================
insert into public.galerie (bild_url, geschichte, sort, published) values
  ('/galerie/selin-1.jpeg', 'Gemeinsame Zeit ist der Anfang jeder Begleitung – hier bei einem ruhigen Moment mit einem meiner Herzenshunde.', 1, true),
  ('/galerie/morpheus-4.jpeg', 'Morpheus während der Ausleitung: Man sah die Spuren der alten Belastung – aber er fand Schritt für Schritt zurück zur Ruhe.', 2, true),
  ('/galerie/selin-3.jpeg', 'Vertrauen wächst langsam. Genau dieses Vertrauen ist die Grundlage für echte Veränderung.', 3, true),
  ('/galerie/morpheus-6.jpeg', 'Heute: glänzendes Fell, wache Augen, keine Ohrenprobleme mehr. Der lebende Beweis, dass sich der Weg lohnt.', 4, true),
  ('/galerie/selin-5.jpeg', 'Draußen unterwegs – Bewegung, frische Luft und ein ausgeglichener Hund gehören für mich zusammen.', 5, true),
  ('/galerie/morpheus-meer.jpeg', 'Am Meer mit fast acht Jahren. Ich koche bis heute für ihn – aus Überzeugung, nicht aus Notwendigkeit.', 6, true)
on conflict do nothing;
