import { foods } from "@/data/foods";
import { getDistrict } from "@/data/geo";

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;
export const priceLabel = (p: 1 | 2 | 3) => "৳".repeat(p);
export const directionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export type Badge = { id: string; emoji: string; label: string; labelBn: string };

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
/** 37 -> ৩৭ */
export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_DIGITS[+d]);

export function badgesFor(eaten: string[]): Badge[] {
  const out: Badge[] = [];
  const n = eaten.length;
  if (n >= 10) out.push({ id: "explorer", emoji: "🥉", label: "Food Explorer", labelBn: "খাদ্য অন্বেষী" });
  if (n >= 25) out.push({ id: "traveller", emoji: "🥈", label: "Food Traveller", labelBn: "খাদ্য পথিক" });
  if (n >= 50) out.push({ id: "foodie", emoji: "🥇", label: "Bangladesh Foodie", labelBn: "বাংলাদেশি ভোজনরসিক" });
  if (n >= 100) out.push({ id: "master", emoji: "👑", label: "Deshi Food Master", labelBn: "দেশি খাবারের ওস্তাদ" });
  const cat = (c: string) => eaten.filter((s) => foods.find((f) => f.slug === s)?.category === c).length;
  if (cat("sweet") >= 3) out.push({ id: "sweet", emoji: "🍮", label: "Sweet Tooth", labelBn: "মিষ্টিমুখ" });
  if (cat("street") >= 3) out.push({ id: "spice", emoji: "🌶️", label: "Spice Hunter", labelBn: "ঝাল শিকারি" });
  if (cat("fish") >= 2) out.push({ id: "fish", emoji: "🐟", label: "Fish Lover", labelBn: "মাছ-ভাতে বাঙালি" });
  if (cat("tea") >= 2) out.push({ id: "tea", emoji: "☕", label: "Tea Explorer", labelBn: "চা-প্রেমী" });
  const divs = new Set(
    eaten.map((s) => foods.find((f) => f.slug === s)?.originDistrict).map((d) => (d ? getDistrict(d)?.division : undefined)).filter(Boolean)
  );
  if (divs.size >= 8) out.push({ id: "div8", emoji: "🗺️", label: "8 Division Foodie", labelBn: "আট বিভাগের ভোজনরসিক" });
  return out;
}
