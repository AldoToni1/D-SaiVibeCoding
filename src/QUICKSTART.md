# 🚀 Quick Start Guide

## Untuk End User (Pemilik Rumah Makan)

### Cara Tercepat: Gunakan Langsung

1. Buka aplikasi di Figma Make
2. Klik tab "Menu Items" → Tambah menu pertama Anda
3. Isi data menu (nama, harga, foto, deskripsi)
4. Klik tab "Template & Settings" → Pilih tema favorit
5. Klik tab "Publish & QR Code" → Download QR Code
6. Print dan letakkan di meja/counter
7. **DONE!** Customer sudah bisa scan dan order via WhatsApp

### Video Tutorial (Recommended)

[Coming soon - Link ke video tutorial]

## Untuk Developer

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/username/digital-menu-builder.git
cd digital-menu-builder

# Install dependencies
npm install
# atau
yarn install

# Run development server
npm run dev
# atau
yarn dev

# Open browser
# Buka http://localhost:5173
```

### Build untuk Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 📱 Cara Pakai (End User)

### Step 1: Buat Menu

```
1. Klik "Tambah Menu"
2. Isi:
   - Nama (ID & EN): "Nasi Goreng" / "Fried Rice"
   - Harga: 25000
   - Kategori: Makanan Utama
   - Foto: URL atau upload
   - Deskripsi: Jelaskan menu Anda
3. Klik "Tambah"
4. Ulangi untuk menu lainnya
```

### Step 2: Atur Tampilan

```
1. Drag & drop menu untuk ubah urutan
2. Pilih template tema yang sesuai brand
3. Isi nomor WhatsApp: 6281227281923
```

### Step 3: Publish

```
1. Klik tab "Publish & QR Code"
2. Download QR Code (PNG)
3. Print ukuran A4 atau A5
4. Letakkan di tempat strategis
```

### Step 4: Monitor

```
1. Klik tab "Analytics"
2. Lihat berapa kali menu diakses
3. Cek menu paling populer
4. Optimasi berdasarkan data
```

## 💡 Tips Penggunaan

### Foto Menu

**Gratis & Mudah:**

- [Unsplash](https://unsplash.com) - foto makanan gratis berkualitas tinggi
- [Pexels](https://pexels.com) - alternatif Unsplash
- Foto sendiri dengan smartphone (pastikan pencahayaan bagus)

**Upload Foto:**

1. Upload ke [ImgBB](https://imgbb.com) (gratis, tanpa akun)
2. Copy direct link
3. Paste di field "URL Foto"

### Nomor WhatsApp

Format yang benar: `6281227281923`

- ✅ Benar: 6281227281923
- ❌ Salah: +62 812-3456-789
- ❌ Salah: 08123456789

### QR Code

**Print Options:**

- A4 (21 x 29.7 cm) - untuk di meja
- A5 (14.8 x 21 cm) - untuk di counter
- Standing banner - untuk pintu masuk

**Digital Display:**

- Tampilkan di tablet/TV
- WhatsApp Status
- Instagram Story
- Facebook Post

## 🎯 Use Cases

### Warung Makan Kecil

- 5-10 menu items
- Template: Minimalist atau Colorful
- WhatsApp order only
- Update harga real-time

### Restoran Menengah

- 20-50 menu items
- Template: Elegant atau Modern
- Multi-kategori menu
- Analytics untuk decision making

### Food Court / Booth

- 10-15 menu items
- Template: Colorful
- Quick order via WhatsApp
- QR Code di booth

### Cafe

- Minuman & Snacks
- Template: Modern atau Elegant
- English support untuk tourist
- Instagram-worthy display

## 🔧 Customization (Untuk Developer)

### Ubah Warna Tema

Edit `/components/TemplateSelector.tsx`:

```typescript
{
  id: 'custom',
  name: 'Custom Theme',
  colors: {
    primary: 'bg-purple-600',
    secondary: 'bg-purple-100',
    accent: 'bg-purple-400'
  }
}
```

### Tambah Kategori Menu

Edit `/components/MenuBuilder.tsx`:

```typescript
const categories = [
  'Makanan Utama',
  'Minuman',
  'Appetizer',
  'Dessert',
  'Kategori Baru', // Tambah di sini
];
```

### Tambah Bahasa

Edit `/components/MenuPreview.tsx`:

```typescript
const [language, setLanguage] = useState<'id' | 'en' | 'jp'>('id');
```

## ❓ FAQ

**Q: Apakah gratis selamanya?**
A: Ya! Open source dengan MIT License.

**Q: Bisa untuk berapa banyak menu?**
A: Unlimited! Tapi untuk performa optimal, recommended max 100 items.

**Q: Data aman tidak?**
A: Data tersimpan di browser (localStorage). Untuk keamanan lebih, gunakan versi dengan database.

**Q: Bisa custom domain?**
A: Ya! Deploy ke Netlify/Vercel, bisa custom domain gratis.

**Q: Bisa terima pembayaran online?**
A: Versi ini hanya order via WhatsApp. Untuk payment gateway, perlu integrasi tambahan.

**Q: Bisa untuk delivery?**
A: Ya! Customer order via WA, Anda atur delivery via WA chat.

## 🆘 Troubleshooting

**Menu tidak tersimpan setelah refresh?**

- Browser clear data/cookies bisa hapus localStorage
- Solusi: Deploy ke server dengan database
- Temporary: Export data secara manual

**QR Code error?**

- Pastikan URL valid
- Clear browser cache
- Generate ulang QR Code

**WhatsApp tidak terbuka?**

- Cek format nomor (628xxx)
- WhatsApp harus terinstall
- Di desktop, perlu WhatsApp Web

**Photo tidak muncul?**

- Cek URL foto valid
- Pastikan CORS-enabled
- Gunakan Unsplash atau ImgBB

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [QR Code Best Practices](https://www.qr-code-generator.com/qr-code-marketing/qr-codes-basics/)

## 📞 Support

Butuh bantuan?

- 📧 Email: support@example.com
- 💬 GitHub Issues: [Create issue](https://github.com/username/digital-menu-builder/issues)
- 📱 WhatsApp: 628xxx (untuk support berbayar)

---

**Happy Selling! 🎉**
