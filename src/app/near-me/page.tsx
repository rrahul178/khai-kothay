"use client";
import { useState } from "react";
import Link from "next/link";
import { getFood } from "@/data/foods";
import { restaurants } from "@/data/restaurants";
import { haversineKm, priceLabel } from "@/lib/utils";

export default function NearMe() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState("");
  const [radius, setRadius] = useState(2);
  const [maxPrice, setMaxPrice] = useState<1 | 2 | 3>(3);

  const locate = () => {
    setErr("");
    if (!navigator.geolocation) return setErr("এই browser এ location সাপোর্ট নেই।");
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setErr("Location পাওয়া যায়নি। অনুমতি দিন বা জেলা অনুযায়ী খুঁজুন।")
    );
  };

  const list = pos
    ? restaurants
        .map((r) => ({ r, km: haversineKm(pos, r) }))
        .filter((x) => x.km <= radius && x.r.priceRange <= maxPrice)
        .sort((a, b) => a.km - b.km)
    : [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">📍 Near Me</h1>
      <button onClick={locate} className="btn">আমার location ব্যবহার করুন</button>
      {err && <p className="text-sm text-accent">{err}</p>}
      {pos && (
        <>
          <div className="flex flex-wrap gap-4 text-sm">
            <label>Distance: <select className="rounded border p-1" value={radius} onChange={(e) => setRadius(+e.target.value)}>{[1, 2, 5, 10, 25, 100].map((n) => <option key={n} value={n}>{n} km</option>)}</select></label>
            <label>Max price: <select className="rounded border p-1" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value as 1 | 2 | 3)}><option value={1}>৳</option><option value={2}>৳৳</option><option value={3}>৳৳৳</option></select></label>
          </div>
          <div className="space-y-3">
            {list.map(({ r, km }) => (
              <Link key={r.slug} href={`/restaurant/${r.slug}`} className="card flex items-center justify-between hover:border-brand">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-stone-500">{r.menu.map((m) => getFood(m.foodSlug)?.nameBn).join(" · ")}</div>
                </div>
                <div className="text-right text-sm"><div>{km.toFixed(1)} km</div><div className="text-stone-500">⭐ {r.rating} · {priceLabel(r.priceRange)}</div></div>
              </Link>
            ))}
            {list.length === 0 && <p className="text-stone-500">এই দূরত্বে কিছু পাওয়া যায়নি। দূরত্ব বাড়িয়ে দেখুন।</p>}
          </div>
        </>
      )}
    </div>
  );
}
