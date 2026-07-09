import { getSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { FadeIn } from "@/components/Animations";
import Link from "next/link";
import { Leaf, Zap, Crown, Check } from "lucide-react";

export default async function PricingPage() {
  const settings = await getSettings();

  const plans = [
    {
      name: "Обычное",
      icon: Leaf,
      price: "Бесплатно",
      period: "навсегда",
      color: "border-forest-200",
      iconColor: "text-forest-500 bg-forest-100",
      features: [
        "Размещение в каталоге",
        "Контакт с покупателями",
        "Модерация объявления",
        "Базовая видимость",
      ],
      cta: "Разместить бесплатно",
      href: "/sell",
      highlight: false,
    },
    {
      name: "Срочная продажа",
      icon: Zap,
      price: formatPrice(settings.urgentPrice),
      period: `${settings.urgentDays} дней`,
      color: "border-orange-300",
      iconColor: "text-orange-500 bg-orange-100",
      features: [
        "Оранжевая метка «Срочно»",
        "Приоритет в каталоге",
        `Активно ${settings.urgentDays} дней`,
        "Больше просмотров",
        "Быстрая продажа",
      ],
      cta: "Выбрать срочное",
      href: "/sell",
      highlight: false,
    },
    {
      name: "VIP",
      icon: Crown,
      price: formatPrice(settings.vipPrice),
      period: `${settings.vipDays} дней`,
      color: "border-gold",
      iconColor: "text-gold bg-amber-100",
      features: [
        "Золотая VIP-метка",
        "Топ каталога",
        `Активно ${settings.vipDays} дней`,
        "Максимальная видимость",
        "Премиум оформление",
      ],
      cta: "Выбрать VIP",
      href: "/sell",
      highlight: true,
    },
  ];

  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <h1 className="font-display text-4xl font-bold text-forest-800 mb-3">Тарифы размещения</h1>
          <p className="text-forest-500 max-w-xl mx-auto">
            Выберите подходящий тариф для продажи вашего растения. Оплата через ЮKassa — безопасно и удобно.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${plan.color} h-full flex flex-col ${
                plan.highlight ? "ring-2 ring-gold/30 scale-105" : ""
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-white text-xs font-bold rounded-full">
                    Популярный
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${plan.iconColor}`}>
                  <plan.icon className="w-7 h-7" />
                </div>

                <h3 className="font-display text-xl font-bold text-forest-800 mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-forest-700">{plan.price}</span>
                  <span className="text-forest-400 text-sm ml-2">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-forest-600">
                      <Check className="w-4 h-4 text-forest-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-gold text-white hover:bg-gold/90 shadow-md"
                      : "bg-forest-500 text-white hover:bg-forest-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
