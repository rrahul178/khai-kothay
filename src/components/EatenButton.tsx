"use client";
import { useLocalList } from "@/lib/useLocalList";

export function EatenButton({ slug }: { slug: string }) {
  const { has, toggle } = useLocalList("kk:eaten");
  const on = has(slug);
  return (
    <button onClick={() => toggle(slug)} className={on ? "btn" : "btn-ghost"}>
      {on ? "✅ আমি খেয়েছি" : "🍴 আমি এটা খেয়েছি"}
    </button>
  );
}

export function SaveButton({ slug }: { slug: string }) {
  const { has, toggle } = useLocalList("kk:saved");
  const on = has(slug);
  return (
    <button onClick={() => toggle(slug)} className="btn-ghost">
      {on ? "❤️ Saved" : "🤍 Save"}
    </button>
  );
}
