# Supabase Integration Guide

Panduan lengkap untuk mengintegrasikan Supabase dengan aplikasi Digital Menu Anda.

## Prerequisites

- Node.js dan npm/yarn terinstall
- Account Supabase (gratis di https://supabase.com)

## Setup Langkah 1: Environment Variables

1. Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

2. Pastikan nilai environment variables sudah benar (sudah di-setup):

```
VITE_SUPABASE_URL=https://shphaejrstbylkzwnkit.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Setup Langkah 2: Install Dependencies

```bash
npm install
# atau
yarn install
```

## Setup Langkah 3: Verify Supabase Tables

Pastikan semua tabel sudah dibuat di Supabase dengan struktur berikut:

### Tabel `menus`

```sql
CREATE TABLE public.menus (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT menus_pkey PRIMARY KEY (id)
);
```

### Tabel `menu_photos`

```sql
CREATE TABLE public.menu_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  menu_id uuid,
  url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT menu_photos_pkey PRIMARY KEY (id),
  CONSTRAINT menu_photos_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id)
);
```

### Tabel `analytics`

```sql
CREATE TABLE public.analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  menu_id uuid,
  view_count integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT analytics_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id)
);
```

## Setup Langkah 4: Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang ditampilkan).

## Features

### 1. Menu Management (CRUD)

- **Create**: Tambah menu item baru via MenuBuilder
- **Read**: Lihat semua menu items (tersimpan di Supabase)
- **Update**: Edit menu item yang ada
- **Delete**: Hapus menu item

Semua data langsung disinkronkan ke Supabase!

### 2. Photo Management

- Upload URL gambar untuk setiap menu item
- Multiple photos per menu item (struktur database sudah support)
- Fallback image jika URL invalid

### 3. Analytics

- Track total views dari public menu
- Track views per item
- Real-time data dari Supabase
- Chart visualization top items

### 4. Offline Support

Data disimpan juga di localStorage, jadi aplikasi tetap berfungsi jika koneksi internet terputus.

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client initialization
│   └── services/
│       ├── menuService.ts       # CRUD operations untuk menus & photos
│       └── analyticsService.ts  # Analytics tracking & queries
├── contexts/
│   ├── MenuContext.tsx          # Global state management (menggunakan Supabase)
│   └── LanguageContext.tsx      # Language support (ID/EN)
└── components/
    ├── MenuBuilder.tsx          # Add/Edit/Delete menu items
    ├── MenuPreview.tsx          # Preview menu
    ├── PublicMenu.tsx           # Public view dengan tracking
    ├── Analytics.tsx            # Dashboard analytics
    └── ...other components
```

## API Services

### menuService.ts

```typescript
// Get all menus
const menus = await getAllMenus();

// Get single menu
const menu = await getMenuById(id);

// Create menu
const newMenu = await createMenu({ name, price, description, category, image });

// Update menu
const updated = await updateMenu(id, updates);

// Delete menu
await deleteMenu(id);

// Manage photos
const photos = await getMenuPhotos(menuId);
await addMenuPhoto(menuId, photoUrl);
await deleteMenuPhotos(menuId);
```

### analyticsService.ts

```typescript
// Get analytics untuk item tertentu
const analytics = await getMenuAnalytics(menuId);

// Get all analytics records
const allAnalytics = await getAllAnalytics();

// Track view untuk item
await trackMenuView(menuId);

// Track overall view
await trackOverallView();

// Get summary
const { totalViews, itemViews } = await getAnalyticsSummary();
```

## Using in Components

Gunakan `useMenu()` hook di components:

```typescript
import { useMenu } from '../contexts/MenuContext';

export function MyComponent() {
  const {
    menuItems,          // Array of menu items
    settings,           // Restaurant settings
    analytics,          // Analytics data
    addMenuItem,        // Async function to add menu
    updateMenuItem,     // Async function to update menu
    deleteMenuItem,     // Async function to delete menu
    trackView,          // Async function to track view
    isLoading,          // Loading state saat fetch dari Supabase
    error,              // Error message jika ada
  } = useMenu();

  return (
    // Your JSX
  );
}
```

## Error Handling

Aplikasi memiliki fallback mechanism:

- Jika Supabase request gagal, akan coba gunakan localStorage
- Error messages ditampilkan via toast notifications (sonner)
- Loading states ditampilkan dengan spinner

## Troubleshooting

### 1. "Supabase credentials are not configured"

- Pastikan `.env` file sudah ada dan berisi credentials yang benar
- Restart development server setelah update `.env`

### 2. "Failed to load menu data"

- Check koneksi internet
- Verify Supabase URL dan API key di `.env`
- Check apakah tabel sudah dibuat di Supabase dashboard

### 3. Data tidak muncul

- Pastikan sudah ada menu items di Supabase dashboard
- Check browser console untuk error messages
- Cek browser LocalStorage untuk fallback data

## Deployment

Saat deployment:

1. Pastikan environment variables (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`) sudah di-set di hosting platform
2. Build aplikasi: `npm run build`
3. Deploy `dist` folder ke hosting platform

## Best Practices

1. **Validate URLs**: Sebelum save, pastikan image URLs valid
2. **Error Handling**: Selalu handle async errors dengan try-catch
3. **Loading States**: Tampilkan loading indicator saat fetch data
4. **Offline Support**: Manfaatkan localStorage untuk offline-first experience
5. **Analytics**: Jangan lupa call `trackView()` saat user lihat menu

## Support

Untuk bantuan lebih lanjut:

- Check Supabase documentation: https://supabase.com/docs
- Check aplikasi console untuk error logs
