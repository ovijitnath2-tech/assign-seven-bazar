'use client';

import { useEffect, useState } from "react";

// Convert English numbers to Bangla digits
const toBanglaDigits = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "০";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toLocaleString("en-US")
    .replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Format English unit to Bangla
const formatUnit = (unitStr) => {
  if (!unitStr) return "কেজি";
  const u = unitStr.toLowerCase().trim();
  if (u === "kg") return "কেজি";
  if (u === "dozen") return "ডজন";
  if (u === "pcs" || u === "piece") return "পিস";
  if (u === "litre" || u === "liter") return "লিটার";
  return unitStr;
};

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const formatted = data.map((item) => {
              const name = item.nameBn || item.name || "পণ্য";
              const currentPrice = item.today ?? 0;
              const emoji = item.image || item.categoryIcon || "📦";
              const unit = formatUnit(item.unit);
              const dir = item.change?.dir || "equal";
              const percent = item.change?.pct ?? 0;

              return {
                id: item.id || item.slug || name,
                name,
                unit,
                emoji,
                priceBangla: toBanglaDigits(currentPrice),
                changeBangla: toBanglaDigits(percent.toFixed(1)),
                dir,
              };
            });
            setProducts(formatted);
          }
        }
      } catch (error) {
        console.error("Error loading all products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 font-medium">
        সব পণ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          সব পণ্য
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          মোট {toBanglaDigits(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#f8faf9] border border-gray-100/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            {/* Top Part */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0 border border-gray-100">
                {product.emoji}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  প্রতি {product.unit}
                </p>
              </div>
            </div>

            {/* Bottom Part */}
            <div className="mt-6 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  আজকের দাম
                </span>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                  {product.priceBangla} টাকা
                </span>
              </div>

              {/* Status Badge */}
              {product.dir === "up" && (
                <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                  <span>▲</span>
                  <span>{product.changeBangla}%</span>
                </div>
              )}

              {product.dir === "down" && (
                <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <span>▼</span>
                  <span>{product.changeBangla}%</span>
                </div>
              )}

              {product.dir !== "up" && product.dir !== "down" && (
                <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  <span>—</span>
                  <span>{product.changeBangla}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}