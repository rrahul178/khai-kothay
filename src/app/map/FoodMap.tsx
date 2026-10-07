"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { categories, foods, type Category } from "@/data/foods";
import { districts, type District } from "@/data/geo";

export default function FoodMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [layer, setLayer] = useState<Category | "all">("all");
  const [active, setActive] = useState<District | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      center: [90.35, 23.8],
      zoom: 6.2,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
    });
    const markers: maplibregl.Marker[] = [];
    districts.forEach((d) => {
      const local = foods.filter((f) => f.originDistrict === d.slug && (layer === "all" || f.category === layer));
      if (!local.length) return;
      const el = document.createElement("button");
      el.textContent = "📍";
      el.style.fontSize = "22px";
      el.onclick = () => setActive(d);
      markers.push(new maplibregl.Marker({ element: el }).setLngLat([d.lng, d.lat]).addTo(map));
    });
    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
    };
  }, [layer]);

  const local = active ? foods.filter((f) => f.originDistrict === active.slug && (layer === "all" || f.category === layer)) : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setLayer("all")} className={layer === "all" ? "btn" : "btn-ghost"}>সব</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setLayer(c.id)} className={layer === c.id ? "btn" : "btn-ghost"}>{c.emoji} {c.labelEn}</button>
        ))}
      </div>
      <div ref={ref} className="h-[460px] w-full overflow-hidden rounded-2xl border border-stone-200" />
      {active && (
        <div className="card">
          <div className="font-bold">📍 {active.nameBn} · Famous for</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {local.map((f) => <li key={f.slug}><Link className="text-brand" href={`/food/${f.slug}`}>{f.nameBn} · {f.nameEn}</Link></li>)}
          </ul>
          <Link className="btn mt-3" href={`/district/${active.slug}`}>জেলার পাতা →</Link>
        </div>
      )}
    </div>
  );
}
