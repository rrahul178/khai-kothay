"use client";
import { useState } from "react";
import { categories, type Food } from "@/data/foods";

const tint: Record<string, string> = {
  rice: "from-amber-200 to-orange-300",
  meat: "from-red-200 to-rose-300",
  sweet: "from-pink-200 to-fuchsia-300",
  fish: "from-sky-200 to-cyan-300",
  tea: "from-emerald-200 to-teal-300",
  street: "from-yellow-200 to-lime-300",
  seasonal: "from-lime-200 to-green-300",
};

// Shows the food's photo when one is set; otherwise an illustrated category tile.
export default function FoodImage({ food, className = "", big = false }: { food: Food; className?: string; big?: boolean }) {
  const [failed, setFailed] = useState(false);
  const cat = categories.find((c) => c.id === food.category);
  if (food.image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={food.image} alt={food.nameEn} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
    );
  }
  return (
    <div
      role="img"
      aria-label={food.nameEn}
      className={`flex flex-col items-center justify-center bg-gradient-to-br ${tint[food.category] ?? "from-stone-200 to-stone-300"} ${className}`}
    >
      <span className={big ? "text-7xl" : "text-4xl"}>{cat?.emoji}</span>
    </div>
  );
}
