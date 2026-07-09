import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "FloraMarket — Маркетплейс ботанических растений",
  description:
    "Покупайте и продавайте ботанические растения. VIP и срочные объявления. Безопасные сделки между коллекционерами и садоводами.",
  keywords: "растения, ботаника, маркетплейс, комнатные растения, продажа растений",
  openGraph: {
    title: "FloraMarket — Маркетплейс ботанических растений",
    description: "Покупайте и продавайте ботанические растения",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
