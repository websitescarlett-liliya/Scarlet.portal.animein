# Scarlet Portal.animein

Portal streaming anime self-hosted, 100% tanpa iklan, dengan panel tema custom.

> ⚠️ **Catatan penting soal cakupan proyek ini**
> Repo ini adalah **scaffold/fondasi kerja**, bukan aplikasi production 100% lengkap.
> Membangun seluruh sistem (player multi-server, chunked upload 5GB dengan resume,
> transcoding HLS multi-resolusi, sistem komentar realtime, PWA offline, dsb) secara
> penuh adalah proyek berskala tim selama beberapa minggu. Yang tersedia di sini:
>
> - Struktur folder final (frontend + backend + infra) — siap dikembangkan
> - Schema database lengkap (Prisma) untuk semua entitas yang diminta
> - Implementasi kerja nyata untuk fitur inti: sistem tema (50 warna + background
>   custom), halaman nonton dengan Plyr.js, chunked upload dasar, admin settings API
> - Docker Compose + Nginx + konfigurasi deploy
> - Modul lain (auth lengkap, komentar, scraping manual, transcoding) diberi
>   kerangka controller/service + TODO yang jelas supaya tinggal diisi logikanya
>
> Beri tahu saya modul mana yang mau difokuskan dulu (misal: sistem komentar,
> atau chunked upload + resume yang lebih matang) dan saya akan kembangkan lebih
> dalam di respons berikutnya.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router) + TailwindCSS + Framer Motion + shadcn/ui |
| Backend | NestJS 10 + Prisma ORM |
| Database | PostgreSQL 16 |
| Cache/Rate limit | Redis 7 |
| Storage | Local disk (volume) atau S3-compatible (MinIO/Wasabi/R2) |
| Player | Plyr.js (HLS.js untuk streaming adaptif, .vtt untuk subtitle) |
| Auth | NextAuth (frontend) + JWT/Passport (backend) |
| Reverse proxy | Nginx |
| Deploy | Docker Compose |

> Catatan: brief awal menyebut "Laravel 11 API atau NestJS". Saya pilih **NestJS**
> karena Prisma ORM (yang diminta) adalah pasangan native untuk ekosistem Node —
> di Laravel Anda akan pakai Eloquent, bukan Prisma. Kalau Anda memang ingin Laravel
> + Eloquent, beri tahu saya, strukturnya akan saya sesuaikan.

## Struktur Folder

```
scarlet-portal/
├── frontend/                 # Next.js 14
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── anime/[slug]/page.tsx       # Detail anime
│   │   ├── watch/[slug]/[episode]/     # Halaman nonton
│   │   ├── admin/settings/             # Panel tema
│   │   └── auth/                       # Login/Register
│   ├── components/
│   │   ├── player/VideoPlayer.tsx
│   │   ├── admin/ColorPicker.tsx
│   │   └── theme-provider.tsx
│   └── lib/colors.ts                   # 50 preset warna
├── backend/                  # NestJS
│   ├── prisma/schema.prisma            # Semua model DB
│   └── src/
│       ├── anime/ episode/ genre/ studio/
│       ├── upload/          # Chunked upload
│       ├── settings/        # Theme & site settings API
│       └── auth/ users/ comments/
├── nginx/nginx.conf
├── docker-compose.yml
└── .env.example
```

## Instalasi di VPS (Ubuntu 22.04 + Docker) — Direkomendasikan

1. **Siapkan server**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
   sudo systemctl enable --now docker
   ```

2. **Clone/upload project**
   ```bash
   git clone <repo-anda> scarlet-portal
   cd scarlet-portal
   cp .env.example .env
   nano .env   # isi DB password, JWT secret, domain, dsb
   ```

3. **Build & jalankan**
   ```bash
   docker compose up -d --build
   docker compose exec backend npx prisma migrate deploy
   docker compose exec backend npx prisma db seed
   ```

4. **Setup domain + SSL (Nginx + Certbot)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d animein.example.com -d www.animein.example.com
   ```

5. Akses:
   - Website: `https://animein.example.com`
   - Admin panel: `https://animein.example.com/admin` (akun default lihat `prisma/seed.ts`)

6. **Untuk file besar (upload 5GB)**: pastikan `client_max_body_size 5120m;` sudah
   di-set di `nginx/nginx.conf` (sudah disertakan) dan storage disk cukup — gunakan
   volume terpisah atau bucket S3-compatible untuk video.

## Instalasi di cPanel (shared/VPS hosting dengan cPanel)

cPanel standar **tidak mendukung Docker**. Ada dua opsi realistis:

**Opsi A — cPanel dengan akses root + Docker (misal via WHM + CloudLinux)**
Ikuti langkah VPS di atas via SSH, lalu reverse-proxy domain cPanel ke port
container Nginx menggunakan "Application Manager" atau konfigurasi vhost manual.

**Opsi B — cPanel tanpa Docker (Node.js Selector + PostgreSQL addon)**
1. Di cPanel, buka **Setup Node.js App**, buat app untuk `backend` (Node 20) dan
   `frontend` (Node 20, mode `next start`).
2. Buat database PostgreSQL via **PostgreSQL Databases** di cPanel (atau gunakan
   PostgreSQL eksternal terkelola bila cPanel Anda hanya menyediakan MySQL —
   banyak paket cPanel shared hosting tidak menyediakan PostgreSQL, cek dulu).
3. Upload folder `backend/` dan `frontend/`, jalankan `npm install && npm run build`
   dari terminal cPanel untuk masing-masing.
4. Set environment variables di panel "Setup Node.js App" sesuai `.env.example`.
5. Redis: cek apakah provider hosting menyediakan addon Redis; jika tidak, cache
   bisa dinonaktifkan sementara (`CACHE_DRIVER=file`) — fitur tetap jalan, hanya
   tanpa caching optimal.
6. Untuk upload 5GB, pastikan `php.ini`/limit hosting (`upload_max_filesize`,
   `post_max_size`, execution timeout) dinaikkan — di banyak shared hosting ini
   **dibatasi provider** dan tidak bisa diubah; jika begitu, opsi VPS jauh lebih
   cocok untuk portal video.

> **Rekomendasi jujur**: untuk website streaming video dengan file hingga 5GB,
> shared hosting cPanel biasa akan sangat terbatas (limit upload, tidak ada
> background job untuk transcoding, I/O disk terbatas). VPS dengan Docker adalah
> jalur yang realistis untuk skala ini.

## Environment Variables

Lihat `.env.example` di root.

## Anti-Iklan

Tidak ada script iklan, popunder, atau banner di seluruh kode. Flag
`ENABLE_ADS=false` ada di `.env` sebagai penanda eksplisit dan dicek di
`frontend/lib/config.ts` — bila ada developer lain menambahkan slot iklan di
masa depan, flag ini harus dihormati di semua komponen.

## Lisensi konten

Proyek ini adalah *engine* portal. Anda bertanggung jawab penuh atas legalitas
konten (video anime) yang Anda upload dan distribusikan.
