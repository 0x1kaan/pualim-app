-- Pualım RLS Policies
-- Migration 002: Row Level Security

-- Enable RLS on all tables
alter table public.cafes enable row level security;
alter table public.customers enable row level security;
alter table public.pending_stamps enable row level security;
alter table public.stamps enable row level security;
alter table public.rewards enable row level security;
alter table public.campaigns enable row level security;
alter table public.notifications enable row level security;
alter table public.otps enable row level security;

-- ============================================================
-- CAFES POLICIES
-- ============================================================

-- Cafe owners can manage their own cafes
create policy "cafe_owner_select" on public.cafes
  for select using (owner_id = auth.uid());

create policy "cafe_owner_insert" on public.cafes
  for insert with check (owner_id = auth.uid());

create policy "cafe_owner_update" on public.cafes
  for update using (owner_id = auth.uid());

-- Public can read cafe by slug (for customer card page)
create policy "cafe_public_read_by_slug" on public.cafes
  for select using (is_active = true);

-- ============================================================
-- CUSTOMERS POLICIES
-- ============================================================

-- Cafe owners can manage customers in their cafes
create policy "customers_owner_all" on public.customers
  for all using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- Allow anonymous insert for new customer registration (via API with service role)
-- Handled via service_role in API routes

-- ============================================================
-- PENDING STAMPS POLICIES
-- ============================================================

-- Cafe owners can see and manage pending stamps for their cafes
create policy "pending_stamps_owner_all" on public.pending_stamps
  for all using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- ============================================================
-- STAMPS POLICIES
-- ============================================================

create policy "stamps_owner_select" on public.stamps
  for select using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

create policy "stamps_owner_insert" on public.stamps
  for insert with check (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- ============================================================
-- REWARDS POLICIES
-- ============================================================

create policy "rewards_owner_all" on public.rewards
  for all using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- ============================================================
-- CAMPAIGNS POLICIES
-- ============================================================

create policy "campaigns_owner_all" on public.campaigns
  for all using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================

create policy "notifications_owner_select" on public.notifications
  for select using (
    cafe_id in (
      select id from public.cafes where owner_id = auth.uid()
    )
  );

-- ============================================================
-- OTP POLICIES
-- ============================================================

-- OTPs managed via service_role only (no direct user access)
create policy "otps_service_only" on public.otps
  for all using (false);
