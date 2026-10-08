
'use client';

import { useEffect, useState } from "react";

const toBanglaDigits = (num) => {
  if (num === null || num === undefined) return "";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Default fallback items to show immediately
const defaultTickerItems = [
  { id: 1, name: "স্বর্ণমাছি চাল", priceBangla: "১৪৮", unit: "কেজি", changeBangla: "২.১", isUp: true, emoji: "🍚" },
  { id: 2, name: "মিনিকেট চাল", priceBangla: "৯৯", unit: "কেজি", changeBangla: "২.৯", isUp: false, emoji: "🍚" },
  { id: 3, name: "বোটাম সাইজ চাল", priceBangla: "৬৬", unit: "কেজি", changeBangla: "৩.১", isUp: true, emoji: "🍚" },
  { id: 4, name: "মসুর ডাল", priceBangla: "১৪২", unit: "কেজি", changeBangla: "২.৯", isUp: true, emoji: "🫘" },
  { id: 5, name: "ছোলা", priceBangla: "১২০", unit: "কেজি", changeBangla: "২.৪", isUp: false, emoji: "🫘" },
];

export default function PriceTicker() {
  const [tickerItems, setTickerItems] = useState(defaultTickerItems);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((item) => {
              const currentPrice = item.price || item.currentPrice || 0;
              const previousPrice = item.previousPrice || currentPrice;
              const diff = currentPrice - previousPrice;
              const percent = previousPrice > 0 ? ((diff / previousPrice) * 100).toFixed(1) : "0.0";
              const isUp = diff >= 0;

              return {
                id: item.id || item._id,
                name: item.name,
                emoji: item.emoji || "🛒",
                unit: item.unit || "কেজি",
                priceBangla: toBanglaDigits(currentPrice),
                changeBangla: toBanglaDigits(Math.abs(percent)),
                isUp,
              };
            });
            setTickerItems(formatted);
          }
        }
      } catch (err) {
        console.error("Ticker using default dataset fallback:", err);
      }
    }
    fetchProducts();
  }, []);

  const displayList = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-emerald-50/60 border-b border-emerald-100 py-2 overflow-hidden whitespace-nowrap flex items-center">
      <div className="inline-flex animate-marquee gap-8 text-xs sm:text-sm font-medium">
        {displayList.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="inline-flex items-center gap-2 px-3 border-r border-emerald-200/60 shrink-0"
          >
            <span>{item.emoji}</span>
            <span className="text-gray-800 font-semibold">{item.name}</span>
            <span className="text-gray-600">
              {item.priceBangla} টাকা/{item.unit}
            </span>
            <span
              className={`font-bold ${
                item.isUp ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.isUp ? "▲" : "▼"} {item.changeBangla}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}