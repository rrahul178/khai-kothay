import { BD_MAP } from "@/data/bdmap";
import { getDistrict } from "@/data/geo";

export type MapLabel = { slug: string; text: string; x: number; y: number; size: number };

type Rect = { x0: number; y0: number; x1: number; y1: number };
const overlap = (a: Rect, b: Rect) => {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  return w > 0 && h > 0 ? w * h : 0;
};

/**
 * Places a Bangla name inside every district. Anchor = the roomiest point of the district (precomputed in bdmap).
 * Font size follows the free width there; names that would collide with an earlier one are nudged, then shrunk.
 * Units are map units (BD_MAP.width x BD_MAP.height). `unitWidth(text)` = text width at a 1px font.
 */
export function layoutLabels(unitWidth: (text: string) => number, opts: { min?: number; max?: number } = {}): MapLabel[] {
  const MIN = opts.min ?? 6.5;
  const MAX = opts.max ?? 13;
  const items = BD_MAP.districts
    .map((d) => {
      const text = getDistrict(d.slug)?.nameBn ?? "";
      return { d, text, u: unitWidth(text) };
    })
    .sort((a, b) => b.d.lw * b.d.lh - a.d.lw * a.d.lh);

  const placed: Rect[] = [];
  const out: MapLabel[] = [];
  const offsets: [number, number][] = [[0, 0], [0, -0.9], [0, 0.9], [-0.55, 0], [0.55, 0], [-0.55, -0.9], [0.55, -0.9], [-0.55, 0.9], [0.55, 0.9], [0, -1.8], [0, 1.8]];

  for (const { d, text, u } of items) {
    let size = Math.max(MIN, Math.min(MAX, (d.lw * 1.1) / u, d.lh * 0.95));
    let best: { rect: Rect; x: number; y: number; cost: number } | null = null;
    for (let attempt = 0; attempt < 6; attempt++) {
      const w = u * size;
      const h = size * 1.05;
      for (const [ox, oy] of offsets) {
        const x = Math.min(Math.max(d.lx + ox * w, w / 2 + 1), BD_MAP.width - w / 2 - 1);
        const y = Math.min(Math.max(d.ly + oy * h, h / 2 + 1), BD_MAP.height - h / 2 - 1);
        const rect = { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
        const padded = { x0: rect.x0 - 1.2, y0: rect.y0 - 0.6, x1: rect.x1 + 1.2, y1: rect.y1 + 0.6 };
        const cost = placed.reduce((s, p) => s + overlap(padded, p), 0);
        const penalty = cost + (ox || oy ? 0.5 : 0);
        if (!best || penalty < best.cost) best = { rect, x, y, cost: penalty };
        if (cost === 0 && !ox && !oy) break;
      }
      if (best && best.cost <= 0.5) break;
      if (size <= MIN) break;
      size = Math.max(MIN, size * 0.88);
      best = null;
    }
    if (!best) continue;
    placed.push(best.rect);
    out.push({ slug: d.slug, text, x: best.x, y: best.y, size });
  }
  return out;
}
