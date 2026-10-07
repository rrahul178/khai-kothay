"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { foods } from "@/data/foods";
import { useLocalList } from "@/lib/useLocalList";
import { badgesFor } from "@/lib/utils";
import { divisions, districts } from "@/data/geo";

export default function Journey() {
  const { items: eaten, toggle } = useLocalList("kk:eaten");
  const canvas = useRef<HTMLCanvasElement>(null);
  const total = foods.length; // grows as you add more foods (goal: 100)
  const badges = badgesFor(eaten);
  const explored = new Set(eaten.map((s) => foods.find((f) => f.slug === s)?.originDistrict).filter(Boolean)).size;

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, "#006a4e");
    grad.addColorStop(1, "#004d38");
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#f42a41";
    g.beginPath();
    g.arc(c.width / 2, 330, 90, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fff";
    g.textAlign = "center";
    g.font = "bold 54px sans-serif";
    g.fillText("MY BANGLADESH", c.width / 2, 130);
    g.fillText("FOOD JOURNEY", c.width / 2, 195);
    g.font = "bold 80px sans-serif";
    g.fillText(`${eaten.length}/${total}`, c.width / 2, 355);
    g.font = "32px sans-serif";
    g.fillText(`I've tasted ${eaten.length} of Bangladesh's iconic foods`, c.width / 2, 490);
    g.fillText(`${explored} districts explored`, c.width / 2, 540);
    g.font = "40px sans-serif";
    g.fillText(badges.map((b) => b.emoji).join(" ") || "🍴", c.width / 2, 620);
    g.font = "bold 44px sans-serif";
    g.fillText("Khai Kothay? 🇧🇩", c.width / 2, 760);
    g.font = "26px sans-serif";
    g.fillText("Share your food journey", c.width / 2, 805);
  }, [eaten, badges, total, explored]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "my-bangladesh-food-journey.png";
    a.href = canvas.current!.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">🇧🇩 My Bangladesh Food Journey</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <canvas ref={canvas} width={720} height={860} className="w-full rounded-2xl shadow" />
          <button onClick={download} className="btn">⬇️ Download as image</button>
          <p className="text-xs text-stone-500">{divisions.length} divisions · {districts.length} districts · Progress is saved on this device.</p>
        </div>
        <div className="space-y-4">
          <div className="card">
            <div className="font-bold">Badges</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.length ? badges.map((b) => <span key={b.id} className="chip">{b.emoji} {b.label}</span>) : <span className="text-sm text-stone-500">১০টি খাবারে টিক দিলে প্রথম badge পাবেন।</span>}
            </div>
          </div>
          <div className="card">
            <div className="mb-2 font-bold">আমি এগুলো খেয়েছি ({eaten.length}/{total})</div>
            <ul className="max-h-[420px] space-y-1 overflow-y-auto text-sm">
              {foods.map((f) => (
                <li key={f.slug}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={eaten.includes(f.slug)} onChange={() => toggle(f.slug)} />
                    <Link href={`/food/${f.slug}`} className="hover:text-brand">{f.nameBn} · {f.nameEn}</Link>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
