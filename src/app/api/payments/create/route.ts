import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { createYooKassaPayment } from "@/lib/yookassa";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { plantId, type } = await request.json();

    if (!plantId || !type || !["URGENT_LISTING", "VIP_LISTING"].includes(type)) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const plant = await prisma.plant.findUnique({ where: { id: plantId } });
    if (!plant || plant.userId !== session.id) {
      return NextResponse.json({ error: "Объявление не найдено" }, { status: 404 });
    }

    const settings = await getSettings();
    const amount = type === "VIP_LISTING" ? settings.vipPrice : settings.urgentPrice;
    const listingType = type === "VIP_LISTING" ? "VIP" : "URGENT";

    const description =
      type === "VIP_LISTING"
        ? `VIP-размещение: ${plant.title}`
        : `Срочная продажа: ${plant.title}`;

    const payment = await prisma.payment.create({
      data: {
        amount,
        type,
        userId: session.id,
        metadata: JSON.stringify({ plantId, listingType }),
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const yooPayment = await createYooKassaPayment({
      amount,
      description,
      returnUrl: `${siteUrl}/payment/success?paymentId=${payment.id}`,
      paymentId: payment.id,
      metadata: {
        paymentId: payment.id,
        plantId,
        userId: session.id,
      },
    });

    if ("demo" in yooPayment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { yookassaId: `demo_${payment.id}` },
      });

      return NextResponse.json({
        demo: true,
        paymentId: payment.id,
        confirmationUrl: yooPayment.confirmation_url,
        amount,
      });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { yookassaId: yooPayment.id },
    });

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: yooPayment.confirmation?.confirmation_url,
      amount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 });
  }
}
