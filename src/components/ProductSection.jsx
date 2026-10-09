'use client';

import { useEffect, useState } from "react";

// Helper function to convert English numbers to Bangla digits
const toBanglaDigits = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "০";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toLocaleString("en-US")
    .replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Map English unit strings to Bangla
const formatUnit = (unitStr) => {
  if (!unitStr) return "কেজি";
  const u = unitStr.toLowerCase().trim();
  if (u === "kg") return "কেজি";
  if (u === "dozen") return "ডজন";
  if (u === "pcs" || u === "piece") return "পিস";
  if (u === "litre" || u === "liter") return "লিটার";
  return unitStr;
};

export default function ProductSection() {
  const [increasedProducts, setIncreasedProducts] = useState([]);
  const [decreasedProducts, setDecreasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data)) {
            const increased = [];
            const decreased = [];

            data.forEach((item) => {
              const name = item.nameBn || item.name || "পণ্য";
              const currentPrice = item.today ?? 0;
              const emoji = item.image || item.categoryIcon || "📦";
              const unit = formatUnit(item.unit);
              
              // Extract direction and percentage from item.change object
              const isUp = item.change?.dir === "up";
              const percent = item.change?.pct ?? 0;

              const formattedItem = {
                id: item.id || item.slug || name,
                name,
                unit,
                emoji,
                priceBangla: toBanglaDigits(currentPrice),
                changeBangla: toBanglaDigits(percent.toFixed(1)),
                isUp,
              };

              if (isUp) {
                increased.push(formattedItem);
              } else {
                decreased.push(formattedItem);
              }
            });

            setIncreasedProducts(increased);
            setDecreasedProducts(decreased);
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 font-medium">
        লাইভ বাজার দর লোড হচ্ছে...
      </div>
    );
  }

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Price Increased Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-sm">▲</span>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            আজ দাম বেড়েছে
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {increasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 2. Price Decreased Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-sm">▼</span>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            আজ দাম কমেছে
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decreasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </section>
  );
}

function ProductCard({ product }) {
  const { name, unit, emoji, priceBangla, changeBangla, isUp } = product;

  return (
    <div className="bg-[#f8faf9] border border-gray-100/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
      {/* Top Part */}
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0 border border-gray-100">
          {emoji}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug">
            {name}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            প্রতি {unit}
          </p>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-gray-400 block font-medium">আজকের দাম</span>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            {priceBangla} টাকা
          </span>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            isUp
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}
        >
          <span>{isUp ? "▲" : "▼"}</span>
          <span>{changeBangla}%</span>
        </div>
      </div>
    </div>
  );
}