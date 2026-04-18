-- ============================================================
-- Himbalin Enterprise — Admin Setup SQL
-- Run this in Supabase → SQL Editor
-- ============================================================

-- ── STEP 1: Admin Users Table ──────────────────────────────
-- Links Supabase Auth users to admin role.
-- Only users in this table can access admin features.

create table if not exists admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text default 'admin',        -- 'admin' | 'super_admin'
  created_at  timestamptz default now(),
  last_sign_in timestamptz
);

-- ── STEP 2: Enable RLS on admin_users ──────────────────────
alter table admin_users enable row level security;

-- Only admins can read the admin_users table (themselves)
create policy "Admins can view admin list"
  on admin_users for select
  using (auth.uid() = id);

-- ── STEP 3: Admin-only policies on all other tables ────────

-- Products: admins can INSERT, UPDATE, DELETE
create policy "Admins can insert products"
  on products for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admins can update products"
  on products for update
  using (auth.uid() in (select id from admin_users));

create policy "Admins can delete products"
  on products for delete
  using (auth.uid() in (select id from admin_users));

-- Orders: admins can read ALL orders and update status
create policy "Admins can read all orders"
  on orders for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update order status"
  on orders for update
  using (auth.uid() in (select id from admin_users));

create policy "Admins can delete orders"
  on orders for delete
  using (auth.uid() in (select id from admin_users));

-- Customers: admins can read all
create policy "Admins can read customers"
  on customers for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update customers"
  on customers for update
  using (auth.uid() in (select id from admin_users));

-- Contact messages: admins can read and mark as read
create policy "Admins can read contact messages"
  on contact_messages for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update contact messages"
  on contact_messages for update
  using (auth.uid() in (select id from admin_users));

-- Subscribers: admins can read
create policy "Admins can read subscribers"
  on subscribers for select
  using (auth.uid() in (select id from admin_users));


-- ── STEP 4: Helper function (is_admin) ─────────────────────
-- Use this function in RLS policies for cleaner syntax
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql security definer;


-- ── STEP 5: Auto-track last sign-in ────────────────────────
-- Updates last_sign_in timestamp whenever admin logs in
create or replace function handle_admin_sign_in()
returns trigger as $$
begin
  update admin_users
  set last_sign_in = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;


-- ── STEP 6: Create your first admin user ───────────────────
-- After running the above, go to:
--   Supabase Dashboard → Authentication → Users → Add User
-- Create your admin email + password.
-- Then run this (replace with your real user ID and email):

-- insert into admin_users (id, email, full_name, role)
-- values (
--   'paste-your-auth-user-uuid-here',
--   'your-admin@email.com',
--   'Your Name',
--   'super_admin'
-- );
