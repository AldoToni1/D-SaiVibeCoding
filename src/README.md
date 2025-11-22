# 🍽️ Digital Menu Builder

Aplikasi self-service untuk membuat digital menu rumah makan/UMKM dengan QR Code.

## ✨ Fitur Utama

### Core Features
- ✅ **Menu Builder**: CRUD menu item lengkap (nama, harga, foto, deskripsi, kategori)
- ✅ **Template Selection**: 4 tema tampilan (Minimalist, Colorful, Elegant, Modern)
- ✅ **Preview & Publish**: Generate public link + QR code untuk di-print
- ✅ **Analytics**: Track views menu dan item paling populer

### Wow Factor
- 🎯 **Drag & Drop**: Atur urutan menu dengan drag and drop
- 🌐 **Multi-language**: Toggle Indonesia/English untuk customer internasional
- 💬 **WhatsApp Integration**: Customer bisa langsung order via WhatsApp dengan 1 klik
- 📊 **Real-time Analytics**: Dashboard analytics dengan grafik views
- 🎨 **4 Template Tema**: Pilihan tema yang bisa disesuaikan dengan brand

## 🚀 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **QR Code**: qrcode library
- **Icons**: Lucide React
- **Storage**: LocalStorage (versi frontend-only)

## 📦 Instalasi & Cara Pakai

### Di Figma Make (sudah jalan!)
Aplikasi ini sudah siap digunakan langsung di Figma Make. Tidak perlu instalasi tambahan.

### Deploy ke Production

#### Option 1: Netlify (Recommended - Gratis)
1. Buat repository baru di GitHub
2. Upload semua source code ke repository
3. Buka [Netlify](https://netlify.com)
4. Klik "New site from Git"
5. Pilih repository Anda
6. Build settings:
   - Build command: (kosongkan)
   - Publish directory: (kosongkan)
7. Klik "Deploy site"
8. Done! Menu digital Anda sudah online

#### Option 2: Vercel (Gratis)
1. Upload source code ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Import repository Anda
4. Klik "Deploy"
5. Done!

#### Option 3: GitHub Pages (Gratis)
1. Upload source code ke GitHub repository
2. Buka Settings → Pages
3. Pilih branch "main" → Save
4. Menu digital Anda akan tersedia di `username.github.io/repo-name`

## 📖 Panduan Penggunaan

### 1. Setup Menu
1. Klik tab "Menu Items"
2. Klik "Tambah Menu"
3. Isi informasi menu (nama Indonesia & English, harga, kategori, dll)
4. Upload foto atau gunakan URL foto dari Unsplash
5. Drag & drop untuk mengatur urutan menu

### 2. Pilih Template
1. Klik tab "Template & Settings"
2. Isi nama rumah makan (Indonesia & English)
3. Masukkan nomor WhatsApp untuk order (format: 628xxx)
4. Pilih tema yang sesuai dengan brand Anda

### 3. Publish Menu
1. Klik tab "Publish & QR Code"
2. Download QR Code yang sudah di-generate
3. Print QR Code atau tampilkan di layar
4. Letakkan di meja/counter rumah makan

### 4. Monitor Analytics
1. Klik tab "Analytics"
2. Lihat statistik views menu
3. Lihat menu paling populer
4. Gunakan insight untuk optimasi menu

## 💡 Tips & Trik

### Maksimalkan Views
- Share QR Code di media sosial (IG, FB, WA Status)
- Letakkan QR Code di tempat strategis
- Update menu secara berkala
- Gunakan foto berkualitas tinggi

### Meningkatkan Conversion
- Buat deskripsi menu yang menggugah selera
- Update harga secara real-time
- Tawarkan promo khusus untuk order via digital menu
- Pastikan nomor WhatsApp selalu aktif

### Foto Menu
Gunakan foto dari:
- Unsplash (gratis, kualitas tinggi)
- Foto sendiri dengan smartphone
- Upload ke: ImgBB, Imgur, atau Cloudinary (gratis)

## ⚠️ Limitasi Versi LocalStorage

Versi ini menggunakan localStorage, sehingga:
- Data hanya tersimpan di browser yang sama
- QR Code hanya berfungsi optimal di device yang sama
- Tidak ada sinkronisasi antar device

**Rekomendasi**: Untuk production yang sebenarnya, gunakan versi dengan Supabase agar:
- QR Code bisa diakses dari device manapun
- Data tersinkronisasi real-time
- Analytics lebih akurat
- Bisa diakses oleh banyak customer sekaligus

## 🔧 Troubleshooting

**QR Code tidak bekerja?**
- Pastikan Anda menggunakan browser yang sama
- Coba clear cache dan refresh
- Untuk production, gunakan versi dengan database

**Data hilang setelah refresh?**
- LocalStorage bisa terhapus jika clear browsing data
- Backup menu items secara manual
- Gunakan versi dengan database untuk data persistence

**WhatsApp tidak terbuka?**
- Pastikan format nomor: 628xxxxxxxxx (tanpa +, -, atau spasi)
- Cek apakah WhatsApp terinstall di device

## 📁 Struktur Project

```
/
├── App.tsx                    # Main app component
├── components/
│   ├── MenuBuilder.tsx        # CRUD menu dengan drag & drop
│   ├── TemplateSelector.tsx   # Pilihan tema & settings
│   ├── MenuPreview.tsx        # Preview menu untuk customer
│   ├── QRCodeGenerator.tsx    # Generate QR code
│   ├── Analytics.tsx          # Dashboard analytics
│   └── ui/                    # shadcn/ui components
├── styles/
│   └── globals.css           # Global styles
└── README.md                 # Documentation
```

## 🎯 Roadmap (Future Enhancements)

- [ ] Export menu ke PDF
- [ ] Custom domain support
- [ ] Table reservation system
- [ ] Customer reviews & ratings
- [ ] Inventory management
- [ ] Multiple restaurant support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## 📄 License

MIT License - Bebas digunakan untuk komersial maupun personal

## 🤝 Contributing

Contributions welcome! Silakan buat pull request atau issue untuk saran dan perbaikan.

## 📞 Support

Jika ada pertanyaan atau butuh bantuan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ untuk UMKM Indonesia**
