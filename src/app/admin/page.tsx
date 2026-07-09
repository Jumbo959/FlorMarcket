"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Animations";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Users, Leaf, Clock, CreditCard, Settings, Check, X, Shield,
  TrendingUp, Trash2
} from "lucide-react";

interface AdminData {
  users: Array<{
    id: string; email: string; name: string; phone: string | null;
    role: string; createdAt: string;
    _count: { plants: number; payments: number };
  }>;
  plants: Array<{
    id: string; title: string; price: number; status: string;
    listingType: string; createdAt: string;
    user: { name: string; email: string };
  }>;
  payments: Array<{
    id: string; amount: number; type: string; status: string;
    createdAt: string; user: { name: string; email: string };
  }>;
  stats: {
    totalUsers: number; totalPlants: number;
    pendingPlants: number; successfulPayments: number; totalRevenue: number;
  };
}

interface SiteSettings {
  urgentPrice: number; vipPrice: number;
  urgentDays: number; vipDays: number;
  siteName: string; siteDescription: string;
}

type Tab = "overview" | "moderation" | "users" | "payments" | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/logout")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "ADMIN") {
          router.push("/login");
          return;
        }
        return Promise.all([
          fetch("/api/admin").then((r) => r.json()),
          fetch("/api/settings").then((r) => r.json()),
        ]);
      })
      .then((result) => {
        if (result) {
          setData(result[0]);
          setSettings(result[1]);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function adminAction(action: string, id?: string, actionData?: Record<string, unknown>) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id, data: actionData }),
    });
    const [adminData, settingsData] = await Promise.all([
      fetch("/api/admin").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setData(adminData);
    setSettings(settingsData);
  }

  if (loading) {
    return (
      <div className="pt-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !settings) return null;

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Обзор", icon: TrendingUp },
    { id: "moderation", label: `Модерация (${data.stats.pendingPlants})`, icon: Clock },
    { id: "users", label: "Пользователи", icon: Users },
    { id: "payments", label: "Платежи", icon: CreditCard },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  return (
    <div className="pt-28 pb-16 min-h-screen bg-forest-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-800">Админ-панель</h1>
            <p className="text-forest-500 text-sm">Управление FloraMarket</p>
          </div>
        </FadeIn>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-forest-500 text-white shadow-md" : "bg-white text-forest-600 hover:bg-forest-50"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Пользователи", value: data.stats.totalUsers, icon: Users, color: "bg-blue-500" },
              { label: "Объявления", value: data.stats.totalPlants, icon: Leaf, color: "bg-forest-500" },
              { label: "На модерации", value: data.stats.pendingPlants, icon: Clock, color: "bg-yellow-500" },
              { label: "Доход", value: formatPrice(data.stats.totalRevenue), icon: CreditCard, color: "bg-gold" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-forest-800">{stat.value}</p>
                <p className="text-sm text-forest-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "moderation" && (
          <div className="space-y-3">
            {data.plants.filter((p) => p.status === "PENDING").length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-forest-400">Нет объявлений на модерации</div>
            ) : (
              data.plants.filter((p) => p.status === "PENDING").map((plant) => (
                <div key={plant.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-forest-800">{plant.title}</h3>
                    <p className="text-sm text-forest-400">
                      {formatPrice(plant.price)} · {plant.user.name} · {plant.listingType} · {formatDate(plant.createdAt)}
                    </p>
                  </div>
                  <button onClick={() => adminAction("approve_plant", plant.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => adminAction("reject_plant", plant.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-forest-50">
                <tr>
                  <th className="text-left p-4 font-medium text-forest-600">Имя</th>
                  <th className="text-left p-4 font-medium text-forest-600">Email</th>
                  <th className="text-left p-4 font-medium text-forest-600">Роль</th>
                  <th className="text-left p-4 font-medium text-forest-600">Объявления</th>
                  <th className="text-left p-4 font-medium text-forest-600">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-t border-forest-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-forest-500">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "ADMIN" ? "bg-gold/20 text-gold" : "bg-forest-50 text-forest-600"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user._count.plants}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => adminAction("toggle_role", user.id)} className="text-xs text-forest-500 hover:underline">
                        {user.role === "ADMIN" ? "Снять админа" : "Сделать админом"}
                      </button>
                      <button onClick={() => adminAction("delete_user", user.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-3">
            {data.payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium text-forest-800">{payment.user.name}</p>
                  <p className="text-sm text-forest-400">{payment.type === "VIP_LISTING" ? "VIP" : "Срочное"} · {formatDate(payment.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-forest-700">{formatPrice(payment.amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    payment.status === "SUCCEEDED" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  }`}>{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && settings && (
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-lg">
            <h3 className="font-semibold text-forest-800 mb-6">Цены размещения</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                adminAction("update_settings", undefined, {
                  urgentPrice: parseFloat(fd.get("urgentPrice") as string),
                  vipPrice: parseFloat(fd.get("vipPrice") as string),
                  urgentDays: parseInt(fd.get("urgentDays") as string),
                  vipDays: parseInt(fd.get("vipDays") as string),
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-forest-600">Срочная продажа (₽)</label>
                  <input name="urgentPrice" type="number" defaultValue={settings.urgentPrice} className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-100" />
                </div>
                <div>
                  <label className="text-sm text-forest-600">VIP (₽)</label>
                  <input name="vipPrice" type="number" defaultValue={settings.vipPrice} className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-100" />
                </div>
                <div>
                  <label className="text-sm text-forest-600">Срочная (дней)</label>
                  <input name="urgentDays" type="number" defaultValue={settings.urgentDays} className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-100" />
                </div>
                <div>
                  <label className="text-sm text-forest-600">VIP (дней)</label>
                  <input name="vipDays" type="number" defaultValue={settings.vipDays} className="w-full mt-1 px-3 py-2 rounded-lg border border-forest-100" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-forest-500 text-white rounded-xl font-medium hover:bg-forest-600 transition-colors">
                Сохранить
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
