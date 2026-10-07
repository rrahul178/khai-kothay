"use client";
import { useState } from "react";
import { districts } from "@/data/geo";
import { categories } from "@/data/foods";

// MVP: submissions are stored on this device only (status: pending).
// Wire this to your database / API route + admin approval when the backend is ready.
export default function AddPlace() {
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const prev = JSON.parse(localStorage.getItem("kk:pending") || "[]");
      localStorage.setItem("kk:pending", JSON.stringify([...prev, { ...data, status: "pending", at: Date.now() }]));
    } catch {}
    setDone(true);
  };

  if (done)
    return (
      <div className="card">
        <div className="text-xl font-bold">🟡 Pending verification</div>
        <p className="mt-1 text-sm text-stone-600">ধন্যবাদ! Admin যাচাই করলে এটি 🟢 Approved হবে।</p>
      </div>
    );

  const input = "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm";
  return (
    <form onSubmit={submit} className="card max-w-xl space-y-3">
      <h1 className="text-2xl font-extrabold">➕ Add a Food Place</h1>
      <label className="block text-sm">Restaurant name<input name="name" required className={input} /></label>
      <label className="block text-sm">Food type
        <select name="category" className={input}>{categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.labelEn}</option>)}</select>
      </label>
      <label className="block text-sm">District
        <select name="district" required className={input}>{districts.map((d) => <option key={d.slug} value={d.slug}>{d.nameBn} · {d.nameEn}</option>)}</select>
      </label>
      <label className="block text-sm">Upazila<input name="upazila" className={input} /></label>
      <label className="block text-sm">Address<input name="address" className={input} /></label>
      <label className="block text-sm">Phone<input name="phone" type="tel" className={input} /></label>
      <label className="block text-sm">Price range
        <select name="price" className={input}><option value="1">৳</option><option value="2">৳৳</option><option value="3">৳৳৳</option></select>
      </label>
      <label className="block text-sm">Google Maps location (link)<input name="maps" type="url" className={input} /></label>
      <label className="block text-sm">Your recommendation<textarea name="note" rows={3} className={input} /></label>
      <button className="btn">Submit</button>
    </form>
  );
}
