"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Shield, AlertCircle, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

function DemoPayment() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount") || "0";
  const description = searchParams.get("description") || "Оплата услуги";
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  async function handlePay() {
    setProcessing(true);
    if (paymentId) {
      await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
    } else {
      await new Promise((r) => setTimeout(r, 1500));
    }
    setDone(true);
    setProcessing(false);
  }

  if (done) {
    return (
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">Оплата прошла успешно!</h2>
        <p className="text-forest-500 mb-6">Демо-режим. После подключения ЮKassa здесь будет реальная оплата.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors">
          В личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm mb-6">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Демо-режим оплаты. После модерации ЮKassa подключите токены в .env
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-forest-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-800 mb-2">Оплата услуги</h1>
        <p className="text-forest-500">{description}</p>
        <p className="text-3xl font-bold text-forest-700 mt-4">{formatPrice(parseFloat(amount))}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="p-4 border-2 border-forest-200 rounded-xl bg-forest-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-forest-500" />
            </div>
            <div>
              <p className="font-medium text-forest-800">Банковская карта</p>
              <p className="text-xs text-forest-400">Visa, Mastercard, МИР</p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-forest-100 rounded-xl opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg">💳</span>
            </div>
            <div>
              <p className="font-medium text-forest-800">ЮMoney</p>
              <p className="text-xs text-forest-400">Кошелёк ЮMoney</p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-forest-100 rounded-xl opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-lg">🏦</span>
            </div>
            <div>
              <p className="font-medium text-forest-800">СБП</p>
              <p className="text-xs text-forest-400">Система быстрых платежей</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full py-4 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 transition-colors disabled:opacity-50 shadow-lg"
      >
        {processing ? "Обработка..." : `Оплатить ${formatPrice(parseFloat(amount))}`}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-forest-400">
        <Shield className="w-3 h-3" />
        Безопасная оплата через ЮKassa
      </div>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen leaf-pattern flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <Suspense>
            <DemoPayment />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
