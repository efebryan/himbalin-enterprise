-- ============================================================
-- Himbalin Enterprise — Notifications Database Setup
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Create Notifications Table
-- ============================================================
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  message     text not null,
  type        text not null, -- 'order' | 'contact' | 'subscriber' | 'system'
  read        boolean default false,
  link        text, -- Route path to redirect when clicked
  created_at  timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
-- ============================================================
alter table notifications enable row level security;

-- Admins can view all notifications
create policy "Admins can view notifications"
  on notifications for select
  using (is_admin());

-- Admins can update notifications (e.g. mark as read)
create policy "Admins can update notifications"
  on notifications for update
  using (is_admin());

-- Admins can delete notifications
create policy "Admins can delete notifications"
  on notifications for delete
  using (is_admin());


-- 3. Automatic Notification Triggers
-- ============================================================

-- Trigger function for new orders
create or replace function handle_new_order_notification()
returns trigger as $$
begin
  insert into notifications (title, message, type, link)
  values (
    'New Order Placed',
    'Order #' || substring(new.id::text, 1, 8) || ' placed by ' || new.customer_name || ' for ' || '₦' || new.total::text,
    'order',
    '/admin/orders'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to orders table
drop trigger if exists on_new_order_notification on orders;
create trigger on_new_order_notification
  after insert on orders
  for each row execute procedure handle_new_order_notification();


-- Trigger function for new contact messages
create or replace function handle_new_contact_notification()
returns trigger as $$
begin
  insert into notifications (title, message, type, link)
  values (
    'New Inquiry Received',
    'New message from ' || new.name || ': "' || substring(new.subject, 1, 30) || '..."',
    'contact',
    '/admin/reviews'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to contact_messages table
drop trigger if exists on_new_contact_notification on contact_messages;
create trigger on_new_contact_notification
  after insert on contact_messages
  for each row execute procedure handle_new_contact_notification();


-- Trigger function for new newsletter subscriptions
create or replace function handle_new_subscriber_notification()
returns trigger as $$
begin
  insert into notifications (title, message, type, link)
  values (
    'New Newsletter Subscriber',
    new.email || ' subscribed to the newsletter.',
    'subscriber',
    '/admin/analytics'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to subscribers table
drop trigger if exists on_new_subscriber_notification on subscribers;
create trigger on_new_subscriber_notification
  after insert on subscribers
  for each row execute procedure handle_new_subscriber_notification();


-- 4. Enable Supabase Realtime for Notifications
-- ============================================================
-- Add the table to the supabase_realtime publication to enable live updates
alter publication supabase_realtime add table notifications;
