# 🏗️ BACKEND ARCHITECTURE - Digital Menu App

## 📋 DAFTAR ISI

1. [Overview](#overview)
2. [Backend Services](#backend-services)
3. [Database Schema](#database-schema)
4. [API Services](#api-services)
5. [Authentication](#authentication)
6. [Storage](#storage)
7. [File Structure](#file-structure)

---

## 🎯 OVERVIEW

Aplikasi ini menggunakan **Supabase** sebagai Backend-as-a-Service (BaaS) yang menyediakan:

- ✅ **PostgreSQL Database** - Untuk menyimpan data menu, analytics, dan settings
- ✅ **Authentication** - Sistem login/register untuk admin
- ✅ **Storage** - Penyimpanan foto menu items
- ✅ **Real-time Subscriptions** - Sinkronisasi data real-time (opsional)

**Tidak ada backend server custom** - Semua backend logic di-handle oleh Supabase.

---

## 🔧 BACKEND SERVICES

### 1. **Supabase Client** (`src/lib/supabase.ts`)

File utama untuk konfigurasi koneksi ke Supabase.

```typescript
// Konfigurasi
- VITE_SUPABASE_URL: URL project Supabase
- VITE_SUPABASE_ANON_KEY: Public/anon key untuk client-side access
```

**Fungsi:**

- Membuat Supabase client instance
- Validasi environment variables
- Export client untuk digunakan di seluruh aplikasi

---

### 2. **Menu Service** (`src/lib/services/menuService.ts`)

Service untuk CRUD operations pada menu items.

#### **Functions:**

| Function                         | Description               | Database Table          |
| -------------------------------- | ------------------------- | ----------------------- |
| `getAllMenus()`                  | Fetch semua menu items    | `menus` + `menu_photos` |
| `getMenuById(id)`                | Get single menu by ID     | `menus` + `menu_photos` |
| `createMenu(menuData)`           | Create menu baru          | `menus` + `menu_photos` |
| `updateMenu(id, updates)`        | Update menu existing      | `menus` + `menu_photos` |
| `deleteMenu(id)`                 | Delete menu + photos      | `menus` + `menu_photos` |
| `getMenuPhotos(menuId)`          | Get all photos untuk menu | `menu_photos`           |
| `addMenuPhoto(menuId, photoUrl)` | Add photo ke menu         | `menu_photos`           |
| `deleteMenuPhotos(menuId)`       | Delete all photos menu    | `menu_photos`           |

#### **Data Structure:**

```typescript
interface MenuRow {
  id: string;
  name: string;
  name_en?: string | null;
  price: number;
  description: string;
  description_en?: string | null;
  category: string;
  order?: number;
  created_at: string;
}
```

---

### 3. **Analytics Service** (`src/lib/services/analyticsService.ts`)

Service untuk tracking dan analytics.

#### **Functions:**

| Function                   | Description                    | Database Table |
| -------------------------- | ------------------------------ | -------------- |
| `getMenuAnalytics(menuId)` | Get analytics untuk menu item  | `analytics`    |
| `getAllAnalytics()`        | Get semua analytics records    | `analytics`    |
| `trackMenuView(menuId)`    | Increment view count menu      | `analytics`    |
| `trackOverallView()`       | Track overall menu views       | `analytics`    |
| `getAnalyticsSummary()`    | Get summary (total + per item) | `analytics`    |

#### **Data Structure:**

```typescript
interface AnalyticsRow {
  id: string;
  menu_id: string | null; // null untuk overall views
  view_count: number;
  created_at: string;
}
```

---

## 📊 DATABASE SCHEMA

### **Table: `menus`**

Struktur utama untuk menu items.

```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,                    -- Nama dalam bahasa Inggris (nullable)
  price NUMERIC NOT NULL,
  description TEXT,
  description_en TEXT,             -- Deskripsi dalam bahasa Inggris (nullable)
  category TEXT NOT NULL,          -- 'food', 'drink', dll
  "order" INTEGER DEFAULT 0,      -- Urutan tampilan menu
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**

- Primary key: `id`
- Order by: `order`, `created_at`

---

### **Table: `menu_photos`**

Struktur untuk menyimpan URL foto menu items.

```sql
CREATE TABLE menu_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  url TEXT NOT NULL,               -- URL foto (dari Supabase Storage atau external)
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- Foreign key: `menu_id` → `menus.id` (CASCADE delete)

---

### **Table: `analytics`**

Struktur untuk tracking views dan analytics.

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,  -- NULL untuk overall views
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- Foreign key: `menu_id` → `menus.id` (nullable, CASCADE delete)
- `menu_id = NULL` berarti overall menu views

---

### **Table: `users` (Supabase Auth)**

Table otomatis dari Supabase untuk authentication.

```sql
-- Managed by Supabase Auth
-- Fields: id, email, encrypted_password, created_at, etc.
```

---

## 🔐 AUTHENTICATION

### **Auth Context** (`src/contexts/AuthContext.tsx`)

Menggunakan Supabase Auth untuk:

- ✅ **Sign Up** - Register admin baru
- ✅ **Sign In** - Login admin
- ✅ **Sign Out** - Logout
- ✅ **Session Management** - Auto-refresh token
- ✅ **Protected Routes** - Route protection

#### **Functions:**

```typescript
// Auth methods
signUp(email, password);
signIn(email, password);
signOut();
getCurrentUser();

// State
user: User | null;
loading: boolean;
```

---

## 📦 STORAGE

### **Supabase Storage**

Digunakan untuk menyimpan foto menu items.

**Bucket:** `menu_photos` (atau sesuai konfigurasi)

**Access:**

- Public read access untuk foto
- Authenticated write access untuk upload

**File Structure:**

```
menu_photos/
  ├── {menu_id}/
  │   ├── photo1.jpg
  │   ├── photo2.jpg
  │   └── ...
```

**Note:** Saat ini aplikasi menggunakan URL external untuk foto (bukan upload ke Supabase Storage). Storage bucket bisa digunakan untuk fitur upload foto di masa depan.

---

## 📁 FILE STRUCTURE

```
src/
├── lib/
│   ├── supabase.ts                    # Supabase client configuration
│   ├── services/
│   │   ├── menuService.ts             # Menu CRUD operations
│   │   └── analyticsService.ts       # Analytics tracking
│   └── utils/
│       └── translate.ts               # Google Translate API (external)
│
├── contexts/
│   ├── AuthContext.tsx                # Authentication state & methods
│   ├── MenuContext.tsx                # Menu state management (uses menuService)
│   ├── LanguageContext.tsx            # Language state (client-side)
│   └── cartcontext.tsx                # Shopping cart (client-side)
│
└── hooks/
    └── useAutoTranslate.ts             # Auto-translate hook (uses translate.ts)
```

---

## 🔄 DATA FLOW

### **1. Load Menu Items**

```
User opens app
  ↓
MenuContext.tsx loads
  ↓
loadMenusFromSupabase() called
  ↓
menuService.getAllMenus()
  ↓
Supabase: SELECT * FROM menus
  ↓
menuService.getMenuPhotos() for each menu
  ↓
Supabase: SELECT * FROM menu_photos WHERE menu_id = ...
  ↓
Data returned to MenuContext
  ↓
Stored in React state + localStorage (cache)
```

### **2. Create Menu Item**

```
Admin clicks "Tambah Menu"
  ↓
MenuBuilder.tsx form submitted
  ↓
MenuContext.addMenuItem() called
  ↓
menuService.createMenu(menuData)
  ↓
Supabase: INSERT INTO menus (...)
  ↓
menuService.addMenuPhoto(menuId, photoUrl)
  ↓
Supabase: INSERT INTO menu_photos (...)
  ↓
Success → Update local state
```

### **3. Track Analytics**

```
User views menu item
  ↓
PublicMenu.tsx / MenuCard.tsx renders
  ↓
analyticsService.trackMenuView(menuId) called
  ↓
Supabase: SELECT * FROM analytics WHERE menu_id = ...
  ↓
If exists: UPDATE analytics SET view_count = view_count + 1
If not: INSERT INTO analytics (menu_id, view_count: 1)
  ↓
Data saved to Supabase
```

---

## 🌐 EXTERNAL SERVICES

### **1. Google Translate API**

**File:** `src/lib/utils/translate.ts`

**Purpose:** Auto-translate dari Bahasa Indonesia ke English

**Usage:**

- On-demand translation (tidak disimpan di database)
- Cached di `sessionStorage` untuk performa
- Fallback ke original text jika translation gagal

**API Endpoint:**

```
https://translate.googleapis.com/translate_a/single
```

**Note:** Free tier, rate-limited, tidak memerlukan API key.

---

## 🔒 SECURITY

### **Row Level Security (RLS)**

Supabase menggunakan RLS untuk security. Pastikan policy sudah dikonfigurasi:

```sql
-- Example RLS Policy (adjust sesuai kebutuhan)
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON menus
  FOR SELECT USING (true);

-- Allow authenticated write
CREATE POLICY "Allow authenticated write" ON menus
  FOR ALL USING (auth.role() = 'authenticated');
```

### **API Keys**

- ✅ **Anon Key** - Digunakan di client-side (public)
- ❌ **Service Role Key** - JANGAN digunakan di client-side (server-only)

---

## 📝 ENVIRONMENT VARIABLES

File `.env` di root project:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan:**

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project
3. Settings → API
4. Copy Project URL dan anon/public key

---

## 🧪 TESTING BACKEND

### **1. Test Database Connection**

```typescript
// Check Supabase connection
import { supabase } from "./lib/supabase";

const testConnection = async () => {
  const { data, error } = await supabase.from("menus").select("count");
  console.log("Connected:", !error);
};
```

### **2. Test Menu Service**

```typescript
import { getAllMenus, createMenu } from "./lib/services/menuService";

// Test fetch
const menus = await getAllMenus();
console.log("Menus:", menus);

// Test create
const newMenu = await createMenu({
  name: "Test Menu",
  price: 10000,
  category: "food",
  description: "Test description",
});
console.log("Created:", newMenu);
```

### **3. Test Analytics**

```typescript
import {
  trackMenuView,
  getAnalyticsSummary,
} from "./lib/services/analyticsService";

// Track view
await trackMenuView("menu-id-here");

// Get summary
const summary = await getAnalyticsSummary();
console.log("Total views:", summary.totalViews);
```

---

## 🚀 DEPLOYMENT

### **Production Checklist**

- [ ] Environment variables di-set di hosting platform
- [ ] RLS policies dikonfigurasi dengan benar
- [ ] Storage bucket dibuat dan dikonfigurasi
- [ ] CORS settings di Supabase (jika perlu)
- [ ] Database indexes sudah optimal
- [ ] Backup database dilakukan

### **Hosting Platforms**

- **Vercel**: Set env vars di Project Settings → Environment Variables
- **Netlify**: Set env vars di Site Settings → Environment Variables
- **Other**: Sesuai dokumentasi platform masing-masing

---

## 📚 REFERENCE

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## ✅ SUMMARY

**Backend Components:**

1. ✅ **Supabase** - Database, Auth, Storage
2. ✅ **Menu Service** - CRUD operations untuk menu
3. ✅ **Analytics Service** - Tracking dan analytics
4. ✅ **Auth Context** - Authentication management
5. ✅ **Google Translate** - External translation API

**No Custom Backend Server Required!** 🎉

Semua backend logic di-handle oleh Supabase sebagai BaaS, sehingga tidak perlu membuat server Node.js/Express sendiri.
