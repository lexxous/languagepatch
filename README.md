<<<<<<< HEAD
# TR-NEXUS Türkçe Yama Platformu

Bu sürüm LocalStorage yerine Node.js + Express + MongoDB kullanır. Panelden eklenen, güncellenen ve silinen yamalar MongoDB'de tutulur ve siteyi ziyaret eden herkes aynı verileri görür.

## Çalıştırma

1. MongoDB servisinin çalıştığından emin olun.
2. Proje klasöründe terminal açın.
3. Bağımlılıkları kurun:

```bash
npm install
```

4. `.env` dosyasını kontrol edin:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/turkce_yama
ADMIN_USER=admin
ADMIN_PASSWORD=guclu_sifreniz
```

5. Geliştirme sunucusunu çalıştırın:

```bash
npm run dev
```

6. Tarayıcıdan açın: `http://localhost:5000`

## Önemli

- Siteyi `index.html` dosyasına çift tıklayarak açmayın. API'nin çalışması için `npm run dev` ile açılmalıdır.
- Yönetici şifresini yayınlamadan önce `.env` içinden değiştirin.
- `.env` dosyasını GitHub'a yüklemeyin.
- MongoDB verileri `turkce_yama` veritabanında saklanır.

## API uçları

- `GET /api/translations` — tüm yamalar
- `POST /api/translations` — yeni yama (yönetici)
- `PUT /api/translations/:id` — yama düzenleme (yönetici)
- `DELETE /api/translations/:id` — yama silme (yönetici)
- `POST /api/translations/:id/comments` — yorum ekleme
- `POST /api/translations/:id/rate` — puan verme
- `POST /api/translations/:id/download` — indirme sayısını artırma
=======
# T-rk-e-Yama-eviri-Sitesi
Bu proje, basit bir Türkçe yama web sitesi örneğidir. Gerçek bir sistemi yansıtmamaktadır.
>>>>>>> bf28c2395cf5d230f79c21d734d56f3de92cf027
