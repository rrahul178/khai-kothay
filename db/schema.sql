-- Khai Kothay? PostgreSQL schema (target for Supabase / managed Postgres).
-- The MVP in this repo reads seed data from src/data/*.ts; migrate to this schema when ready.

create table divisions (
  id serial primary key,
  name_bn text not null,
  name_en text not null,
  slug text unique not null
);

create table districts (
  id serial primary key,
  division_id int not null references divisions(id),
  name_bn text not null,
  name_en text not null,
  slug text unique not null,
  latitude numeric(9,6),
  longitude numeric(9,6)
);

create table upazilas (
  id serial primary key,
  district_id int not null references districts(id),
  name_bn text not null,
  name_en text not null,
  slug text unique not null
);

create table food_categories (
  id serial primary key,
  name_bn text not null,
  name_en text not null,
  slug text unique not null
);

create table foods (
  id serial primary key,
  name_bn text not null,
  name_en text not null,
  slug text unique not null,
  description text,
  category_id int references food_categories(id),
  origin_district_id int references districts(id),
  image text
);

create table restaurants (
  id serial primary key,
  name text not null,
  slug text unique not null,
  district_id int not null references districts(id),
  upazila_id int references upazilas(id),
  address text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone text,
  price_range smallint check (price_range between 1 and 3),
  verified boolean not null default false,
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table restaurant_foods (
  restaurant_id int references restaurants(id) on delete cascade,
  food_id int references foods(id) on delete cascade,
  price int,
  primary key (restaurant_id, food_id)
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table reviews (
  id serial primary key,
  user_id uuid references users(id),
  restaurant_id int not null references restaurants(id) on delete cascade,
  food_id int references foods(id),
  taste_rating smallint check (taste_rating between 1 and 5),
  value_rating smallint check (value_rating between 1 and 5),
  service_rating smallint check (service_rating between 1 and 5),
  cleanliness_rating smallint check (cleanliness_rating between 1 and 5),
  comment text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table photos (
  id serial primary key,
  user_id uuid references users(id),
  restaurant_id int references restaurants(id) on delete cascade,
  food_id int references foods(id),
  image text not null,
  status text not null default 'pending'
);

create table user_foods (
  user_id uuid references users(id) on delete cascade,
  food_id int references foods(id) on delete cascade,
  tried_date date default current_date,
  primary key (user_id, food_id)
);

create index on restaurants (district_id);
create index on restaurants (latitude, longitude);
create index on foods (origin_district_id);
