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
echo "   Domain  : selecoproject.com"
echo "   Subdomain: mail.selecoproject.com"
echo "   Email   : hello@selecoproject.com"
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

# 2. Periksa dependensi: Docker, Docker Compose, Nginx, Certbot
echo -e "\n${BLUE}[1/7] Memeriksa & menginstall dependensi yang diperlukan...${NC}"
apt update -y

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

# 3. Konfigurasi Firewall UFW
echo -e "\n${BLUE}[2/7] Mengonfigurasi Firewall UFW (Keamanan Port Server)...${NC}"
ufw allow 22/tcp comment 'SSH' || true
ufw allow 80/tcp comment 'HTTP Web' || true
ufw allow 443/tcp comment 'HTTPS SSL' || true
ufw allow 25/tcp comment 'SMTP Inbound' || true
ufw allow 465/tcp comment 'SMTPS Secure' || true
ufw allow 587/tcp comment 'SMTP Submission' || true
ufw allow 993/tcp comment 'IMAPS Secure' || true
ufw allow 143/tcp comment 'IMAP' || true

# Aktifkan UFW jika belum aktif
if ! ufw status | grep -q "Status: active"; then
    echo "y" | ufw enable
fi
echo -e "${GREEN}[OK] Firewall UFW telah dikonfigurasi dengan aman.${NC}"

# 4. Generate Sertifikat SSL Let's Encrypt untuk mail.selecoproject.com
echo -e "\n${BLUE}[3/7] Menyiapkan Sertifikat SSL untuk mail.selecoproject.com...${NC}"
mkdir -p /var/www/certbot

SSL_CERT_PATH="/etc/letsencrypt/live/mail.selecoproject.com/fullchain.pem"
if [ ! -f "$SSL_CERT_PATH" ]; then
    echo -e "${YELLOW}Membuat sertifikat Let's Encrypt untuk mail.selecoproject.com...${NC}"
    echo -e "${YELLOW}Pastikan DNS A Record 'mail.selecoproject.com' sudah mengarah ke IP VPS ini!${NC}"
    
    # Coba minta SSL via certbot nginx
    if certbot certonly --nginx -d mail.selecoproject.com --non-interactive --agree-tos --register-unsafely-without-email; then
        echo -e "${GREEN}[OK] Sertifikat SSL Let's Encrypt berhasil dibuat.${NC}"
    else
        echo -e "${YELLOW}Gagal via plugin Nginx, mencoba mode standalone...${NC}"
        systemctl stop nginx || true
        certbot certonly --standalone -d mail.selecoproject.com --non-interactive --agree-tos --register-unsafely-without-email || true
        systemctl start nginx || true
    fi
else
    echo -e "${GREEN}[OK] Sertifikat SSL Let's Encrypt sudah tersedia.${NC}"
fi

# 5. Pasang Konfigurasi Nginx Reverse Proxy
echo -e "\n${BLUE}[4/7] Menerapkan Konfigurasi Nginx untuk mail.selecoproject.com...${NC}"
if [ -f "$SSL_CERT_PATH" ]; then
    cp "$SCRIPT_DIR/nginx-mail.conf" /etc/nginx/sites-available/mail.selecoproject.com
    ln -sf /etc/nginx/sites-available/mail.selecoproject.com /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}[OK] Nginx berhasil di-reload dengan SSL & Security Headers!${NC}"
else
    echo -e "${RED}[PERINGATAN] Sertifikat SSL belum terbit. Nginx mail belum diaktifkan.${NC}"
    echo "Silakan pastikan domain mengarah ke IP server dan jalankan: certbot --nginx -d mail.selecoproject.com"
fi

# 6. Menjalankan Docker Mailserver & Roundcube
echo -e "\n${BLUE}[5/7] Menjalankan Container Docker Mailserver & Roundcube...${NC}"
mkdir -p docker-data/dms/mail-data
mkdir -p docker-data/dms/mail-state
mkdir -p docker-data/dms/mail-logs
mkdir -p docker-data/dms/config
mkdir -p docker-data/roundcube/data
mkdir -p docker-data/roundcube/db

# Deteksi perintah docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}[ERROR] Docker compose tidak ditemukan.${NC}"
    exit 1
fi

$DOCKER_COMPOSE_CMD -f docker-compose.mail.yml pull
$DOCKER_COMPOSE_CMD -f docker-compose.mail.yml up -d

echo "Menunggu container mailserver siap (15 detik)..."
sleep 15

# 7. Pembuatan Akun Email hello@selecoproject.com
echo -e "\n${BLUE}[6/7] Membuat Akun Email hello@selecoproject.com...${NC}"

# Input Password
read -s -p "Masukkan Password Baru untuk hello@selecoproject.com (kosongkan untuk auto-generate): " MAIL_PASS
echo ""

if [ -z "$MAIL_PASS" ]; then
    MAIL_PASS=$(openssl rand -base64 12)
    echo -e "${YELLOW}Password telah di-generate secara otomatis: ${BOLD}${MAIL_PASS}${NC}"
fi

# Tambahkan akun email ke mailserver
docker exec -i mailserver setup email add hello@selecoproject.com "$MAIL_PASS" || true
echo -e "${GREEN}[OK] Akun hello@selecoproject.com berhasil dibuat / diperbarui.${NC}"

# 8. Setup DKIM (DomainKeys Identified Mail) untuk Keamanan & Anti-Spam
echo -e "\n${BLUE}[7/7] Men-generate Kunci DKIM untuk Keamanan Pengiriman Email...${NC}"
docker exec -i mailserver setup config dkim domain selecoproject.com || true

DKIM_KEY_FILE="docker-data/dms/config/opendkim/keys/selecoproject.com/mail.txt"
DKIM_RECORD=""
if [ -f "$DKIM_KEY_FILE" ]; then
    DKIM_RECORD=$(grep -v '^;' "$DKIM_KEY_FILE" | tr -d '\n\t"' | sed 's/mail._domainkey.selecoproject.com.IN//' | sed 's/TXT//' | sed 's/(//' | sed 's/)//' | xargs)
fi

# Restart mailserver agar konfigurasi DKIM aktif
docker restart mailserver

SERVER_IP=$(curl -s https://api.ipify.org || hostname -I | awk '{print $1}')

# Selesai & Tampilkan Ringkasan DNS
echo -e "\n${GREEN}${BOLD}=================================================================${NC}"
echo -e "${GREEN}${BOLD}   SETUP EMAIL ROUNDCUBE BERHASIL DISELESAIKAN!                  ${NC}"
echo -e "${GREEN}${BOLD}=================================================================${NC}"
echo -e "${BOLD}Akses Webmail:${NC} https://mail.selecoproject.com"
echo -e "${BOLD}Email Login  :${NC} hello@selecoproject.com"
echo -e "${BOLD}Password     :${NC} ${MAIL_PASS}"
echo ""
echo -e "${YELLOW}${BOLD}PENTING: PASTIKAN DNS RECORDS BERIKUT SUDAH DITAMBAHKAN DI PROVIDER DOMAIN / CLOUDFLARE:${NC}"
echo "-----------------------------------------------------------------"
echo -e "1. ${BOLD}A Record (Subdomain Mail):${NC}"
echo -e "   Type : A"
echo -e "   Name : mail"
echo -e "   Value: ${SERVER_IP}"
echo -e "   Proxy: DNS Only (Grey Cloud jika di Cloudflare)"
echo ""
echo -e "2. ${BOLD}MX Record (Penerimaan Email):${NC}"
echo -e "   Type    : MX"
echo -e "   Name    : @"
echo -e "   Mail Server : mail.selecoproject.com"
echo -e "   Priority: 10"
echo ""
echo -e "3. ${BOLD}SPF Record (Mencegah Pemalsuan Email):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : @"
echo -e "   Value: v=spf1 mx a:mail.selecoproject.com ip4:${SERVER_IP} ~all"
echo ""
echo -e "4. ${BOLD}DMARC Record (Proteksi Reputasi Email):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : _dmarc"
echo -e "   Value: v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:hello@selecoproject.com"
echo ""
echo -e "5. ${BOLD}DKIM Record (Tanda Tangan Digital Pengiriman):${NC}"
echo -e "   Type : TXT"
echo -e "   Name : mail._domainkey"
if [ -n "$DKIM_RECORD" ]; then
    echo -e "   Value: ${DKIM_RECORD}"
else
    echo -e "   Value: Cek isi file: ${DKIM_KEY_FILE}"
fi
echo "-----------------------------------------------------------------"
echo -e "${CYAN}Simpan informasi di atas dengan aman!${NC}\n"
