# Quick Reference Guide

## 🚀 Starting the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📋 Core Services

### Menu Service (`src/lib/services/menuService.ts`)

```typescript
// Fetch
const menus = await getAllMenus();
const menu = await getMenuById(id);

// Create
const newMenu = await createMenu({
  name: 'Nasi Goreng',
  price: 25000,
  description: 'Description here',
  category: 'Main Course',
  image: 'https://...',
});

// Update
await updateMenu(id, {
  name: 'Updated Name',
  price: 30000,
  // ... other fields
});

// Delete
await deleteMenu(id);

// Photos
const photos = await getMenuPhotos(menuId);
await addMenuPhoto(menuId, 'https://photo-url.jpg');
await deleteMenuPhotos(menuId);
```

### Analytics Service (`src/lib/services/analyticsService.ts`)

```typescript
// Track views
await trackMenuView(menuId); // Track item view
await trackOverallView(); // Track overall menu view

// Get data
const itemAnalytics = await getMenuAnalytics(menuId);
const allAnalytics = await getAllAnalytics();
const { totalViews, itemViews } = await getAnalyticsSummary();
```

## 🎯 Using in Components

```typescript
import { useMenu } from '../contexts/MenuContext';

export function MyComponent() {
  const {
    menuItems, // Menu items array
    settings, // Restaurant settings
    analytics, // Analytics data
    addMenuItem, // async function
    updateMenuItem, // async function
    deleteMenuItem, // async function
    reorderMenuItems, // async function
    trackView, // async function
    isLoading, // boolean
    error, // string | null
  } = useMenu();

  // Example: Add item
  const handleAdd = async () => {
    try {
      await addMenuItem({
        name: 'Item name',
        price: 25000,
        description: 'Description',
        category: 'Category',
        image: 'https://...',
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Example: Track view
  const handleView = async () => {
    await trackView('item-id'); // Track specific item
    // or
    await trackView(); // Track overall
  };
}
```

## 🗄️ Database Tables

### menus

- `id` (uuid, PK)
- `name` (text)
- `price` (numeric)
- `description` (text)
- `category` (text)
- `created_at` (timestamp)

### menu_photos

- `id` (uuid, PK)
- `menu_id` (uuid, FK)
- `url` (text)
- `created_at` (timestamp)

### analytics

- `id` (uuid, PK)
- `menu_id` (uuid, FK, nullable)
- `view_count` (integer)
- `created_at` (timestamp)

## ⚙️ Environment Variables

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Located in `.env` (create from `.env.example`)

## 🛠️ Common Tasks

### Add New Menu Item

1. Click "Tambah Menu" button
2. Fill form fields
3. Add image URL
4. Click "Tambah Menu"
5. Data saves to Supabase automatically

### Edit Menu Item

1. Click pencil icon on menu card
2. Modify fields
3. Click "Update Menu"
4. Changes saved to Supabase

### Delete Menu Item

1. Click trash icon on menu card
2. Confirm deletion
3. Item removed from Supabase

### View Analytics

1. Go to "Analytics" tab
2. See total views
3. See item views in chart
4. Check most viewed items

### View Public Menu

1. Click "View Public Menu" button
2. Browse as customer
3. Add items to cart
4. Order via WhatsApp

## 🐛 Troubleshooting

| Problem                               | Solution                                  |
| ------------------------------------- | ----------------------------------------- |
| "Supabase credentials not configured" | Check `.env` file has correct values      |
| Data not appearing                    | Verify tables exist in Supabase dashboard |
| Async operation errors                | Check console for detailed error message  |
| Build fails                           | Run `npm install` then `npm run build`    |
| Port already in use                   | Change port: `npm run dev -- --port 3000` |

## 📊 Files Overview

```
src/
├── lib/
│   ├── supabase.ts              ← Supabase client
│   └── services/
│       ├── menuService.ts       ← Menu CRUD
│       └── analyticsService.ts  ← Analytics
├── contexts/
│   ├── MenuContext.tsx          ← Global state
│   └── LanguageContext.tsx      ← Language
└── components/
    ├── MenuBuilder.tsx          ← Edit menu
    ├── PublicMenu.tsx           ← Public view
    ├── Analytics.tsx            ← Dashboard
    └── ui/                      ← UI components
```

## 🔗 Documentation Files

- `README.md` - Project overview
- `SUPABASE_SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `SUPABASE_INTEGRATION_CHECKLIST.md` - Verification checklist
- `QUICK_REFERENCE.md` - This file

## 💾 Production Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to hosting
# Set environment variables on hosting platform:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

## 📚 More Information

For detailed information:

- See `SUPABASE_SETUP.md` for setup instructions
- See `IMPLEMENTATION_SUMMARY.md` for technical details
- See `README.md` for feature overview

---

**Last Updated**: November 22, 2025
