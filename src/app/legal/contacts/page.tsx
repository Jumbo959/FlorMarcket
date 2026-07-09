import { getCompanyInfo } from "@/lib/utils";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactsPage() {
  const company = getCompanyInfo();

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-8">Контакты и реквизиты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-forest-800 mb-4">Связаться с нами</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-forest-600">
                <Phone className="w-5 h-5 text-forest-400" />
                <a href={`tel:${company.phone}`} className="hover:text-forest-800">{company.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-forest-600">
                <Mail className="w-5 h-5 text-forest-400" />
                <a href={`mailto:${company.email}`} className="hover:text-forest-800">{company.email}</a>
              </li>
              <li className="flex items-start gap-3 text-forest-600">
                <MapPin className="w-5 h-5 text-forest-400 mt-0.5" />
                <span>{company.address}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-forest-800 mb-4">Юридические реквизиты</h2>
            <dl className="space-y-2 text-sm text-forest-600">
              <div className="flex justify-between"><dt className="text-forest-400">Наименование</dt><dd className="font-medium">{company.name}</dd></div>
              <div className="flex justify-between"><dt className="text-forest-400">ИНН</dt><dd className="font-medium">{company.inn}</dd></div>
              <div className="flex justify-between"><dt className="text-forest-400">ОГРН</dt><dd className="font-medium">{company.ogrn}</dd></div>
              <div className="flex justify-between"><dt className="text-forest-400">Адрес</dt><dd className="font-medium text-right">{company.address}</dd></div>
            </dl>
          </div>
        </div>

        <div className="bg-forest-50 rounded-2xl p-6 text-sm text-forest-600">
          <p>Время ответа на обращения: в течение 1 рабочего дня. По вопросам оплаты и возврата средств обращайтесь на {company.email}.</p>
        </div>
      </div>
    </div>
  );
}
