# Türkçe Yama Platformu

PC oyunları için Türkçe yamaları keşfetmeyi, incelemeyi ve yönetmeyi sağlayan bir web platformu! Node.js, Express ve MongoDB altyapısıyla geliştirilen proje, oyun yamalarının merkezi bir veritabanında saklanmasını ve tüm ziyaretçilere aynı verilerin sunulmasını amaçlıyor.

## Özellikler

- **Yama listeleme:** Oyunların açıklamalarını, geliştiricilerini, sürümlerini ve platform bilgilerini görüntüleme.
- **Yönetim paneli:** Yeni yama ekleme, mevcut yamaları düzenleme ve silme.
- **MongoDB entegrasyonu:** Verilerin kalıcı olarak veritabanında saklanması.
- **Yama detayları:** Çevirmen, ilerleme durumu, indirme bağlantıları ve görseller.
- **Yorum sistemi:** Yamalar hakkında kullanıcı yorumları.
- **Puanlama sistemi:** Kullanıcıların yamalara puan verebilmesi.
- **İndirme takibi:** Yama indirme sayılarının kaydedilmesi.
- **REST API:** Frontend ile backend arasında veri iletişimi.

## Teknolojiler

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Nodemon

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) veya [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git (isteğe bağlı)

### 1. Projeyi indirin

```bash
git clone <repository-url>
cd turkce-yama-platform
```

Alternatif olarak GitHub üzerinden ZIP dosyasını indirebilir ve proje klasörüne çıkarabilirsiniz.

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini yapılandırın

Proje ana dizininde `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

`.env` dosyasını kendi ortamınıza göre düzenleyin:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/turkce_yama
ADMIN_USER=admin
ADMIN_PASSWORD=guclu_ve_benzersiz_bir_sifre
```

`MONGO_URI`, MongoDB bağlantı adresidir. Yerel MongoDB kullanıyorsanız MongoDB servisinin çalıştığından emin olun. MongoDB Atlas kullanıyorsanız bağlantı adresinizi buraya girin.

**Güvenlik:** `ADMIN_PASSWORD` değerini değiştirin. `.env` dosyasını GitHub'a yüklemeyin ve gizli bilgilerinizi kimseyle paylaşmayın.

### 4. Sunucuyu başlatın

Geliştirme modu:

```bash
npm run dev
```

Normal başlatma:

```bash
npm start
```

MongoDB bağlantısı başarılı olduğunda siteye aşağıdaki adres üzerinden erişebilirsiniz:

**http://localhost:5000**

Siteyi doğrudan `index.html` dosyasını açarak çalıştırmayın. API bağlantısı için Node.js sunucusunun çalışması gerekir.

## API Uç Noktaları

| Metot | Uç nokta | Açıklama |
|---|---|---|
| `GET` | `/api/test` | API bağlantısını kontrol eder. |
| `GET` | `/api/translations` | Tüm yamaları getirir. |
| `GET` | `/api/translations/:id` | Belirli bir yamayı getirir. |
| `POST` | `/api/translations` | Yeni yama ekler. |
| `PUT` | `/api/translations/:id` | Bir yamayı günceller. |
| `DELETE` | `/api/translations/:id` | Bir yamayı siler. |
| `POST` | `/api/translations/:id/comments` | Yorum ekler. |
| `POST` | `/api/translations/:id/rate` | Yama puanlaması yapar. |
| `POST` | `/api/translations/:id/download` | İndirme sayısını artırır. |

Yönetim gerektiren işlemler sunucu tarafındaki yetkilendirme kontrollerine tabidir.

## Proje Yapısı

```text
turkce-yama-platform/
├── middleware/
│   └── adminAuth.js
├── models/
│   └── Translation.js
├── routes/
│   ├── admin.js
│   └── translations.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── admin.js
│   │   ├── data.js
│   │   └── bg-lines.js
│   ├── admin.html
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

- `server.js`: Express sunucusu ve MongoDB bağlantısı.
- `models/Translation.js`: Yama verilerinin Mongoose şeması.
- `routes/translations.js`: Yama işlemlerini yöneten API rotaları.
- `routes/admin.js`: Yönetici işlemleri.
- `middleware/adminAuth.js`: Yönetici yetkilendirme katmanı.
- `public/`: Kullanıcı arayüzü ve frontend dosyaları.

## Yayınlama

Projeyi internette yayınlamak için Node.js destekleyen bir hosting servisi ve erişilebilir bir MongoDB veritabanı gerekir.

Örnek altyapı:

- **Hosting:** Render veya benzeri bir Node.js platformu.
- **Veritabanı:** MongoDB Atlas.
- **Kaynak kodu:** GitHub.

Yayınlama sırasında `MONGO_URI`, `ADMIN_USER` ve `ADMIN_PASSWORD` gibi ortam değişkenlerini hosting servisinin ayarlarından tanımlayın. Üretim ortamında yönetici şifresini değiştirin ve yetkilendirme mekanizmasını kontrol edin.

## Katkıda Bulunma

Projeye katkıda bulunmak için:

1. Repository'yi fork edin.
2. Yeni bir branch oluşturun.
3. Değişikliklerinizi yapın ve test edin.
4. Pull request gönderin.

## Lisans

Bu projeye ait lisans henüz belirtilmemiştir. Yeniden kullanım ve dağıtım koşulları için repository sahibinin lisans tercihi açıklanmalıdır.

---

**Oyunlar için Türkçe yama platformu.**
