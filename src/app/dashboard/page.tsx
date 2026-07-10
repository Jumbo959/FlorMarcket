"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Animations";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Trash2, Eye, Clock, CheckCircle, XCircle, Zap, Crown } from "lucide-react";

interface Plant {
  id: string;
  title: string;
  price: number;
  status: string;
  listingType: string;
  views: number;
  createdAt: string;
}

const statusMap: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  PENDING: { label: "На модерации", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
  APPROVED: { label: "Опубликовано", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  REJECTED: { label: "Отклонено", icon: XCircle, color: "text-red-600 bg-red-50" },
  SOLD: { label: "Продано", icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/login?redirect=/dashboard");
          return;
        }
        setUser(d.user);
        return fetch("/api/plants/my").then((r) => r.json());
      })
      .then((data) => {
        if (Array.isArray(data)) setPlants(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Удалить объявление?")) return;
    await fetch(`/api/plants/${id}`, { method: "DELETE" });
    setPlants(plants.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="pt-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-800">Личный кабинет</h1>
            {user && <p className="text-forest-500 mt-1">{user.name} · {user.email}</p>}
          </div>
          <Link href="/sell" className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white rounded-xl text-sm font-medium hover:bg-forest-600 transition-colors shadow-md">
            <Plus className="w-4 h-4" /> Новое объявление
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-semibold text-forest-700 mb-4">Мои объявления ({plants.length})</h2>

          {plants.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <p className="text-5xl mb-4">🌱</p>
              <p className="text-forest-500 mb-4">У вас пока нет объявлений</p>
              <Link href="/sell" className="text-forest-500 font-medium hover:underline">Разместить первое растение</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {plants.map((plant, i) => {
                const status = statusMap[plant.status] || statusMap.PENDING;
                return (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-forest-800 truncate">{plant.title}</h3>
                        {plant.listingType === "VIP" && <Crown className="w-4 h-4 text-gold flex-shrink-0" />}
                        {plant.listingType === "URGENT" && <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-forest-400">
                        <span className="font-medium text-forest-600">{formatPrice(plant.price)}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{plant.views}</span>
                        <span>{formatDate(plant.createdAt)}</span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>

                    <button onClick={() => handleDelete(plant.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
