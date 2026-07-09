import { getCompanyInfo } from "@/lib/utils";

export default function DeliveryPage() {
  const company = getCompanyInfo();

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-8">Доставка и получение товара</h1>
        <div className="space-y-6 text-forest-600 leading-relaxed">
          <p>FloraMarket — это информационная площадка для размещения объявлений о продаже ботанических растений. Сайт не осуществляет доставку товаров и не является стороной сделки между продавцом и покупателем.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">Способы получения</h2>
          <p>Способ передачи растения определяется продавцом и покупателем при личном контакте. Возможные варианты:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Самовывоз</strong> — покупатель забирает растение у продавца по указанному адресу</li>
            <li><strong>Личная встреча</strong> — встреча в удобном для обеих сторон месте</li>
            <li><strong>Доставка курьером</strong> — по договорённости между продавцом и покупателем</li>
            <li><strong>Почтовая отправка</strong> — при возможности безопасной транспортировки растения</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-forest-800">Платные услуги сайта</h2>
          <p>Услуги «Срочная продажа» и «VIP-размещение» предоставляются в электронном виде немедленно после оплаты и прохождения модерации. Физическая доставка не требуется.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">Ответственность</h2>
          <p>{company.name} не несёт ответственности за качество растений, сроки и условия передачи товара между пользователями. Рекомендуем осматривать растение перед покупкой.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">Контакты</h2>
          <p>По вопросам работы площадки: {company.email}, {company.phone}</p>
        </div>
      </div>
    </div>
  );
}
