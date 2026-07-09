"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Eye, Zap, Crown } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface PlantCardProps {
  plant: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string | null;
    location?: string | null;
    listingType: string;
    views: number;
  };
  index?: number;
}

const typeBadges: Record<string, { label: string; icon: typeof Zap; className: string }> = {
  URGENT: { label: "Срочно", icon: Zap, className: "bg-orange-500 text-white" },
  VIP: { label: "VIP", icon: Crown, className: "bg-gold text-white" },
};

export function PlantCard({ plant, index = 0 }: PlantCardProps) {
  const badge = typeBadges[plant.listingType];
  const isPremium = plant.listingType === "VIP" || plant.listingType === "URGENT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/plant/${plant.id}`}>
        <div
          className={cn(
            "relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
            isPremium && plant.listingType === "VIP" && "ring-2 ring-gold/50",
            isPremium && plant.listingType === "URGENT" && "ring-2 ring-orange-400/50"
          )}
        >
          <div className="relative h-56 overflow-hidden bg-forest-50">
            {plant.imageUrl ? (
              <Image
                src={plant.imageUrl}
                alt={plant.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-forest-300 text-6xl">
                🌿
              </div>
            )}

            {badge && (
              <div className={cn("absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg", badge.className)}>
                <badge.icon className="w-3 h-3" />
                {badge.label}
              </div>
            )}

            <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {plant.views}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display text-lg font-semibold text-forest-800 group-hover:text-forest-500 transition-colors line-clamp-1">
                {plant.title}
              </h3>
              <span className="text-xs px-2 py-1 bg-forest-50 text-forest-600 rounded-full whitespace-nowrap">
                {plant.category}
              </span>
            </div>

            <p className="text-sm text-forest-500 line-clamp-2 mb-4 leading-relaxed">
              {plant.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-forest-700">
                {formatPrice(plant.price)}
              </span>
              {plant.location && (
                <span className="text-xs text-forest-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {plant.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
