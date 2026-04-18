-- ============================================================
-- Himbalin Enterprise — Supabase SQL Setup
-- Run each block in Supabase → SQL Editor
-- ============================================================

-- 1. PRODUCTS
-- ============================================================
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  price         numeric(10,2) not null,
  old_price     numeric(10,2),
  category      text,
  material      text,
  availability  text default 'In Stock',
  badge         text,
  rating        numeric(2,1) default 5.0,
  reviews       integer default 0,
  image_url     text,
  created_at    timestamptz default now()
);

-- 2. ORDERS
-- ============================================================
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  customer_email  text not null,
  status          text default 'Pending',
  total           numeric(10,2) not null,
  items           jsonb,
  created_at      timestamptz default now()
);

-- 3. CUSTOMERS
-- ============================================================
create table if not exists customers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  phone         text,
  location      text,
  total_orders  integer default 0,
  total_spent   numeric(10,2) default 0,
  created_at    timestamptz default now()
);

-- 4. NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists subscribers (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  subscribed_at  timestamptz default now()
);

-- 5. CONTACT MESSAGES
-- ============================================================
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);


-- ============================================================
-- ROW LEVEL SECURITY  (run separately after tables are created)
-- ============================================================

alter table products        enable row level security;
alter table orders          enable row level security;
alter table customers       enable row level security;
alter table subscribers     enable row level security;
alter table contact_messages enable row level security;

-- Products: public read (shop page)
create policy "Public can read products"
  on products for select using (true);

-- Subscribers: anyone can insert their email
create policy "Anyone can subscribe"
  on subscribers for insert with check (true);

-- Contact: anyone can submit a message
create policy "Anyone can send a message"
  on contact_messages for insert with check (true);

-- Orders: anyone can place an order (frontend checkout)
create policy "Anyone can place an order"
  on orders for insert with check (true);


-- ============================================================
-- SEED PRODUCTS  (run after table + RLS created)
-- ============================================================

insert into products
  (name, description, price, category, material, availability, badge, rating, reviews, image_url)
values
  ('Artisan Ceramic Vase',    'Hand-thrown neutral tones',           85,    'Home Decor',     'Ceramic', 'In Stock',        'NEW ARRIVAL',     4.9, 128, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'),
  ('Linear Brass Lamp',       'Brushed finish, LED dimming',         120,   'Home Decor',     'Brass',   'In Stock',        null,              4.8,  94, 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800'),
  ('Organic Linen Set',       'Breathable, eco-friendly',            195,   'Home Decor',     'Linen',   'In Stock',        'SALE -20%',       4.7, 210, 'https://images.unsplash.com/photo-1629079448225-23fa54e5c54d?w=800'),
  ('Oak Horizon Table',       'Solid white oak construction',        450,   'Furniture',      'Oak',     'In Stock',        null,              5.0,  56, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'),
  ('Nova Lounge Chair',       'Premium top-grain leather',           890,   'Furniture',      'Linen',   'Express Delivery',null,              4.9, 342, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'),
  ('Abstract Flow Canvas',    'Original limited edition',            150,   'Home Decor',     'Linen',   'In Stock',        null,              4.6,  45, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800'),
  ('Rattan Pendant Light',    'Natural textures for warmth',         115,   'Home Decor',     'Oak',     'In Stock',        null,              4.8,  72, 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800'),
  ('Executive Glass Desk',    'Tempered glass, chrome accents',     1250,   'Furniture',      'Brass',   'Express Delivery','LIMITED EDITION', 5.0,  15, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'),
  ('Persian Vintage Rug',     'Hand-knotted wool, intricate pattern',1200,  'Floor & Outdoor','Linen',   'In Stock',        'NEW ARRIVAL',     4.9,  84, 'https://images.unsplash.com/photo-1590124231662-7901da37ebda?w=800'),
  ('Premium Landscape Turf',  'High density, realistic soft touch',   12,   'Floor & Outdoor','Linen',   'Express Delivery', null,             4.9, 312, 'https://images.unsplash.com/photo-1596788062829-41d3ceec2f9d?w=800'),
  ('Ergonomic Mesh Chair',    'Lumbar support, adjustable arms',     350,   'Furniture',      'Brass',   'In Stock',        'POPULAR',         4.8, 215, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800'),
  ('Minimalist Shag Rug',     'Ultra-soft deep pile comfort',        340,   'Floor & Outdoor','Linen',   'In Stock',        null,              5.0,  56, 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800');
