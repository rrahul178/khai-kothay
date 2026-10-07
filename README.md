# Khai Kothay? 🇧🇩

**বাংলাদেশের খাবার, কোথায় পাবেন?** — a Bangladesh-first food discovery platform (MVP).

Core loop: find a food → see where to eat it → mark "আমি খেয়েছি" → download a shareable food-journey card.

## Features in this MVP

- Home with search (food / district / restaurant, Bangla + English) and category chips
- 8 divisions and 64 districts, with SEO-friendly pages at `/district/[slug]`
- Food pages (`/food/[slug]`) with "Where to eat" table, Directions, Save, "I've eaten this"
- Restaurant pages (`/restaurant/[slug]`) with menu and directions
- Near Me (browser geolocation, distance and price filters)
- Food Map (MapLibre + OpenStreetMap tiles) with category layers
- My Journey: tick foods, earn badges, download a share card as PNG
- Add a Place form (saved locally as "pending verification" until a backend exists)
- No login required; progress is stored in `localStorage`

## Not in this MVP (by design)

Native apps, AI assistant, delivery, payments, reservations, reviews backend, admin panel.
See `db/schema.sql` for the PostgreSQL schema to move to when you add a backend (Supabase or managed Postgres).

## Data

- `src/data/geo.ts`: divisions and districts (coordinates are approximate)
- `src/data/foods.ts`: iconic regional foods (descriptions are brief; verify and expand)
- `src/data/restaurants.ts`: **demo listings only**, clearly flagged `demo: true`. Replace with real, verified places.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Next steps

1. Replace demo restaurants with real listings; grow to ~100-200 foods.
2. Add Postgres (`db/schema.sql`), auth (Google + email), and API routes for reviews, photos and submissions.
3. Admin panel for moderation and featured listings.
4. Upazila level data and "open now" filter.
