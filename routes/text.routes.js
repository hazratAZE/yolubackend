const router = require("express").Router();

const TERMS = {
  en: `
Terms of Service & Privacy Policy – Yolu

1. Introduction
Yolu is a platform for creating CVs and applying to jobs.

2. Accounts
You must use a valid Google account.

3. User Content
You are responsible for your CV and data.

4. Data Storage
Data is stored securely via Firebase.

5. Platform Usage
No illegal or misleading content allowed.

6. Virtual Currency
Connects have no real monetary value.

7. Ads
App may show advertisements.

8. Jobs
We do not guarantee job accuracy.

9. Updates
App may require forced updates.

10. Privacy
We collect name, email, CV data.
We do NOT sell your data.
`,

  az: `
Yolu – Şərtlər və Məxfilik Siyasəti

1. Giriş
Yolu CV yaratmaq və işlərə müraciət etmək üçün platformadır.

2. Hesab
Google hesabı ilə daxil olmalısınız.

3. Məlumatlar
Daxil etdiyiniz məlumatlara görə məsuliyyət daşıyırsınız.

4. Saxlanma
Məlumatlar Firebase-də saxlanılır.

5. İstifadə
Qanunsuz məzmun qadağandır.

6. Virtual Valyuta
Connect-lərin real pul dəyəri yoxdur.

7. Reklam
Tətbiqdə reklamlar göstərilə bilər.

8. İş elanları
Dəqiqliyə zəmanət verilmir.

9. Yeniləmələr
Tətbiq məcburi yenilənə bilər.

10. Məxfilik
Ad, email və CV məlumatları toplanır.
Məlumatlar satılmır.
`,

  ru: `
Yolu – Условия и Политика конфиденциальности

1. Введение
Yolu – платформа для создания CV и отклика на вакансии.

2. Аккаунт
Вход через Google обязателен.

3. Данные
Вы несете ответственность за свои данные.

4. Хранение
Данные хранятся в Firebase.

5. Использование
Запрещен незаконный контент.

6. Виртуальная валюта
Connect не имеет реальной ценности.

7. Реклама
Приложение может показывать рекламу.

8. Вакансии
Мы не гарантируем достоверность.

9. Обновления
Может требоваться обновление.

10. Конфиденциальность
Собираются имя, email и CV.
Данные не продаются.
`,
};
router.get("/about", (req, res) => {
  const lang = req.query.lang || "en";

  const texts = {
    en: "Yolu is a modern platform that helps users create professional CVs and connect with job opportunities faster. Our mission is to simplify job searching and make hiring more accessible for everyone.",

    az: "Yolu istifadəçilərə peşəkar CV hazırlamaq və iş imkanları ilə daha sürətli əlaqə qurmaq imkanı verən müasir platformadır. Məqsədimiz iş axtarışını sadələşdirməkdir.",

    ru: "Yolu — это современная платформа, которая помогает пользователям создавать профессиональные резюме и быстрее находить работу. Наша цель — упростить процесс поиска работы.",
  };

  return res.json({
    success: true,
    text: texts[lang] || texts.en,
  });
});
router.get("/terms", (req, res) => {
  let { lang } = req.query;

  // default EN
  if (!lang) lang = "en";

  // normalize
  lang = lang.toLowerCase();

  // fallback
  if (!TERMS[lang]) {
    lang = "en";
  }

  return res.status(200).json({
    success: true,
    lang,
    text: TERMS[lang],
  });
});

module.exports = router;
