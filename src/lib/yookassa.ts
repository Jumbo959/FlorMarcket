/**
 * Шаблон интеграции ЮKassa (ЮMoney)
 * Документация: https://yookassa.ru/developers/api
 *
 * После модерации заполните в .env:
 * YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY
 */

const YOOKASSA_API = "https://api.yookassa.ru/v3";

export interface CreatePaymentParams {
  amount: number;
  description: string;
  returnUrl: string;
  paymentId?: string;
  metadata?: Record<string, string>;
}

export interface YooKassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  confirmation?: {
    type: string;
    confirmation_url?: string;
  };
  amount: { value: string; currency: string };
}

function getCredentials() {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    return null;
  }

  return { shopId, secretKey };
}

export function isYooKassaConfigured(): boolean {
  return getCredentials() !== null;
}

export async function createYooKassaPayment(
  params: CreatePaymentParams
): Promise<YooKassaPayment | { demo: true; confirmation_url: string }> {
  const creds = getCredentials();

  // Демо-режим до подключения токенов
  if (!creds) {
    const demoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/demo?paymentId=${params.paymentId || ""}&amount=${params.amount}&description=${encodeURIComponent(params.description)}`;
    return { demo: true, confirmation_url: demoUrl };
  }

  const idempotenceKey = crypto.randomUUID();

  const response = await fetch(`${YOOKASSA_API}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: `Basic ${Buffer.from(`${creds.shopId}:${creds.secretKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: {
        value: params.amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: params.returnUrl,
      },
      description: params.description,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ЮKassa error: ${error}`);
  }

  return response.json();
}

export async function getYooKassaPayment(paymentId: string): Promise<YooKassaPayment | null> {
  const creds = getCredentials();
  if (!creds) return null;

  const response = await fetch(`${YOOKASSA_API}/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${creds.shopId}:${creds.secretKey}`).toString("base64")}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export function verifyWebhookAuth(authHeader: string | null): boolean {
  const creds = getCredentials();
  if (!creds || !authHeader) return false;

  const expected = `Basic ${Buffer.from(`${creds.shopId}:${creds.secretKey}`).toString("base64")}`;
  return authHeader === expected;
}
