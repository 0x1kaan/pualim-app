-- Pualım Database Schema
-- Migration 001: Initial Schema

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";

-- ============================================================
-- CAFES TABLE
-- ============================================================
create table public.cafes (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  slug            text not null unique,
  description     text,
  logo_url        text,
  primary_color   text not null default '#6366F1',
  stamps_required integer not null default 10,
  plan            text not null default 'starter' check (plan in ('starter', 'pro', 'chain')),
  plan_expires_at timestamptz,
  whatsapp_enabled boolean not null default false,
  sms_enabled     boolean not null default true,
  email_enabled   boolean not null default true,
  reward_title    text not null default 'Ücretsiz İçecek',
  reward_description text,
  address         text,
  phone           text,
  instagram       text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_cafes_owner_id on public.cafes(owner_id);
create index idx_cafes_slug on public.cafes(slug);

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
create table public.customers (
  id                uuid primary key default uuid_generate_v4(),
  cafe_id           uuid not null references public.cafes(id) on delete cascade,
  phone             text not null,
  name              text,
  birthday          date,
  total_stamps      integer not null default 0,
  current_stamps    integer not null default 0,
  visit_count       integer not null default 0,
  tag               text not null default 'new' check (tag in ('vip', 'loyal', 'new', 'at_risk', 'lost')),
  last_visit_at     timestamptz,
  notes             text,
  whatsapp_consent  boolean not null default false,
  sms_consent       boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(cafe_id, phone)
);

create index idx_customers_cafe_id on public.customers(cafe_id);
create index idx_customers_tag on public.customers(cafe_id, tag);
create index idx_customers_last_visit on public.customers(cafe_id, last_visit_at);

-- ============================================================
-- PENDING STAMPS TABLE (before approval)
-- ============================================================
create table public.pending_stamps (
  id          uuid primary key default uuid_generate_v4(),
  cafe_id     uuid not null references public.cafes(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  phone       text not null,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '5 minutes')
);

create index idx_pending_stamps_cafe_id on public.pending_stamps(cafe_id, status);
create index idx_pending_stamps_created_at on public.pending_stamps(created_at);

-- ============================================================
-- STAMPS TABLE (approved stamps)
-- ============================================================
create table public.stamps (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  cafe_id     uuid not null references public.cafes(id) on delete cascade,
  approved_by uuid references auth.users(id),
  approved_at timestamptz not null default now(),
  campaign_id uuid,
  multiplier  integer not null default 1,
  note        text,
  created_at  timestamptz not null default now()
);

create index idx_stamps_customer_id on public.stamps(customer_id);
create index idx_stamps_cafe_id on public.stamps(cafe_id, approved_at desc);

-- ============================================================
-- REWARDS TABLE
-- ============================================================
create table public.rewards (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  cafe_id     uuid not null references public.cafes(id) on delete cascade,
  earned_at   timestamptz not null default now(),
  redeemed_at timestamptz,
  expires_at  timestamptz default (now() + interval '90 days'),
  status      text not null default 'available' check (status in ('available', 'redeemed', 'expired')),
  created_at  timestamptz not null default now()
);

create index idx_rewards_customer_id on public.rewards(customer_id, status);
create index idx_rewards_cafe_id on public.rewards(cafe_id, status);

-- ============================================================
-- CAMPAIGNS TABLE
-- ============================================================
create table public.campaigns (
  id                  uuid primary key default uuid_generate_v4(),
  cafe_id             uuid not null references public.cafes(id) on delete cascade,
  name                text not null,
  description         text,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  active_days         integer[] default '{0,1,2,3,4,5,6}',
  active_hours_start  integer default 0,
  active_hours_end    integer default 23,
  stamp_multiplier    integer not null default 2,
  bonus_stamps        integer not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_campaigns_cafe_id on public.campaigns(cafe_id, is_active);

-- Add campaign FK to stamps
alter table public.stamps
  add constraint fk_stamps_campaign
  foreign key (campaign_id) references public.campaigns(id) on delete set null;

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
create table public.notifications (
  id            uuid primary key default uuid_generate_v4(),
  customer_id   uuid not null references public.customers(id) on delete cascade,
  cafe_id       uuid not null references public.cafes(id) on delete cascade,
  channel       text not null check (channel in ('whatsapp', 'sms', 'email')),
  type          text not null check (type in ('stamp', 'reward', 'campaign', 'winback', 'birthday', 'otp')),
  message       text not null,
  status        text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error_message text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index idx_notifications_cafe_id on public.notifications(cafe_id, created_at desc);
create index idx_notifications_customer_id on public.notifications(customer_id, created_at desc);

-- ============================================================
-- OTP TABLE
-- ============================================================
create table public.otps (
  id          uuid primary key default uuid_generate_v4(),
  phone       text not null,
  cafe_id     uuid not null references public.cafes(id) on delete cascade,
  code        text not null,
  used        boolean not null default false,
  expires_at  timestamptz not null default (now() + interval '10 minutes'),
  created_at  timestamptz not null default now()
);

create index idx_otps_phone_cafe on public.otps(phone, cafe_id, used);
