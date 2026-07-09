"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import { Zap, Crown, Shield, Users, Search, CreditCard } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Удобный каталог",
    description: "Фильтры по категориям, цене и типу объявления. Находите нужное растение за секунды.",
    color: "bg-forest-100 text-forest-600",
  },
  {
    icon: Zap,
    title: "Срочная продажа",
    description: "Выделите объявление оранжевой меткой и поднимите в топ. Продайте быстрее!",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Crown,
    title: "VIP-размещение",
    description: "Золотая метка, приоритет в каталоге и максимальная видимость вашего растения.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Shield,
    title: "Модерация",
    description: "Каждое объявление проверяется перед публикацией. Только качественные предложения.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Сообщество",
    description: "Тысячи садоводов и коллекционеров по всей России. Прямой контакт с продавцом.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: CreditCard,
    title: "Безопасная оплата",
    description: "Оплата VIP и срочных объявлений через ЮKassa. Надёжно и удобно.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-forest-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Почему FloraMarket?
          </h2>
          <p className="text-forest-300 max-w-xl mx-auto">
            Всё, что нужно для удобной покупки и продажи ботанических растений
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <div className="bg-forest-800/50 backdrop-blur-sm border border-forest-700/50 rounded-2xl p-6 hover:bg-forest-800/70 transition-colors h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-forest-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
