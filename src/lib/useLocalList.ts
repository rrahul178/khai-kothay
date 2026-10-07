"use client";
import { useCallback, useEffect, useState } from "react";

// Tiny localStorage-backed list so users don't need an account (MVP: "no login required").
export function useLocalList(key: string) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch {
      setItems([]);
    }
  }, [key]);
  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );
  return { items, toggle, has: (id: string) => items.includes(id) };
}
