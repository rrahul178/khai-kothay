import FoodMap from "./FoodMap";

export const metadata = { title: "Food Map — Khai Kothay?" };

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">🗺️ Food Map</h1>
      <p className="text-sm text-stone-600">জেলার pin এ ক্লিক করুন, দেখুন সেখানকার বিখ্যাত খাবার।</p>
      <FoodMap />
    </div>
  );
}
