"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Zap, Crown, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center leaf-pattern overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-forest-50/80 via-cream to-sage-50/50" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-forest-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-slow" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-32 right-[15%] text-6xl opacity-20 animate-float"
      >
        🌿
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 left-[10%] text-5xl opacity-15 animate-float-delayed"
      >
        🌱
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-forest-600 shadow-sm mb-6"
          >
            <Leaf className="w-4 h-4 text-forest-500" />
            Маркетплейс №1 для любителей растений
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 leading-tight mb-6"
          >
            Продавайте и покупайте{" "}
            <span className="text-gradient">ботанические растения</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-forest-600 leading-relaxed mb-8 max-w-2xl"
          >
            Размещайте объявления бесплатно или выделяйте их с помощью VIP и срочной продажи.
            Безопасная площадка для коллекционеров и садоводов.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Смотреть каталог
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-700 rounded-xl font-semibold hover:bg-forest-50 transition-all shadow-md border border-forest-100"
            >
              Продать растение
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-6 mt-12"
          >
            {[
              { icon: Zap, label: "Срочная продажа", color: "text-orange-500" },
              { icon: Crown, label: "VIP объявления", color: "text-gold" },
              { icon: Shield, label: "Модерация", color: "text-forest-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-forest-600">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
