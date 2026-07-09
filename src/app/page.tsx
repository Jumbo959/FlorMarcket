import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { PlantCard } from "@/components/PlantCard";
import { FadeIn } from "@/components/Animations";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ArrowRight, Sparkles } from "lucide-react";

async function getFeaturedPlants() {
  return prisma.plant.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ listingType: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
}

export default async function HomePage() {
  const plants = await getFeaturedPlants();

  return (
    <>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-50 text-forest-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Популярные объявления
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-800 mb-3">
            Свежие предложения
          </h2>
          <p className="text-forest-500 max-w-xl mx-auto">
            Лучшие растения от проверенных продавцов. VIP и срочные объявления выделены для вашего удобства.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} index={i} />
          ))}
        </div>

        <FadeIn className="text-center mt-12" delay={0.3}>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-forest-500 text-white rounded-xl font-medium hover:bg-forest-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Смотреть весь каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      <FeaturesSection />
    </>
  );
}
