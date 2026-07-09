import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { getCompanyInfo } from "@/lib/utils";

export function Footer() {
  const company = getCompanyInfo();

  return (
    <footer className="bg-forest-900 text-forest-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                FloraMarket
              </span>
            </div>
            <p className="text-sm text-forest-300 leading-relaxed">
              Маркетплейс ботанических растений. Покупайте и продавайте растения с заботой о природе.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Продать растение</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Тарифы</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Личный кабинет</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/offer" className="hover:text-white transition-colors">Публичная оферта</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/legal/delivery" className="hover:text-white transition-colors">Доставка и получение</Link></li>
              <li><Link href="/legal/contacts" className="hover:text-white transition-colors">Контакты и реквизиты</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-forest-400" />
                <a href={`tel:${company.phone}`} className="hover:text-white transition-colors">{company.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-400" />
                <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">{company.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-forest-400 mt-0.5" />
                <span>{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-forest-400">
          <p>© {new Date().getFullYear()} FloraMarket. Все права защищены.</p>
          <p>{company.name} · ИНН {company.inn}</p>
        </div>
      </div>
    </footer>
  );
}
