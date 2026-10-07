"use client";
import { BD_MAP } from "@/data/bdmap";
import { foods } from "@/data/foods";
import { districts as geoDistricts } from "@/data/geo";

// District fill by progress: grey = no foods listed yet, amber = foods to try, green shades = foods tried.
export function districtFill(slug: string, eaten: string[]) {
  const here = foods.filter((f) => f.originDistrict === slug);
  if (!here.length) return "#e7e5e4";
  const done = here.filter((f) => eaten.includes(f.slug)).length;
  if (!done) return "#fde68a";
  const t = done / here.length;
  return t >= 1 ? "#006a4e" : t >= 0.5 ? "#2f9e7a" : "#7cc9ad";
}

export default function BangladeshMap({
  eaten,
  selected,
  onSelect,
}: {
  eaten: string[];
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  const centroid = (slug: string) => {
    const g = geoDistricts.find((d) => d.slug === slug)!;
    const x = ((g.lng - BD_MAP.minLng) / (BD_MAP.maxLng - BD_MAP.minLng)) * BD_MAP.width;
    const y = ((BD_MAP.maxLat - g.lat) / (BD_MAP.maxLat - BD_MAP.minLat)) * BD_MAP.height;
    return { x, y };
  };
  const withFoods = new Set(foods.map((f) => f.originDistrict));

  return (
    <svg
      viewBox={`0 0 ${BD_MAP.width} ${BD_MAP.height}`}
      className="mx-auto h-auto w-full max-w-md drop-shadow-sm"
      role="group"
      aria-label="Bangladesh food map"
    >
      <g>
        {BD_MAP.districts.map((d) => {
          const isSel = selected === d.slug;
          return (
            <path
              key={d.slug}
              d={d.d}
              fill={districtFill(d.slug, eaten)}
              stroke={isSel ? "#f42a41" : "#ffffff"}
              strokeWidth={isSel ? 2 : 0.7}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => onSelect(d.slug)}
            >
              <title>{geoDistricts.find((g) => g.slug === d.slug)?.nameBn}</title>
            </path>
          );
        })}
      </g>
      <g pointerEvents="none">
        {BD_MAP.divisions.map((d) => (
          <path key={d.slug} d={d.d} fill="none" stroke="#004d38" strokeWidth={1.6} strokeLinejoin="round" />
        ))}
      </g>
      <g pointerEvents="none" fontSize="10" fill="#1c1917" textAnchor="middle">
        {geoDistricts
          .filter((d) => withFoods.has(d.slug))
          .map((d) => {
            const { x, y } = centroid(d.slug);
            return <text key={d.slug} x={x} y={y + 3} stroke="#fff" strokeWidth={2.5} paintOrder="stroke">{d.nameBn}</text>;
          })}
      </g>
    </svg>
  );
}
