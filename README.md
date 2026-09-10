# SELECO WEB - Deployment & Setup Guide

Panduan lengkap dari clone hingga web online beserta pengaturan email Roundcube.

## 1. Persiapan VPS
Pastikan VPS Anda (Ubuntu/Debian) sudah terinstall:
- Node.js (v18+) & npm
- PM2 (`npm install -g pm2`)
- Nginx
- Docker & Docker Compose (Untuk Roundcube Webmail)

## 2. Clone & Setup Web
Jalankan perintah berikut di VPS Anda:

```bash
# 1. Clone repository (ganti URL dengan URL repo Anda)
git clone https://github.com/USERNAME/seleco-web.git
cd seleco-web

# 2. Copy environment variables
cp .env.example .env
# Edit .env jika diperlukan (secara default sudah selecoproject.com)

# 3. Install dependencies
npm install

# 4. Build aplikasi Next.js
npm run build

# 5. Jalankan dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 3. Setup Nginx (Domain)
Web Anda berjalan di port `3000`. Kita gunakan Nginx sebagai reverse proxy.

```bash
# 1. Copy config nginx yang sudah disediakan
sudo cp nginx.conf /etc/nginx/sites-available/seleco
sudo ln -s /etc/nginx/sites-available/seleco /etc/nginx/sites-enabled/

# 2. Test konfigurasi & Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```
*Catatan: Sangat disarankan untuk menginstall SSL menggunakan Certbot (`sudo certbot --nginx -d selecoproject.com -d www.selecoproject.com -d mail.selecoproject.com`)*

## 4. Setup Roundcube Webmail
Roundcube digunakan sebagai antarmuka untuk membaca email `hello@selecoproject.com`. (Pastikan Mail Server IMAP/SMTP sudah ada/di-setup terpisah).

```bash
# 1. Jalankan container Roundcube
docker-compose -f docker-compose.roundcube.yml up -d

# 2. Akses Webmail
# Buka http://mail.selecoproject.com di browser.
# Login menggunakan email: hello@selecoproject.com dan password email Anda.
```

## 5. Konfigurasi Tema & Floating WA
- **Tema:** Semua warna sudah diubah menjadi dominan Navy gelap (`#071426` & `#0B1F3A`), dengan aksen Gold (`#C9A227`), dan teks Putih.
- **WhatsApp:** Floating button WA sudah ditambahkan di kanan bawah layar dengan icon yang menyesuaikan warna tema (Navy & Gold).
