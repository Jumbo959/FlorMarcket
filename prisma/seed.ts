import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@flora-market.ru" },
    update: {},
    create: {
      email: "admin@flora-market.ru",
      password: adminPassword,
      name: "Администратор",
      phone: "+7 (999) 000-00-01",
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "Мария Садовникова",
      phone: "+7 (999) 111-22-33",
      role: "USER",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  const demoPlants = [
    {
      title: "Монстера деликатесная",
      description:
        "Крупное растение с характерными прорезными листьями. Идеально для просторных помещений. Высота 80 см, в горшке 25 см.",
      price: 4500,
      category: "Тропические",
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop",
      location: "Москва",
      listingType: "VIP" as const,
      status: "APPROVED" as const,
    },
    {
      title: "Фикус Бенджамина",
      description:
        "Элегантное комнатное дерево с глянцевыми листьями. Неприхотлив в уходе, отлично очищает воздух.",
      price: 2800,
      category: "Деревья",
      imageUrl: "https://images.unsplash.com/photo-1593482892229-4c0e7e4a8b0e?w=600&h=600&fit=crop",
      location: "Санкт-Петербург",
      listingType: "STANDARD" as const,
      status: "APPROVED" as const,
    },
    {
      title: "Сансевиерия лаурентии",
      description:
        "Неприхотливое растение, идеальное для начинающих. Выдерживает недостаток света и редкий полив.",
      price: 1200,
      category: "Суккуленты",
      imageUrl: "https://images.unsplash.com/photo-1593482892229-4c0e7e4a8b0e?w=600&h=600&fit=crop",
      location: "Казань",
      listingType: "URGENT" as const,
      status: "APPROVED" as const,
    },
    {
      title: "Орхидея Фаленопсис",
      description:
        "Изящная белая орхидея в цвету. Долгое цветение, подходит для подарка.",
      price: 3200,
      category: "Цветущие",
      imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=600&h=600&fit=crop",
      location: "Москва",
      listingType: "STANDARD" as const,
      status: "APPROVED" as const,
    },
    {
      title: "Калатея Медальон",
      description:
        "Декоративно-лиственное растение с уникальным узором на листьях. Требует повышенной влажности.",
      price: 1900,
      category: "Декоративные",
      imageUrl: "https://images.unsplash.com/photo-1593482892229-4c0e7e4a8b0e?w=600&h=600&fit=crop",
      location: "Екатеринбург",
      listingType: "VIP" as const,
      status: "APPROVED" as const,
    },
    {
      title: "Драцена Маргината",
      description:
        "Стильное растение с узкими листьями с красной каймой. Отлично смотрится в современном интерьере.",
      price: 2400,
      category: "Деревья",
      imageUrl: "https://images.unsplash.com/photo-1593482892229-4c0e7e4a8b0e?w=600&h=600&fit=crop",
      location: "Новосибирск",
      listingType: "STANDARD" as const,
      status: "APPROVED" as const,
    },
  ];

  for (const plant of demoPlants) {
    await prisma.plant.create({
      data: { ...plant, userId: user.id },
    });
  }

  console.log("✅ База данных заполнена");
  console.log("   Админ: admin@flora-market.ru / admin123");
  console.log("   Пользователь: user@example.com / user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
