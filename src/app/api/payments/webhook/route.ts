import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { verifyWebhookAuth, getYooKassaPayment } from "@/lib/yookassa";

async function activateListing(paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status === "SUCCEEDED") return;

  const metadata = payment.metadata ? JSON.parse(payment.metadata) : {};
  const { plantId, listingType } = metadata;
  if (!plantId) return;

  const settings = await getSettings();
  const days = listingType === "VIP" ? settings.vipDays : settings.urgentDays;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "SUCCEEDED" },
    }),
    prisma.plant.update({
      where: { id: plantId },
      data: {
        listingType: listingType || "URGENT",
        status: "PENDING",
        paymentId: paymentId,
        expiresAt,
      },
    }),
  ]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Webhook от ЮKassa
    if (body.event === "payment.succeeded" || body.event === "payment.canceled") {
      const authHeader = request.headers.get("authorization");
      if (!verifyWebhookAuth(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const yookassaId = body.object?.id;
      if (!yookassaId) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const payment = await prisma.payment.findUnique({ where: { yookassaId } });
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      if (body.event === "payment.succeeded") {
        await activateListing(payment.id);
      } else {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "CANCELED" },
        });
      }

      return NextResponse.json({ success: true });
    }

    // Ручное подтверждение (демо-режим / return URL)
    const { paymentId } = body;
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.yookassaId && !payment.yookassaId.startsWith("demo_")) {
      const yooPayment = await getYooKassaPayment(payment.yookassaId);
      if (yooPayment?.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
      }
    }

    await activateListing(payment.id);
    return NextResponse.json({ success: true, status: "SUCCEEDED" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
