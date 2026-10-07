import Link from "next/link";
import { categories, type Food } from "@/data/foods";
import { getDistrict } from "@/data/geo";
import FoodImage from "./FoodImage";

export default function FoodCard({ food }: { food: Food }) {
  const cat = categories.find((c) => c.id === food.category);
  const d = getDistrict(food.originDistrict);
  return (
    <Link href={`/food/${food.slug}`} className="card block overflow-hidden p-0 hover:border-brand">
      <FoodImage food={food} className="h-28 w-full" />
      <div className="p-3">
        <div className="font-semibold">{food.nameBn}</div>
        <div className="text-sm text-stone-500">{food.nameEn}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="chip">{cat?.labelEn}</span>
          {d && <span className="chip">📍 {d.nameEn}</span>}
        </div>
      </div>
    </Link>
  );
}
