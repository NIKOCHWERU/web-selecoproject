# 📧 Panduan Lengkap Setup Roundcube Webmail & Mailserver SELECO
**Domain:** `selecoproject.com`  
**Webmail URL:** `https://mail.selecoproject.com`  
**Alamat Email:** `hello@selecoproject.com`  

---

## 🛡️ Arsitektur Keamanan yang Diterapkan

Setup ini menggunakan standar keamanan email enterprise kelas industri:

1. **Roundcube Webmail Modern (Frontend)**:
   - Antarmuka webmail responsif (Skin *Elastic* modern).
   - Enkripsi password session menggunakan **DES Key 24-karakter**.
   - Batas lampiran (*attachment*) hingga **50 MB**.
   - Hanya dapat diakses melalui koneksi terenkripsi HTTPS.

2. **Docker Mailserver Hardened (Backend Postfix + Dovecot)**:
   - **Modern TLS**: Hanya mengizinkan protokol enkripsi aman **TLSv1.2 dan TLSv1.3** (menonaktifkan protokol usang SSLv2/SSLv3/TLS1.0/TLS1.1).
   - **Rspamd**: Filter cerdas anti-spam, greylisting, dan reputasi email otomatis.
   - **OpenDKIM**: Penandatanganan kriptografis digital 2048-bit pada setiap email keluar agar tidak dicap spam oleh Google/Yahoo/Microsoft.
   - **Fail2ban**: Otomatis memblokir IP penyerang yang mencoba brute-force password email setelah 5 kali gagal.
   - **Spoof Protection**: Mencegah akun lain memalsukan identitas pengirim `hello@selecoproject.com`.

3. **Nginx Reverse Proxy & SSL**:
   - Otomatis redirect HTTP ke **HTTPS (Port 443)**.
   - **HSTS (HTTP Strict Transport Security)** diaktifkan dengan durasi 2 tahun.
   - Security headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, dan `Referrer-Policy`.

4. **Firewall (UFW)**:
   - Port 22 (SSH), 80 (HTTP), 443 (HTTPS), 25 (SMTP Inbound), 465 (SMTPS), 587 (Submission), 993 (IMAPS) terkelola ketat.

---

## 📋 LANGKAH 1: Atur DNS Record (Cloudflare / Registrar Domain)

Sebelum menjalankan instalasi di server, tambahkan 5 record DNS berikut di panel DNS domain Anda (Cloudflare, Niagahoster, Domainesia, dll):

| Tipe | Nama / Host | Nilai / Target | TTL | Proxy Status (Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `mail` | `IP_VPS_ANDA` | Auto / 1 Jam | **DNS Only** (Awan Abu-abu / OFF)* |
| **MX** | `@` | `mail.selecoproject.com` | Auto | Priority: `10` |
| **TXT** | `@` | `v=spf1 mx a:mail.selecoproject.com ip4:IP_VPS_ANDA ~all` | Auto | - |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:hello@selecoproject.com` | Auto | - |
| **TXT** | `mail._domainkey` | *(Akan didapatkan otomatis dari script setup)* | Auto | - |

> ⚠️ **PENTING (Khusus Pengguna Cloudflare):**  
> Untuk record **A `mail`**, pastikan statusnya **DNS Only** (jangan di-proxy / awan abu-abu), karena Cloudflare tidak mem-proxy port protokol email non-HTTP (Port 25, 465, 587, 993).

---

## 🚀 LANGKAH 2: Jalankan Script Otomatis di Server VPS

Masuk ke terminal VPS Ubuntu Anda dan jalankan perintah berikut:

```bash
# 1. Masuk ke direktori web
cd /var/www/web-selecoproject

# 2. Ambil update file setup terbaru dari GitHub
git pull origin main

# 3. Jalankan script setup otomatis dengan hak akses sudo/root
sudo bash setup-mail.sh
```

### Apa yang Dilakukan Script Ini Secara Otomatis?
1. Menginstall dependensi (Docker, Docker Compose, Certbot, UFW).
2. Membuka port email dan mengaktifkan firewall UFW secara aman (tanpa mematikan SSH).
3. Mengambil sertifikat SSL resmi Let's Encrypt untuk `mail.selecoproject.com`.
4. Mengaktifkan Nginx reverse proxy dengan konfigurasi SSL hardened.
5. Menjalankan container Docker Mailserver & Roundcube.
6. Meminta Anda memasukkan password untuk akun `hello@selecoproject.com`.
7. Men-generate kunci digital **DKIM (2048-bit)** dan menampilkan nilai TXT DNS yang perlu Anda masukkan.

---

## 🔑 LANGKAH 3: Akses Webmail Roundcube

Setelah script selesai:
1. Buka browser: **[https://mail.selecoproject.com](https://mail.selecoproject.com)**
2. Masukkan kredensial:
   - **Username:** `hello@selecoproject.com`
   - **Password:** *(Password yang Anda masukkan saat menjalankan script)*
   - **Server:** *(Sudah otomatis terhubung ke mailserver lokal)*
3. Anda langsung masuk ke inbox Roundcube dan siap mengirim/menerima email.

---

## 📱 LANGKAH 4: Konfigurasi Email di HP / Laptop (Outlook / Apple Mail / Thunderbird)

Jika Anda ingin membuka email `hello@selecoproject.com` di aplikasi HP (Gmail App, Apple Mail, Outlook):

- **Incoming Server (IMAP):**
  - Hostname: `mail.selecoproject.com`
  - Port: `993`
  - Keamanan: `SSL/TLS`
  - Username: `hello@selecoproject.com`
  - Password: `[Password Anda]`

- **Outgoing Server (SMTP):**
  - Hostname: `mail.selecoproject.com`
  - Port: `465` (atau `587`)
  - Keamanan: `SSL/TLS` (atau `STARTTLS` untuk port 587)
  - Otentikasi: Diperlukan (Gunakan username & password yang sama)

---

## 🛠️ Perintah Manajemen Email Penting di VPS

Berikut perintah praktis jika suatu saat ingin menambah akun atau mengganti password:

```bash
# Mengganti password akun hello@selecoproject.com:
docker exec -it mailserver setup email update hello@selecoproject.com PASSWORD_BARU

# Menambah akun email baru (misal: admin@selecoproject.com):
docker exec -it mailserver setup email add admin@selecoproject.com PASSWORD_ANDA

# Melihat daftar semua akun email yang aktif:
docker exec -it mailserver setup email list

# Melihat status log pengiriman & penerimaan email real-time:
docker logs -f mailserver

# Melihat status keamanan Fail2ban (IP yang diblokir):
docker exec -it mailserver setup fail2ban
```

---

## 🔍 Tips Keamanan Tambahan & Pengujian Skor Email (10/10)

1. **Cek Port 25 Outbound Provider:**
   Beberapa penyedia VPS (seperti Tencent Cloud, DigitalOcean, AWS) memblokir pengiriman keluar Port 25 secara default untuk mencegah spam.  
   *Uji port 25:*
   ```bash
   telnet smtp.gmail.com 25
   ```
   Jika muncul "Connected", berarti port 25 terbuka. Jika "Connection timed out", hubungi tim support provider VPS Anda melalui tiket support: *"Please unblock outbound SMTP port 25 for our legitimate corporate business email hello@selecoproject.com"*.

2. **Atur Reverse DNS (rDNS / PTR Record):**
   Di dashboard VPS Anda, atur PTR Record IP server Anda agar mengarah ke `mail.selecoproject.com`. Ini membuat email Anda diakui 100% sah oleh Gmail dan Yahoo.

3. **Uji Skor Email di Mail-Tester:**
   Kirim email percobaan dari Roundcube ke alamat pengujian di **[https://www.mail-tester.com](https://www.mail-tester.com)**. Anda akan melihat laporan lengkap dengan skor **10/10 (Perfect Score)**.
