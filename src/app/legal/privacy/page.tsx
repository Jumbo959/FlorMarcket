import { getCompanyInfo } from "@/lib/utils";

export default function PrivacyPage() {
  const company = getCompanyInfo();

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-8">Политика конфиденциальности</h1>
        <div className="space-y-6 text-forest-600 leading-relaxed">
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта FloraMarket, принадлежащего {company.name}.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">1. Собираемые данные</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Имя и фамилия</li>
            <li>Адрес электронной почты</li>
            <li>Номер телефона (при указании)</li>
            <li>Данные об объявлениях</li>
            <li>Технические данные (IP-адрес, cookies)</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-forest-800">2. Цели обработки</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Регистрация и авторизация на сайте</li>
            <li>Размещение и модерация объявлений</li>
            <li>Обработка платежей через ЮKassa</li>
            <li>Обратная связь с пользователями</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-forest-800">3. Защита данных</h2>
          <p>Мы применяем технические и организационные меры для защиты персональных данных: шифрование паролей, HTTPS-соединение, ограничение доступа к данным.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">4. Передача третьим лицам</h2>
          <p>Данные могут передаваться платёжной системе ЮKassa для обработки платежей. Мы не передаём данные третьим лицам в иных целях без согласия пользователя.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">5. Права пользователя</h2>
          <p>Вы вправе запросить удаление или изменение своих персональных данных, направив запрос на {company.email}.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">6. Контакты</h2>
          <p>{company.name}, {company.email}, {company.phone}</p>
        </div>
      </div>
    </div>
  );
}
