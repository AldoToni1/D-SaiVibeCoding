# 📤 Panduan Upload ke Git Repository

## Langkah-langkah Upload ke GitHub

### 1. Persiapan
Pastikan Anda sudah install:
- Git ([download](https://git-scm.com/downloads))
- Akun GitHub ([daftar gratis](https://github.com/join))

### 2. Download Source Code dari Figma Make
1. Di Figma Make, download semua file source code
2. Simpan di folder lokal (misal: `digital-menu-builder`)

### 3. Buat Repository Baru di GitHub
1. Login ke GitHub
2. Klik tombol `+` di pojok kanan atas → `New repository`
3. Isi nama repository: `digital-menu-builder`
4. Pilih `Public` (agar bisa deploy gratis)
5. Jangan centang "Initialize this repository with a README"
6. Klik `Create repository`

### 4. Upload Code ke GitHub

#### Cara 1: Via Command Line (Recommended)
```bash
# Masuk ke folder project
cd digital-menu-builder

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Digital Menu Builder v1.0"

# Add remote repository (ganti USERNAME dan REPO dengan punya Anda)
git remote add origin https://github.com/USERNAME/digital-menu-builder.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

#### Cara 2: Via GitHub Desktop (Mudah untuk Pemula)
1. Download dan install [GitHub Desktop](https://desktop.github.com/)
2. Login dengan akun GitHub Anda
3. File → Add Local Repository → Pilih folder project Anda
4. Klik "Publish repository"
5. Pilih nama dan visibilitas
6. Klik "Publish Repository"

#### Cara 3: Upload Manual via Web (Paling Mudah)
1. Buka repository yang sudah dibuat
2. Klik "uploading an existing file"
3. Drag & drop semua file/folder project
4. Tulis commit message: "Initial commit"
5. Klik "Commit changes"

### 5. Verifikasi Upload
1. Buka repository di GitHub
2. Pastikan semua file sudah ter-upload
3. Cek struktur folder sudah benar

### 6. Submit URL Repository
Copy URL repository Anda, contoh:
```
https://github.com/username/digital-menu-builder
```

Submit URL ini sesuai instruksi yang diberikan.

## 📝 File Penting yang Harus Ada

Pastikan file-file ini ada di repository:
```
✅ /App.tsx
✅ /components/MenuBuilder.tsx
✅ /components/TemplateSelector.tsx
✅ /components/MenuPreview.tsx
✅ /components/QRCodeGenerator.tsx
✅ /components/Analytics.tsx
✅ /components/ui/* (semua shadcn components)
✅ /styles/globals.css
✅ /README.md
✅ /package.json (jika ada)
```

## 🚀 Deploy ke Production (Opsional)

Setelah upload ke GitHub, Anda bisa deploy gratis:

### Netlify
1. Login [Netlify](https://netlify.com)
2. New site from Git → pilih repository
3. Deploy settings:
   - Build command: (kosongkan atau `npm run build`)
   - Publish directory: `dist` atau `/`
4. Deploy!
5. URL live: `https://nama-random.netlify.app`
6. Bisa custom domain gratis

### Vercel
1. Login [Vercel](https://vercel.com)
2. Import Project → pilih repository
3. Klik Deploy
4. Done! URL: `https://project-name.vercel.app`

### GitHub Pages
1. Repository Settings → Pages
2. Source: Deploy from branch `main`
3. Folder: `/ (root)`
4. Save
5. URL: `https://username.github.io/digital-menu-builder`

## ✅ Checklist Sebelum Submit

- [ ] Semua file source code sudah di-upload
- [ ] README.md sudah ada dan lengkap
- [ ] Repository bisa diakses public
- [ ] Struktur folder sudah benar
- [ ] URL repository sudah di-copy

## ❓ Troubleshooting

**"Permission denied" saat push?**
```bash
# Setup Git credentials
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Atau gunakan GitHub CLI
gh auth login
```

**File terlalu besar?**
- Jangan upload `node_modules/` (sudah auto-ignore)
- Gunakan `.gitignore` file

**Lupa password GitHub?**
- Gunakan Personal Access Token (PAT)
- Settings → Developer Settings → Personal Access Tokens → Generate new token

## 📞 Butuh Bantuan?

Jika ada error atau kesulitan:
1. Screenshot error message
2. Cek [GitHub Docs](https://docs.github.com)
3. Tanya di [Stack Overflow](https://stackoverflow.com)

---

Semoga sukses! 🎉
