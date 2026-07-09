"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, User, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/logout")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/sell", label: "Продать" },
    { href: "/pricing", label: "Тарифы" },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-lg py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 bg-forest-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold text-forest-800">
              Flora<span className="text-forest-500">Market</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-forest-500 text-white shadow-md"
                    : "text-forest-700 hover:bg-forest-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gold hover:bg-gold/10 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Админ
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-forest-500 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-medium bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors shadow-md"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-forest-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-forest-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-forest-700 hover:bg-forest-50"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-forest-100" />
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-forest-700">
                    Личный кабинет
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gold">
                      Админ-панель
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg text-red-600">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-forest-700">
                    Войти
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg bg-forest-500 text-white text-center">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
