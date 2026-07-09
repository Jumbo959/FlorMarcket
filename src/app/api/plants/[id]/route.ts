import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, phone: true, email: true } } },
  });

  if (!plant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  await prisma.plant.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(plant);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const { id } = await params;
  const plant = await prisma.plant.findUnique({ where: { id } });

  if (!plant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  if (plant.userId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.plant.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const { id } = await params;
  const plant = await prisma.plant.findUnique({ where: { id } });

  if (!plant) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  if (plant.userId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  await prisma.plant.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
