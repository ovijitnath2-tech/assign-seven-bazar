"use client";

import { useEffect, useState, use } from "react";

const toBanglaDigits = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num ?? 0).replace(/\d/g, (digit) => banglaDigits[digit]);
};

const formatUnit = (unit) => {
  if (!unit) return "কেজি";
  const u = String(unit).toLowerCase();
  if (u === "kg" || u === "kg.") return "কেজি";
  if (u === "dozen") return "ডজন";
  if (u === "liter" || u === "litre" || u === "l") return "লিটার";
  if (u === "piece" || u === "pcs") return "টি";
  return unit;
};

const categoryMeta = {
  chal: { name: "চাল", emoji: "🍚" },
  dal: { name: "ডাল", emoji: "🫘" },
  oil: { name: "তেল", emoji: "🍾" },
  sobji: { name: "সবজি", emoji: "🥦" },
  mach: { name: "মাছ", emoji: "🐟" },
  mangsho: { name: "মাংস", emoji: "🍗" },
  dim_dudh: { name: "ডিম-দুধ", emoji: "🥛" },
  moshla: { name: "মসলা", emoji: "🌶️" },
};

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  const currentCategory = categoryMeta[slug] || {
    name: slug || "ক্যাটাগরি",
    emoji: "📦",
  };

  useEffect(() => {
    async function fetchCategoryData() {
      if (!slug) return;
      setLoading(true);

      try {
        const API_URL = `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`;
        const res = await fetch(API_URL);

        if (res.ok) {
          const rawData = await res.json();
          const itemsList = Array.isArray(rawData)
            ? rawData
            : rawData.data || rawData.products || [];

          const formatted = itemsList.map((item) => ({
            id: item.id || item._id,
            name: item.nameBn || item.name_bn || item.name,
            unit: formatUnit(item.unit),
            emoji: item.image || item.emoji || currentCategory.emoji,
            price: item.today ?? item.price ?? 0,
            changePct: item.change?.pct ?? item.change_pct ?? 0,
            dir: item.change?.dir || item.dir || "equal",
          }));

          setProducts(formatted);
        }
      } catch (err) {
        console.error("Error loading category products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [slug, currentCategory.emoji]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price;
    if (sortBy === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f2f8f5] py-8 px-4 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        
        {/* Banner Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-100/80 shadow-xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl flex-shrink-0">
            {currentCategory.emoji}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              {toBanglaDigits(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="bg-white rounded-2xl px-6 py-4 border border-emerald-100/80 shadow-xs flex items-center justify-end gap-3">
          <span className="text-xs text-gray-500 font-semibold">সাজান</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
          >
            <option value="default">ডিফল্ট</option>
            <option value="lowToHigh">কম থেকে বেশি দাম</option>
            <option value="highToLow">বেশি থেকে কম দাম</option>
          </select>
        </div>

        {/* Total Products Counter */}
        <div className="text-xs font-semibold text-gray-500 text-left pl-1">
          মোট {toBanglaDigits(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-500 font-medium">
            লোড হচ্ছে...
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500 font-medium bg-white rounded-3xl border border-emerald-100/80">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {sortedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      প্রতি {item.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">
                      আজকের দাম
                    </span>
                    <span className="text-lg font-extrabold text-gray-900">
                      {toBanglaDigits(item.price)} টাকা
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl ${
                      item.dir === "up"
                        ? "bg-red-50 text-red-500"
                        : item.dir === "down"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span>
                      {item.dir === "up"
                        ? "▲"
                        : item.dir === "down"
                        ? "▼"
                        : "—"}
                    </span>
                    <span>
                      {item.dir === "equal"
                        ? "০.০%"
                        : `${toBanglaDigits(Number(item.changePct).toFixed(1))}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}