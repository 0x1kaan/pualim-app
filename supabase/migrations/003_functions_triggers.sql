-- Pualım Functions & Triggers
-- Migration 003: Business Logic

-- ============================================================
-- UPDATE UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cafes_updated_at
  before update on public.cafes
  for each row execute function public.handle_updated_at();

create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.handle_updated_at();

create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.handle_updated_at();

-- ============================================================
-- UPDATE CUSTOMER STATS AFTER STAMP APPROVED
-- ============================================================
create or replace function public.update_customer_stats_on_stamp()
returns trigger language plpgsql security definer as $$
declare
  v_cafe             public.cafes%rowtype;
  v_current_stamps   integer;
  v_stamps_required  integer;
begin
  -- Get cafe info
  select * into v_cafe from public.cafes where id = new.cafe_id;

  -- Update customer stats
  update public.customers
  set
    total_stamps   = total_stamps + new.multiplier,
    current_stamps = current_stamps + new.multiplier,
    visit_count    = visit_count + 1,
    last_visit_at  = new.approved_at,
    updated_at     = now()
  where id = new.customer_id
  returning current_stamps into v_current_stamps;

  v_stamps_required := v_cafe.stamps_required;

  -- Check if reward should be issued
  if v_current_stamps >= v_stamps_required then
    -- Create reward
    insert into public.rewards (customer_id, cafe_id)
    values (new.customer_id, new.cafe_id);

    -- Reset current stamps (keep remainder)
    update public.customers
    set current_stamps = v_current_stamps - v_stamps_required
    where id = new.customer_id;
  end if;

  return new;
end;
$$;

create trigger on_stamp_approved
  after insert on public.stamps
  for each row execute function public.update_customer_stats_on_stamp();

-- ============================================================
-- AUTO-TAG CUSTOMERS
-- ============================================================
create or replace function public.auto_tag_customers(p_cafe_id uuid default null)
returns void language plpgsql security definer as $$
begin
  update public.customers
  set tag = case
    when visit_count >= 20 and last_visit_at >= now() - interval '30 days' then 'vip'
    when visit_count >= 8  and last_visit_at >= now() - interval '30 days' then 'loyal'
    when last_visit_at >= now() - interval '60 days' or last_visit_at is null then 'new'
    when last_visit_at >= now() - interval '90 days' then 'at_risk'
    else 'lost'
  end
  where (p_cafe_id is null or cafe_id = p_cafe_id);
end;
$$;

-- ============================================================
-- EXPIRE REWARDS
-- ============================================================
create or replace function public.expire_old_rewards()
returns void language plpgsql security definer as $$
begin
  update public.rewards
  set status = 'expired'
  where status = 'available'
    and expires_at < now();
end;
$$;

-- ============================================================
-- EXPIRE OLD PENDING STAMPS
-- ============================================================
create or replace function public.expire_old_pending_stamps()
returns void language plpgsql security definer as $$
begin
  update public.pending_stamps
  set status = 'rejected'
  where status = 'pending'
    and expires_at < now();
end;
$$;

-- ============================================================
-- GET CAFE ANALYTICS SUMMARY
-- ============================================================
create or replace function public.get_cafe_analytics(
  p_cafe_id uuid,
  p_days integer default 30
)
returns json language plpgsql security definer as $$
declare
  v_result json;
begin
  select json_build_object(
    'total_customers',   (select count(*) from public.customers where cafe_id = p_cafe_id),
    'new_customers',     (select count(*) from public.customers where cafe_id = p_cafe_id and created_at >= now() - (p_days || ' days')::interval),
    'total_stamps',      (select count(*) from public.stamps where cafe_id = p_cafe_id and approved_at >= now() - (p_days || ' days')::interval),
    'total_rewards',     (select count(*) from public.rewards where cafe_id = p_cafe_id and earned_at >= now() - (p_days || ' days')::interval),
    'redeemed_rewards',  (select count(*) from public.rewards where cafe_id = p_cafe_id and status = 'redeemed' and redeemed_at >= now() - (p_days || ' days')::interval),
    'vip_count',         (select count(*) from public.customers where cafe_id = p_cafe_id and tag = 'vip'),
    'loyal_count',       (select count(*) from public.customers where cafe_id = p_cafe_id and tag = 'loyal'),
    'at_risk_count',     (select count(*) from public.customers where cafe_id = p_cafe_id and tag = 'at_risk'),
    'lost_count',        (select count(*) from public.customers where cafe_id = p_cafe_id and tag = 'lost'),
    'today_stamps',      (select count(*) from public.stamps where cafe_id = p_cafe_id and approved_at >= current_date),
    'today_customers',   (select count(distinct customer_id) from public.stamps where cafe_id = p_cafe_id and approved_at >= current_date)
  ) into v_result;

  return v_result;
end;
$$;

-- ============================================================
-- CLEANUP OTP TOKENS
-- ============================================================
create or replace function public.cleanup_expired_otps()
returns void language plpgsql security definer as $$
begin
  delete from public.otps
  where expires_at < now() - interval '1 hour';
end;
$$;
