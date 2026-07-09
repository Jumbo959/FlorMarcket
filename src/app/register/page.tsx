"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Animations";
import { Leaf, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ошибка регистрации");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern flex items-center justify-center">
      <FadeIn className="w-full max-w-md px-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-forest-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-forest-800">Регистрация</h1>
            <p className="text-forest-400 text-sm mt-1">Создайте аккаунт на FloraMarket</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-forest-700">Имя</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300" placeholder="Ваше имя" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300" placeholder="email@example.com" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-700">Телефон</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300" placeholder="+7 (999) 123-45-67" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-forest-700">Пароль</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-300" placeholder="Минимум 6 символов" />
              </div>
            </div>

            <p className="text-xs text-forest-400">
              Регистрируясь, вы соглашаетесь с{" "}
              <Link href="/legal/offer" className="text-forest-500 hover:underline">офертой</Link> и{" "}
              <Link href="/legal/privacy" className="text-forest-500 hover:underline">политикой конфиденциальности</Link>
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 transition-colors disabled:opacity-50">
              {loading ? "Регистрация..." : "Создать аккаунт"}
            </button>
          </form>

          <p className="text-center text-sm text-forest-400 mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-forest-500 font-medium hover:underline">Войти</Link>
          </p>
        </motion.div>
      </FadeIn>
    </div>
  );
}
