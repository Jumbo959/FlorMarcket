"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Animations";
import { Leaf, Zap, Crown, Upload, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Settings {
  urgentPrice: number;
  vipPrice: number;
  urgentDays: number;
  vipDays: number;
}

const categories = ["Тропические", "Деревья", "Суккуленты", "Цветущие", "Декоративные", "Другое"];

export default function SellPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [listingType, setListingType] = useState("STANDARD");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: categories[0],
    imageUrl: "",
    location: "",
  });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
    fetch("/api/auth/logout").then((r) => r.json()).then((d) => {
      if (!d.user) router.push("/login?redirect=/sell");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, listingType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка");
      }

      const plant = await res.json();

      if (listingType !== "STANDARD" && settings) {
        const paymentType = listingType === "VIP" ? "VIP_LISTING" : "URGENT_LISTING";
        const payRes = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plantId: plant.id, type: paymentType }),
        });

        const payData = await payRes.json();
        if (payData.confirmationUrl) {
          window.location.href = payData.confirmationUrl;
          return;
        }
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-3xl p-12 shadow-xl max-w-md"
        >
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-forest-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">Объявление создано!</h2>
          <p className="text-forest-500 mb-6">Оно отправлено на модерацию и скоро появится в каталоге.</p>
          <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors">
            Мои объявления
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-forest-800 mb-3">Продать растение</h1>
          <p className="text-forest-500">Заполните форму и выберите тип размещения</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { type: "STANDARD", icon: Leaf, label: "Обычное", price: "Бесплатно", color: "border-forest-200 hover:border-forest-400" },
              { type: "URGENT", icon: Zap, label: "Срочное", price: settings ? formatPrice(settings.urgentPrice) : "...", color: "border-orange-200 hover:border-orange-400" },
              { type: "VIP", icon: Crown, label: "VIP", price: settings ? formatPrice(settings.vipPrice) : "...", color: "border-amber-200 hover:border-amber-400" },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setListingType(item.type)}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  listingType === item.type
                    ? item.type === "VIP"
                      ? "border-gold bg-amber-50 shadow-md"
                      : item.type === "URGENT"
                        ? "border-orange-400 bg-orange-50 shadow-md"
                        : "border-forest-500 bg-forest-50 shadow-md"
                    : `bg-white ${item.color}`
                }`}
              >
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${
                  item.type === "VIP" ? "text-gold" : item.type === "URGENT" ? "text-orange-500" : "text-forest-500"
                }`} />
                <p className="font-semibold text-sm text-forest-800">{item.label}</p>
                <p className="text-xs text-forest-400 mt-1">{item.price}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Название *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="Монстера деликатесная"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Описание *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                placeholder="Подробное описание растения..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1.5">Цена (₽) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1.5">Категория *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Ссылка на фото</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Город</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="Москва"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 transition-colors disabled:opacity-50 shadow-lg"
            >
              {loading
                ? "Отправка..."
                : listingType === "STANDARD"
                  ? "Разместить бесплатно"
                  : `Разместить и оплатить ${settings ? formatPrice(listingType === "VIP" ? settings.vipPrice : settings.urgentPrice) : ""}`}
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
