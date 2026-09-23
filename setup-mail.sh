#!/usr/bin/env bash
# ==============================================================================
# SCRIPT OTOMATIS SETUP EMAIL SERVER & ROUNDCUBE WEBMAIL
# Domain: selecoproject.com | Subdomain: mail.selecoproject.com
# Akun Email: hello@selecoproject.com
# ==============================================================================

set -e

# Warna teks untuk terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "================================================================="
echo "   SETUP OTOMATIS ROUNDCUBE WEBMAIL & MAILSERVER SELECO"
echo "   Domain   : selecoproject.com"
echo "   Subdomain: mail.selecoproject.com"
echo "   Email    : hello@selecoproject.com"
echo "================================================================="
echo -e "${NC}"

# 1. Pastikan script dijalankan sebagai root / sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Harap jalankan script ini dengan hak akses root atau sudo:${NC}"
  echo "sudo bash setup-mail.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 2. Periksa dependensi dasar
echo -e "\n${BLUE}[1/7] Memeriksa & menginstall dependensi yang diperlukan...${NC}"
apt update -y
apt install -y psmisc lsof curl openssl

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker belum terpasang. Menginstall Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm -f get-docker.sh
fi

if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Menginstall Certbot Nginx...${NC}"
    apt install -y certbot python3-certbot-nginx
fi

if ! command -v ufw &> /dev/null; then
    apt install -y ufw
fi

# 3. Menghentikan service mail bawaan host (Postfix / Dovecot / Exim) agar tidak bentrok
echo -e "\n${BLUE}[*] Memeriksa & membebaskan port mail dari layanan bawaan host (Dovecot/Postfix)...${NC}"
for svc in dovecot postfix exim4 courier-imap sendmail; do
    if systemctl is-active --quiet "$svc" 2>/dev/null; then
        echo -e "${YELLOW}Menghentikan dan menonaktifkan service $svc di host Ubuntu...${NC}"
        systemctl stop "$svc" || true
        systemctl disable "$svc" || true
    fi
done

# Pastikan port 25, 143, 465, 587, 993 benar-benar bebas jika ada proses lain di host
for p in 25 143 465 587 993; do
    if lsof -i :$p -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}Membebaskan port $p yang masih ditahan proses host...${NC}"
        fuser -k ${p}/tcp 2>/dev/null || true
    fi
done
sleep 2

# 4. Konfigurasi Firewall UFW
echo -e "\n${BLUE}[2/7] Mengonfigurasi Firewall UFW (Keamanan Port Server)...${NC}"
ufw allow 22/tcp comment 'SSH' || true
ufw allow 80/tcp comment 'HTTP Web' || true
ufw allow 443/tcp comment 'HTTPS SSL' || true
ufw allow 25/tcp comment 'SMTP Inbound' || true
ufw allow 465/tcp comment 'SMTPS Secure' || true
ufw allow 587/tcp comment 'SMTP Submission' || true
ufw allow 993/tcp comment 'IMAPS Secure' || true
ufw allow 143/tcp comment 'IMAP' || true

if ! ufw status | grep -q "Status: active"; then
    echo "y" | ufw enable
fi
echo -e "${GREEN}[OK] Firewall UFW telah dikonfigurasi dengan aman.${NC}"

# 5. Generate Sertifikat SSL Let's Encrypt untuk mail.selecoproject.com
echo -e "\n${BLUE}[3/7] Menyiapkan Sertifikat SSL untuk mail.selecoproject.com...${NC}"
mkdir -p /var/www/certbot

SSL_CERT_PATH="/etc/letsencrypt/live/mail.selecoproject.com/fullchain.pem"
if [ ! -f "$SSL_CERT_PATH" ]; then
    echo -e "${YELLOW}Membuat sertifikat Let's Encrypt untuk mail.selecoproject.com...${NC}"
    if certbot certonly --nginx -d mail.selecoproject.com --non-interactive --agree-tos --register-unsafely-without-email; then
        echo -e "${GREEN}[OK] Sertifikat SSL Let's Encrypt berhasil dibuat.${NC}"
    else
        echo -e "${YELLOW}Mencoba mode standalone untuk sertifikasi SSL...${NC}"
        systemctl stop nginx || true
        certbot certonly --standalone -d mail.selecoproject.com --non-interactive --agree-tos --register-unsafely-without-email || true
        systemctl start nginx || true
    fi
else
    echo -e "${GREEN}[OK] Sertifikat SSL Let's Encrypt sudah tersedia.${NC}"
fi

# 6. Pasang Konfigurasi Nginx Reverse Proxy
echo -e "\n${BLUE}[4/7] Menerapkan Konfigurasi Nginx untuk mail.selecoproject.com...${NC}"
if [ -f "$SSL_CERT_PATH" ]; then
    cp "$SCRIPT_DIR/nginx-mail.conf" /etc/nginx/sites-available/mail.selecoproject.com
    ln -sf /etc/nginx/sites-available/mail.selecoproject.com /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}[OK] Nginx berhasil di-reload dengan SSL & Security Headers!${NC}"
else
    echo -e "${RED}[PERINGATAN] Sertifikat SSL belum terbit. Nginx mail belum diaktifkan.${NC}"
fi

# 7. Menyiapkan Direktori & Konfigurasi Eksternal
mkdir -p docker-data/dms/mail-data
mkdir -p docker-data/dms/mail-state
mkdir -p docker-data/dms/mail-logs
mkdir -p docker-data/dms/config
mkdir -p docker-data/roundcube/db
mkdir -p docker-data/roundcube/config

# Berikan hak akses write ke folder database roundcube untuk user www-data (UID 33)
chmod -R 777 docker-data/roundcube/db

# Konfigurasi kustom Roundcube untuk integrasi sempurna
cat << 'EOF' > docker-data/roundcube/config/config.inc.php
<?php
$config['product_name'] = 'SELECO Webmail';
$config['language'] = 'id_ID';
$config['support_url'] = 'https://selecoproject.com';
$config['plugins'] = array('archive', 'zipdownload');

// Opsi koneksi internal SSL/TLS aman
$config['imap_conn_options'] = array(
    'ssl' => array(
        'verify_peer'       => false,
        'verify_peer_name'  => false,
        'allow_self_signed' => true,
    ),
);
$config['smtp_conn_options'] = array(
    'ssl' => array(
        'verify_peer'       => false,
        'verify_peer_name'  => false,
        'allow_self_signed' => true,
    ),
);
EOF

# Konfigurasi Dovecot override agar autentikasi internal lancar
cat << 'EOF' > docker-data/dms/config/dovecot.cf
disable_plaintext_auth = no
EOF

# Deteksi perintah docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}[ERROR] Docker compose tidak ditemukan.${NC}"
    exit 1
fi

# Hentikan dan hapus kontainer lama yang mungkin gagal atau stuck
echo -e "\n${BLUE}[5/7] Menjalankan Container Docker Mailserver & Roundcube...${NC}"
echo "Membersihkan container lama..."
$DOCKER_COMPOSE_CMD -f docker-compose.mail.yml down --remove-orphans 2>/dev/null || true
docker rm -f mailserver roundcube 2>/dev/null || true

# Jalankan kontainer
echo "Menjalankan mailserver & roundcube..."
$DOCKER_COMPOSE_CMD -f docker-compose.mail.yml up -d

echo "Menunggu container mailserver dan roundcube siap..."
for i in {1..30}; do
    if docker ps --filter "name=roundcube" --filter "status=running" | grep -q roundcube; then
        echo -e "${GREEN}[OK] Container roundcube sedang berjalan.${NC}"
        break
    fi
    sleep 1
done
sleep 10

# Fix permission SQLite database di dalam container agar Roundcube bisa menulis
echo "Memperbaiki permission database SQLite Roundcube..."
docker exec -u root roundcube mkdir -p /var/roundcube/db 2>/dev/null || true
docker exec -u root roundcube chown -R www-data:www-data /var/roundcube/db 2>/dev/null || true
docker exec -u root roundcube chmod -R 775 /var/roundcube/db 2>/dev/null || true

# Uji coba port 8000 lokal
echo "Menguji akses Roundcube di port internal 8000..."
RC_READY=false
for i in {1..20}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000 || true)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}[OK] Roundcube webmail merespon dengan sukses (HTTP $HTTP_CODE)!${NC}"
        RC_READY=true
        break
    fi
    sleep 1
done

if [ "$RC_READY" = false ]; then
    echo -e "${YELLOW}[INFO] Roundcube sedang menyelesaikan inisialisasi awal. Log container:${NC}"
    docker logs --tail 30 roundcube || true
fi

# 8. Pembuatan / Update Akun Email hello@selecoproject.com
echo -e "\n${BLUE}[6/7] Menyiapkan Akun Email hello@selecoproject.com...${NC}"

# Ambil password dari argumen $1 atau input manual, default ke SELECO111*
MAIL_PASS="${1:-}"
if [ -z "$MAIL_PASS" ]; then
    read -r -p "Masukkan Password Baru untuk hello@selecoproject.com (tekan Enter untuk 'SELECO111*'): " USER_INPUT_PASS
    MAIL_PASS="${USER_INPUT_PASS:-SELECO111*}"
fi

echo -e "Mengatur akun email hello@selecoproject.com..."
if docker exec -i mailserver setup email list 2>/dev/null | grep -q "hello@selecoproject.com"; then
    docker exec -i mailserver setup email update hello@selecoproject.com "$MAIL_PASS"
else
    docker exec -i mailserver setup email add hello@selecoproject.com "$MAIL_PASS"
fi
echo -e "${GREEN}[OK] Akun hello@selecoproject.com siap digunakan.${NC}"

# 9. Setup DKIM (DomainKeys Identified Mail) untuk Keamanan & Anti-Spam
echo -e "\n${BLUE}[7/7] Men-generate Kunci DKIM untuk Keamanan Pengiriman Email...${NC}"
docker exec -i mailserver setup config dkim domain selecoproject.com || true

DKIM_KEY_FILE="docker-data/dms/config/opendkim/keys/selecoproject.com/mail.txt"

# Restart mailserver agar konfigurasi DKIM aktif
docker restart mailserver
sleep 5

SERVER_IP=$(curl -s https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')

# Selesai & Tampilkan Ringkasan DNS
echo -e "\n${GREEN}${BOLD}=================================================================${NC}"
echo -e "${GREEN}${BOLD}   SETUP EMAIL ROUNDCUBE BERHASIL DISELESAIKAN!                  ${NC}"
echo -e "${GREEN}${BOLD}=================================================================${NC}"
echo -e "${BOLD}Akses Webmail :${NC} https://mail.selecoproject.com"
echo -e "${BOLD}Email Login   :${NC} hello@selecoproject.com"
echo -e "${BOLD}Password      :${NC} ${MAIL_PASS}"
echo ""
echo -e "${YELLOW}${BOLD}KONFIGURASI DNS YANG HARUS DIMASUKKAN DI CLOUDFLARE / DOMAIN MANAGER:${NC}"
echo "-----------------------------------------------------------------"
echo -e "1. ${BOLD}A Record (Subdomain Mail - Sudah ada):${NC}"
echo -e "   Type : A"
echo -e "   Name : mail"
echo -e "   Value: ${SERVER_IP}"
echo -e "   Proxy: DNS Only (Abu-abu / Non-Proxy jika di Cloudflare)"
echo ""
echo -e "2. ${BOLD}MX Record (Penerimaan Email Masuk):${NC}"
echo -e "   Type        : MX"
echo -e "   Name        : @"
echo -e "   Mail Server : mail.selecoproject.com"
echo -e "   Priority    : 10"
echo ""
echo -e "3. ${BOLD}SPF Record (Mencegah Pemalsuan & Masuk Spam):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : @"
echo -e "   Value: v=spf1 mx a:mail.selecoproject.com ip4:${SERVER_IP} ~all"
echo ""
echo -e "4. ${BOLD}DMARC Record (Proteksi Reputasi Domain):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : _dmarc"
echo -e "   Value: v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:hello@selecoproject.com"
echo ""
echo -e "5. ${BOLD}DKIM Record (Tanda Tangan Kriptografi Email):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : mail._domainkey"
if [ -f "$DKIM_KEY_FILE" ]; then
    echo -e "   Isi File DKIM Asli:"
    cat "$DKIM_KEY_FILE"
    echo ""
    CLEAN_DKIM=$(grep -v '^;' "$DKIM_KEY_FILE" | tr -d '\n\t"' | sed -E 's/mail\._domainkey[^ ]*//' | sed 's/IN//' | sed 's/TXT//' | sed 's/(//' | sed 's/)//' | xargs)
    echo -e "   ${BOLD}Nilai TXT Ringkas:${NC} ${CLEAN_DKIM}"
else
    echo -e "   File belum ditemukan di: ${DKIM_KEY_FILE}"
fi
echo "-----------------------------------------------------------------"
echo -e "${CYAN}Silakan buka https://mail.selecoproject.com untuk mulai menggunakan email!${NC}\n"
