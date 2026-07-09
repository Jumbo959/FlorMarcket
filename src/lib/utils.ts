import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getCompanyInfo() {
  return {
    name: process.env.COMPANY_NAME || "ИП Пример",
    inn: process.env.COMPANY_INN || "000000000000",
    ogrn: process.env.COMPANY_OGRN || "0000000000000",
    address: process.env.COMPANY_ADDRESS || "г. Москва",
    email: process.env.COMPANY_EMAIL || "info@flora-market.ru",
    phone: process.env.COMPANY_PHONE || "+7 (999) 123-45-67",
  };
}
