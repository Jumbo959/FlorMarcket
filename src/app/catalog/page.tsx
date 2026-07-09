"use client";

import { useEffect, useState } from "react";
import { PlantCard } from "@/components/PlantCard";
import { FadeIn } from "@/components/Animations";
import { Search, Filter } from "lucide-react";

interface Plant {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  location?: string | null;
  listingType: string;
  views: number;
}

const categories = ["Все", "Тропические", "Деревья", "Суккуленты", "Цветущие", "Декоративные"];
const types = [
  { value: "", label: "Все типы" },
  { value: "VIP", label: "VIP" },
  { value: "URGENT", label: "Срочные" },
  { value: "STANDARD", label: "Обычные" },
];

export default function CatalogPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [type, setType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "Все") params.set("category", category);
    if (type) params.set("type", type);

    setLoading(true);
    fetch(`/api/plants?${params}`)
      .then((r) => r.json())
      .then(setPlants)
      .finally(() => setLoading(false));
  }, [search, category, type]);

  return (
    <div className="pt-28 pb-16 leaf-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-10">
          <h1 className="font-display text-4xl font-bold text-forest-800 mb-3">Каталог растений</h1>
          <p className="text-forest-500">Найдите идеальное растение для вашего дома или коллекции</p>
        </FadeIn>

        <FadeIn delay={0.1} className="glass rounded-2xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
              <input
                type="text"
                placeholder="Поиск растений..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 bg-white focus:outline-none focus:ring-2 focus:ring-forest-300 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-forest-400 hidden sm:block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-forest-500 text-white shadow-md"
                      : "bg-white text-forest-600 hover:bg-forest-50 border border-forest-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  type === t.value
                    ? "bg-forest-600 text-white"
                    : "text-forest-500 hover:bg-forest-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🌿</p>
            <p className="text-forest-500 text-lg">Растения не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant, i) => (
              <PlantCard key={plant.id} plant={plant} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
