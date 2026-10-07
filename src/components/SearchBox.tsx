"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { foods } from "@/data/foods";
import { districts } from "@/data/geo";
import { restaurants } from "@/data/restaurants";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const hit = (...v: string[]) => v.some((x) => x.toLowerCase().includes(s));
    return [
      ...foods.filter((f) => hit(f.nameBn, f.nameEn)).map((f) => ({ href: `/food/${f.slug}`, label: `🍽️ ${f.nameBn} · ${f.nameEn}` })),
      ...districts.filter((d) => hit(d.nameBn, d.nameEn)).map((d) => ({ href: `/district/${d.slug}`, label: `📍 ${d.nameBn} · ${d.nameEn}` })),
      ...restaurants.filter((r) => hit(r.name)).map((r) => ({ href: `/restaurant/${r.slug}`, label: `🏪 ${r.name}` })),
    ].slice(0, 8);
  }, [q]);
  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Search food, restaurant or location (কাচ্চি, বগুড়া, কিশোরগঞ্জ...)"
        className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-base shadow-sm outline-none focus:border-brand"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block px-4 py-2 text-sm hover:bg-brand-light">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
