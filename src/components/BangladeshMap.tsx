"use client";
import { BD_MAP } from "@/data/bdmap";
import { foods } from "@/data/foods";
import { districts as geoDistricts } from "@/data/geo";
import { districtFill, type MapMode, type MapTheme } from "@/lib/mapTheme";

export default function BangladeshMap({
  eaten,
  visited,
  mode,
  theme,
  selected,
  onSelect,
}: {
  eaten: string[];
  visited: string[];
  mode: MapMode;
  theme: MapTheme;
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  const withFoods = new Set(foods.map((f) => f.originDistrict));
  const pos = (slug: string) => {
    const g = geoDistricts.find((d) => d.slug === slug)!;
    return {
      x: ((g.lng - BD_MAP.minLng) / (BD_MAP.maxLng - BD_MAP.minLng)) * BD_MAP.width,
      y: ((BD_MAP.maxLat - g.lat) / (BD_MAP.maxLat - BD_MAP.minLat)) * BD_MAP.height,
    };
  };
  const dark = theme.id === "night";

  return (
    <svg viewBox={`0 0 ${BD_MAP.width} ${BD_MAP.height}`} className="mx-auto h-auto w-full max-w-md" role="group" aria-label="Bangladesh map">
      <g>
        {BD_MAP.districts.map((d) => {
          const isSel = selected === d.slug;
          const name = geoDistricts.find((g) => g.slug === d.slug);
          return (
            <path
              key={d.slug}
              d={d.d}
              fill={districtFill(d.slug, mode, theme, eaten, visited)}
              stroke={isSel ? theme.accent : theme.border}
              strokeWidth={isSel ? 2.2 : 0.7}
              tabIndex={0}
              role="button"
              aria-label={name?.nameEn}
              className="cursor-pointer outline-none transition-opacity hover:opacity-75 focus-visible:opacity-75"
              onClick={() => onSelect(d.slug)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(d.slug)}
            >
              <title>{name?.nameBn}</title>
            </path>
          );
        })}
      </g>
      <g pointerEvents="none">
        {BD_MAP.divisions.map((d) => (
          <path key={d.slug} d={d.d} fill="none" stroke={theme.division} strokeWidth={1.6} strokeLinejoin="round" />
        ))}
      </g>
      {mode === "foods" && (
        <g pointerEvents="none" fontSize="10" fill={dark ? "#fafafa" : "#1c1917"} textAnchor="middle">
          {geoDistricts
            .filter((d) => withFoods.has(d.slug))
            .map((d) => {
              const { x, y } = pos(d.slug);
              return (
                <text key={d.slug} x={x} y={y + 3} stroke={dark ? "#18181b" : "#fff"} strokeWidth={2.5} paintOrder="stroke">
                  {d.nameBn}
                </text>
              );
            })}
        </g>
      )}
    </svg>
  );
}
