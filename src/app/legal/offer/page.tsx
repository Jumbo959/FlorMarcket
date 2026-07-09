import { getCompanyInfo } from "@/lib/utils";

export default function OfferPage() {
  const company = getCompanyInfo();

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-8">Публичная оферта</h1>
        <div className="prose prose-forest max-w-none space-y-6 text-forest-600 leading-relaxed">
          <p>Настоящий документ является официальным предложением (публичной офертой) {company.name} (далее — «Исполнитель») заключить договор на оказание услуг по размещению объявлений на интернет-площадке FloraMarket.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">1. Предмет договора</h2>
          <p>Исполнитель предоставляет Пользователю услуги по размещению объявлений о продаже ботанических растений на сайте flora-market.ru, включая платные услуги «Срочная продажа» и «VIP-размещение».</p>

          <h2 className="font-display text-xl font-bold text-forest-800">2. Стоимость услуг</h2>
          <p>Стоимость платных услуг размещения указана на странице <a href="/pricing" className="text-forest-500 hover:underline">Тарифы</a>. Исполнитель вправе изменять стоимость услуг, уведомив Пользователей путём публикации на сайте.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">3. Порядок оплаты</h2>
          <p>Оплата услуг производится через платёжную систему ЮKassa (НКО «ЮМани»). Моментом оплаты считается поступление денежных средств на расчётный счёт Исполнителя.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">4. Возврат средств</h2>
          <p>Возврат денежных средств за неоказанные услуги осуществляется в течение 10 рабочих дней с момента получения письменного заявления Пользователя на email: {company.email}. Возврат не производится, если объявление было опубликовано и услуга оказана.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">5. Права и обязанности сторон</h2>
          <p>Исполнитель обязуется обеспечить функционирование площадки и модерацию объявлений. Пользователь обязуется предоставлять достоверную информацию о растениях и не размещать запрещённый контент.</p>

          <h2 className="font-display text-xl font-bold text-forest-800">6. Реквизиты</h2>
          <p>
            {company.name}<br />
            ИНН: {company.inn}<br />
            ОГРН: {company.ogrn}<br />
            Адрес: {company.address}<br />
            Email: {company.email}<br />
            Телефон: {company.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
