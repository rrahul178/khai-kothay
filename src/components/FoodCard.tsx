import Link from "next/link";
import { categories, type Food } from "@/data/foods";
import { getDistrict } from "@/data/geo";

export default function FoodCard({ food }: { food: Food }) {
  const cat = categories.find((c) => c.id === food.category);
  const d = getDistrict(food.originDistrict);
  return (
    <Link href={`/food/${food.slug}`} className="card block hover:border-brand">
      <div className="text-3xl">{cat?.emoji}</div>
      <div className="mt-2 font-semibold">{food.nameBn}</div>
      <div className="text-sm text-stone-500">{food.nameEn}</div>
      <div className="mt-2 flex gap-2">
        <span className="chip">{cat?.labelEn}</span>
        {d && <span className="chip">📍 {d.nameEn}</span>}
      </div>
    </Link>
  );
}
