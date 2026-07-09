"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Loader } from "lucide-react";

function PaymentResult() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!paymentId) {
      setStatus("error");
      return;
    }

    fetch("/api/payments/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    })
      .then((r) => {
        if (r.ok) setStatus("success");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [paymentId]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <Loader className="w-10 h-10 text-forest-500 animate-spin mx-auto mb-4" />
        <p className="text-forest-500">Проверяем оплату...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">Оплата успешна!</h2>
        <p className="text-forest-500 mb-6">Ваше объявление отправлено на модерацию с выбранным тарифом.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors">
          Мои объявления
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">Ошибка оплаты</h2>
      <p className="text-forest-500 mb-6">Попробуйте ещё раз или обратитесь в поддержку.</p>
      <Link href="/sell" className="px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors">
        Попробовать снова
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full mx-4">
        <Suspense>
          <PaymentResult />
        </Suspense>
      </div>
    </div>
  );
}
