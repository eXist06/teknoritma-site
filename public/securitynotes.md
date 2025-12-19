- Cookies use Secure + SameSite in production
  - `lang_preference` cookie: `secure: true` in production (via `process.env.NODE_ENV === "production"`)
  - `admin_token` cookie: `secure: true` in production, `httpOnly: true`, `sameSite: "strict"`
- HSTS enabled with includeSubDomains
- CSP configured to be Next.js compatible
- All redirects enforce HTTPS
- No cookies transmitted over HTTP

# Cookie Security Implementation

## lang_preference Cookie
- **Location**: `middleware.ts`
- **Secure Flag**: `secure: isProd` (true in production, false in development)
- **SameSite**: `lax`
- **Path**: `/`
- **MaxAge**: 365 days
- **Set in**: All language detection and redirect scenarios

## admin_token Cookie
- **Location**: `app/api/admin/auth/login/route.ts`
- **Secure Flag**: `secure: process.env.NODE_ENV === "production"`
- **HttpOnly**: `true`
- **SameSite**: `strict`
- **Path**: `/`
- **MaxAge**: Based on token expiration

# /etc/nginx/sites-available/teknoritma-site

# =========================
# 1) HTTP -> HTTPS (tek domain)
# =========================
server {
    listen 80;
    listen [::]:80;

    server_name teknoritma.com.tr www.teknoritma.com.tr;

    return 301 https://teknoritma.com.tr$request_uri;
}

# =========================
# 2) HTTPS www -> non-www
# =========================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name www.teknoritma.com.tr;

    ssl_certificate     /etc/letsencrypt/live/teknoritma.com.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/teknoritma.com.tr/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://teknoritma.com.tr$request_uri;
}

# =========================
# 3) HTTPS MAIN DOMAIN (reverse proxy -> :4000)
# =========================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name teknoritma.com.tr;

    ssl_certificate     /etc/letsencrypt/live/teknoritma.com.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/teknoritma.com.tr/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Dosya yükleme limiti (görseller için 10MB, videolar için 100MB)
    client_max_body_size 150M;
    
    # Buffer ayarları (büyük dosya yüklemeleri için)
    client_body_buffer_size 128k;
    client_body_temp_path /var/cache/nginx/client_temp;

    # -------------------------
    # Security headers
    # -------------------------
    add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()" always;

    # CSP tek satır (boş dönmemesi için)
    # Not: Next.js kırmamak için 'unsafe-inline' ve 'unsafe-eval' var.
    add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frameors 'none'; img-src 'self' data: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https: wss:; form-action 'self' https://teknoritma.com.tr; upgrade-insecure-requests" always;

    # -------------------------
    # Reverse proxy
    # -------------------------
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # Websocket / upgrade (Next.js dev değil ama güvenli dursun)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Buffer ayarları (büyük dosya yüklemeleri için)
        proxy_request_buffering on;
        proxy_buffering off;
        proxy_max_temp_file_size 0;

        # Timeouts (büyük dosya yüklemeleri için artırıldı)
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 60s;
    }
}

