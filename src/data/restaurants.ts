export type Restaurant = {
  slug: string;
  name: string;
  district: string; // district slug
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  priceRange: 1 | 2 | 3; // ৳ / ৳৳ / ৳৳৳
  verified: boolean;
  featured: boolean;
  demo: boolean; // true = placeholder listing, NOT a real business
  menu: { foodSlug: string; price: number }[];
  rating: number;
};

// IMPORTANT: these are clearly-labelled DEMO listings so the UI has something to show.
// Replace with real, verified listings (via the "Add a place" flow + admin approval).
export const restaurants: Restaurant[] = [
  { slug: "demo-kacchi-house-dhaka", name: "Demo Kacchi House", district: "dhaka-district", address: "Sample address, Old Dhaka", lat: 23.7104, lng: 90.4074, priceRange: 2, verified: false, featured: true, demo: true, rating: 4.6, menu: [{ foodSlug: "kacchi-biryani", price: 320 }, { foodSlug: "borhani", price: 60 }] },
  { slug: "demo-bakarkhani-corner-dhaka", name: "Demo Bakarkhani Corner", district: "dhaka-district", address: "Sample address, Old Dhaka", lat: 23.7126, lng: 90.4086, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.4, menu: [{ foodSlug: "bakarkhani", price: 40 }] },
  { slug: "demo-street-snacks-dhaka", name: "Demo Street Snacks", district: "dhaka-district", address: "Sample address, Dhanmondi", lat: 23.7461, lng: 90.376, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.3, menu: [{ foodSlug: "fuchka", price: 60 }, { foodSlug: "chotpoti", price: 70 }, { foodSlug: "jhalmuri", price: 30 }] },
  { slug: "demo-doi-ghor-bogura", name: "Demo Doi Ghor", district: "bogura", address: "Sample address, Bogura town", lat: 24.8465, lng: 89.3773, priceRange: 1, verified: false, featured: true, demo: true, rating: 4.7, menu: [{ foodSlug: "bogura-mishti-doi", price: 150 }] },
  { slug: "demo-sweets-tangail", name: "Demo Sweets Tangail", district: "tangail", address: "Sample address, Tangail town", lat: 24.2513, lng: 89.9167, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.5, menu: [{ foodSlug: "porabari-chomchom", price: 120 }] },
  { slug: "demo-roshmalai-cumilla", name: "Demo Roshmalai Shop", district: "cumilla", address: "Sample address, Cumilla town", lat: 23.4607, lng: 91.1809, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.6, menu: [{ foodSlug: "cumilla-roshmalai", price: 140 }] },
  { slug: "demo-mezban-hotel-chattogram", name: "Demo Mezban Hotel", district: "chattogram-district", address: "Sample address, Chattogram", lat: 22.3569, lng: 91.7832, priceRange: 2, verified: false, featured: false, demo: true, rating: 4.4, menu: [{ foodSlug: "chattogram-kala-bhuna", price: 260 }, { foodSlug: "mezbani-beef", price: 240 }] },
  { slug: "demo-hotel-kishoreganj", name: "Demo Hotel & Restaurant", district: "kishoreganj", address: "Sample address, Kishoreganj town", lat: 24.4331, lng: 90.7829, priceRange: 1, verified: false, featured: true, demo: true, rating: 4.2, menu: [{ foodSlug: "kishoreganj-beef-rice", price: 180 }, { foodSlug: "bhorta-rice", price: 90 }] },
  { slug: "demo-sweets-kishoreganj", name: "Demo Doi & Sweets", district: "kishoreganj", address: "Sample address, Kishoreganj town", lat: 24.4352, lng: 90.7801, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.3, menu: [{ foodSlug: "kishoreganj-doi", price: 100 }] },
  { slug: "demo-tea-stall-kishoreganj", name: "Demo Tea Stall", district: "kishoreganj", address: "Sample address, Kishoreganj town", lat: 24.4309, lng: 90.7855, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.1, menu: [{ foodSlug: "sylhet-seven-color-tea", price: 40 }] },
  { slug: "demo-tea-cabin-sreemangal", name: "Demo Tea Cabin", district: "moulvibazar", address: "Sample address, Sreemangal", lat: 24.3065, lng: 91.7296, priceRange: 1, verified: false, featured: false, demo: true, rating: 4.6, menu: [{ foodSlug: "sylhet-seven-color-tea", price: 80 }] },
  { slug: "demo-ilish-ghar-barishal", name: "Demo Ilish Ghar", district: "barishal-district", address: "Sample address, Barishal", lat: 22.701, lng: 90.3535, priceRange: 2, verified: false, featured: false, demo: true, rating: 4.5, menu: [{ foodSlug: "barishal-ilish", price: 450 }] },
];

export const getRestaurant = (slug: string) => restaurants.find((r) => r.slug === slug);
