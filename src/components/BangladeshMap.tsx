"use client";
import { useEffect, useState } from "react";
import { BD_MAP } from "@/data/bdmap";
import { districts as geoDistricts } from "@/data/geo";
import { layoutLabels, type MapLabel } from "@/lib/mapLabels";
import { districtFill, labelColors, type MapMode, type MapTheme } from "@/lib/mapTheme";

const FONT = '"Hind Siliguri", "Noto Sans Bengali", sans-serif';

export default function BangladeshMap({
  eaten,
  visited,
  mode,
  theme,
  selected,
  onSelect,
  showNames = true,
}: {
  eaten: string[];
  visited: string[];
  mode: MapMode;
  theme: MapTheme;
  selected: string | null;
  onSelect: (slug: string) => void;
  showNames?: boolean;
}) {
  const [labels, setLabels] = useState<MapLabel[]>([]);

  // Measure Bangla names with the real font (once it has loaded), then place them.
  useEffect(() => {
    let off = false;
    const run = () => {
      if (off) return;
      const c = document.createElement("canvas").getContext("2d")!;
      c.font = `600 100px ${FONT}`;
      setLabels(layoutLabels((t) => c.measureText(t).width / 100));
    };
    const f = document.fonts;
    if (f?.load) f.load('600 16px "Hind Siliguri"', "বাংলা").then(run, run);
    else run();
    return () => {
      off = true;
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${BD_MAP.width} ${BD_MAP.height}`}
        className="mx-auto h-auto w-full min-w-[540px] max-w-xl"
        role="group"
        aria-label="Bangladesh map"
      >
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
        {showNames && (
          <g pointerEvents="none" textAnchor="middle" fontFamily={FONT} fontWeight={600}>
            {labels.map((l) => {
              const c = labelColors(districtFill(l.slug, mode, theme, eaten, visited));
              return (
                <text
                  key={l.slug}
                  x={l.x}
                  y={l.y + l.size * 0.33}
                  fontSize={l.size}
                  fill={c.fill}
                  stroke={c.halo}
                  strokeWidth={l.size * 0.28}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {l.text}
                </text>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
