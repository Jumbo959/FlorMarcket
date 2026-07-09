import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const status = searchParams.get("status") || "APPROVED";

  const plants = await prisma.plant.findMany({
    where: {
      status: status as "APPROVED" | "PENDING" | "REJECTED" | "SOLD",
      ...(category && { category }),
      ...(type && { listingType: type as "STANDARD" | "URGENT" | "VIP" }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    },
    include: {
      user: { select: { id: true, name: true, phone: true } },
    },
    orderBy: [
      { listingType: "desc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(plants);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, price, category, imageUrl, location, listingType } = body;

    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }

    const plant = await prisma.plant.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || null,
        location: location || null,
        listingType: listingType || "STANDARD",
        status: listingType === "STANDARD" ? "PENDING" : "PENDING",
        userId: session.id,
      },
    });

    return NextResponse.json(plant);
  } catch {
    return NextResponse.json({ error: "Ошибка создания объявления" }, { status: 500 });
  }
}
