import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { MapPin, Eye, Phone, Mail, User, Zap, Crown, ArrowLeft } from "lucide-react";

async function getPlant(id: string) {
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: { user: { select: { name: true, phone: true, email: true } } },
  });
  return plant;
}

export default async function PlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = await getPlant(id);

  if (!plant || plant.status !== "APPROVED") {
    notFound();
  }

  const isVip = plant.listingType === "VIP";
  const isUrgent = plant.listingType === "URGENT";

  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-forest-500 hover:text-forest-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад в каталог
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-80 md:h-auto min-h-[400px] bg-forest-50">
              {plant.imageUrl ? (
                <Image src={plant.imageUrl} alt={plant.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
              )}

              {isVip && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-gold text-white rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Crown className="w-4 h-4" /> VIP
                </div>
              )}
              {isUrgent && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-4 h-4" /> Срочная продажа
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-3xl font-bold text-forest-800">{plant.title}</h1>
                <span className="px-3 py-1 bg-forest-50 text-forest-600 rounded-full text-sm whitespace-nowrap">
                  {plant.category}
                </span>
              </div>

              <p className="text-3xl font-bold text-forest-600 mb-6">{formatPrice(plant.price)}</p>

              <p className="text-forest-600 leading-relaxed mb-6 flex-1">{plant.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-forest-400 mb-6">
                {plant.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{plant.location}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{plant.views} просмотров</span>
                <span>Опубликовано {formatDate(plant.createdAt)}</span>
              </div>

              <div className="border-t border-forest-100 pt-6">
                <h3 className="font-semibold text-forest-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Продавец
                </h3>
                <p className="text-forest-700 font-medium mb-2">{plant.user.name}</p>
                <div className="flex flex-wrap gap-3">
                  {plant.user.phone && (
                    <a href={`tel:${plant.user.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-forest-500 text-white rounded-lg text-sm hover:bg-forest-600 transition-colors">
                      <Phone className="w-4 h-4" /> Позвонить
                    </a>
                  )}
                  <a href={`mailto:${plant.user.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm hover:bg-forest-100 transition-colors">
                    <Mail className="w-4 h-4" /> Написать
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
