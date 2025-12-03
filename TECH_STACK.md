# 🛠️ TECH STACK & FRAMEWORK - Digital Menu App

## 📋 DAFTAR ISI

1. [Bahasa Pemrograman](#bahasa-pemrograman)
2. [Core Framework](#core-framework)
3. [Build Tools](#build-tools)
4. [Styling Framework](#styling-framework)
5. [UI Component Libraries](#ui-component-libraries)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [Backend Services](#backend-services)
9. [Utility Libraries](#utility-libraries)
10. [Peran Masing-Masing](#peran-masing-masing)

---

## 💻 BAHASA PEMROGRAMAN

### **TypeScript**

**Versi:** TypeScript 5.0+

**Peran:**
- ✅ Bahasa pemrograman utama untuk seluruh aplikasi
- ✅ Type safety untuk mengurangi bugs
- ✅ Better IDE support (autocomplete, error detection)
- ✅ Code documentation melalui types
- ✅ Refactoring lebih aman

**Penggunaan:**
- Semua file `.tsx` dan `.ts` menggunakan TypeScript
- Type definitions untuk props, state, API responses
- Interface untuk data structures

**Contoh:**
```typescript
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}
```

---

## ⚛️ CORE FRAMEWORK

### **React 18.3.1**

**Peran:**
- ✅ **UI Library** - Framework utama untuk membangun user interface
- ✅ **Component-Based** - Membangun UI dengan komponen yang reusable
- ✅ **Virtual DOM** - Optimasi rendering untuk performa
- ✅ **Hooks** - State management dan side effects (useState, useEffect, useContext)
- ✅ **Declarative** - Menulis UI dengan cara deklaratif

**Penggunaan:**
- Semua komponen UI (`AdminDashboard`, `MenuBuilder`, `PublicMenu`, dll)
- Custom hooks (`useAutoTranslate`)
- Context providers (`MenuContext`, `AuthContext`, `LanguageContext`)

**Contoh:**
```typescript
function MenuCard({ item }: { item: MenuItem }) {
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  );
}
```

---

## 🏗️ BUILD TOOLS

### **Vite 6.3.5**

**Peran:**
- ✅ **Build Tool** - Compile dan bundle kode untuk production
- ✅ **Development Server** - Hot Module Replacement (HMR) yang cepat
- ✅ **Module Bundler** - Menggabungkan semua file menjadi bundle
- ✅ **Fast Refresh** - Update code tanpa reload browser
- ✅ **Optimization** - Minify, tree-shaking, code splitting

**Penggunaan:**
- Development: `npm run dev` - Start dev server di port 3000
- Production: `npm run build` - Build untuk production

**Konfigurasi:**
- File: `vite.config.ts`
- Plugin: `@vitejs/plugin-react-swc` - Fast React compilation

---

## 🎨 STYLING FRAMEWORK

### **Tailwind CSS**

**Peran:**
- ✅ **Utility-First CSS** - Styling dengan utility classes
- ✅ **Responsive Design** - Built-in responsive utilities (sm:, md:, lg:)
- ✅ **No Custom CSS** - Tidak perlu menulis CSS manual
- ✅ **Customizable** - Konfigurasi theme dan colors
- ✅ **Performance** - Purge unused CSS automatically

**Penggunaan:**
- Semua styling menggunakan Tailwind classes
- Responsive breakpoints: `md:`, `lg:`, `xl:`
- Utility classes: `flex`, `grid`, `bg-blue-500`, `p-4`, dll

**Contoh:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold">Menu Items</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Add Menu
  </button>
</div>
```

---

## 🎭 UI COMPONENT LIBRARIES

### **shadcn/ui (Radix UI)**

**Peran:**
- ✅ **Headless UI Components** - Component tanpa styling default
- ✅ **Accessible** - WCAG compliant, keyboard navigation
- ✅ **Customizable** - Bisa di-custom sesuai design system
- ✅ **Unstyled** - Hanya logic, styling pakai Tailwind

**Komponen yang Digunakan:**
- `Button` - Tombol interaktif
- `Card` - Container untuk konten
- `Dialog` - Modal popup
- `Input` - Form input fields
- `Select` - Dropdown selection
- `Tabs` - Tab navigation
- `Toast` - Notification messages
- Dan banyak lagi...

**Penggunaan:**
- Semua komponen UI dasar menggunakan shadcn/ui
- File: `src/components/ui/`

---

## 🧩 ADDITIONAL UI LIBRARIES

### **1. Lucide React**

**Versi:** 0.487.0

**Peran:**
- ✅ **Icon Library** - Ribuan icons yang konsisten
- ✅ **Tree-shakeable** - Hanya import icon yang dipakai
- ✅ **Customizable** - Size, color, stroke bisa diubah

**Penggunaan:**
- Icon untuk navigation, buttons, menus
- Contoh: `Menu`, `ShoppingCart`, `Settings`, `Trash2`, dll

---

### **2. Framer Motion**

**Versi:** 12.23.24

**Peran:**
- ✅ **Animation Library** - Animasi yang smooth
- ✅ **Gesture Support** - Drag, swipe, hover animations
- ✅ **Layout Animations** - Animasi saat layout berubah

**Penggunaan:**
- Animasi transisi halaman
- Hover effects pada cards
- Loading animations

---

### **3. Recharts**

**Versi:** 2.15.2

**Peran:**
- ✅ **Chart Library** - Membuat grafik dan visualisasi data
- ✅ **React Components** - Chart sebagai React component
- ✅ **Responsive** - Chart otomatis responsive

**Penggunaan:**
- Analytics dashboard
- Grafik views menu
- Statistik dan data visualization

---

### **4. Sonner**

**Versi:** 2.0.3

**Peran:**
- ✅ **Toast Notifications** - Notification popup yang elegant
- ✅ **Positioning** - Bisa di-posisikan (top, bottom, corner)
- ✅ **Types** - Success, error, warning, info

**Penggunaan:**
- Notifikasi success/error saat CRUD menu
- Feedback untuk user actions

---

## 🧭 ROUTING

### **React Router DOM**

**Versi:** 6.20.0

**Peran:**
- ✅ **Client-Side Routing** - Navigasi tanpa reload page
- ✅ **Route Protection** - Protected routes untuk admin
- ✅ **URL Management** - URL yang clean dan readable

**Routes yang Digunakan:**
- `/public` - Public menu untuk customer
- `/login` - Login page
- `/register` - Register page
- `/admin` - Admin dashboard (protected)

**Penggunaan:**
```tsx
<Routes>
  <Route path="/public" element={<PublicMenu />} />
  <Route path="/admin" element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 🗄️ STATE MANAGEMENT

### **React Context API**

**Peran:**
- ✅ **Global State** - State yang bisa diakses semua komponen
- ✅ **No External Library** - Built-in React, tidak perlu Redux
- ✅ **Simple** - Cocok untuk state yang tidak terlalu complex

**Context yang Digunakan:**

1. **MenuContext** - Global menu state
   - Menu items
   - Restaurant settings
   - CRUD operations

2. **AuthContext** - Authentication state
   - User session
   - Login/logout state

3. **LanguageContext** - Language state
   - Current language (ID/EN)
   - Language toggle

4. **CartContext** - Shopping cart state
   - Cart items
   - Add/remove items

**Penggunaan:**
```tsx
const { menuItems, addMenuItem } = useMenu();
const { user, signIn } = useAuth();
const { language, setLanguage } = useLanguage();
```

---

## 🔧 BACKEND SERVICES

### **Supabase 2.43.5**

**Peran:**
- ✅ **Backend-as-a-Service (BaaS)** - Backend tanpa server custom
- ✅ **Database** - PostgreSQL database
- ✅ **Authentication** - User auth system
- ✅ **Storage** - File storage untuk foto
- ✅ **Real-time** - Real-time subscriptions

**Penggunaan:**
- Store menu items di database
- User authentication (login/register)
- Store restaurant settings
- Analytics tracking

---

## 🎯 UTILITY LIBRARIES

### **1. @dnd-kit**

**Versi:** 6.3.1, 9.0.0, 10.0.0

**Peran:**
- ✅ **Drag & Drop** - Implementasi drag and drop untuk menu sorting
- ✅ **Accessible** - Keyboard navigation support
- ✅ **Touch Support** - Support untuk mobile devices

**Penggunaan:**
- Menu Sorter - Drag & drop untuk mengatur urutan menu

---

### **2. React Hook Form**

**Versi:** 7.55.0

**Peran:**
- ✅ **Form Management** - Handle form state dan validation
- ✅ **Performance** - Minimize re-renders
- ✅ **Validation** - Built-in validation support

**Penggunaan:**
- Form tambah/edit menu
- Login/register forms

---

### **3. qrcode.react**

**Peran:**
- ✅ **QR Code Generator** - Generate QR code untuk menu
- ✅ **Customizable** - Size, color, error correction level

**Penggunaan:**
- Generate QR code untuk share menu public

---

### **4. next-themes**

**Versi:** 0.4.6

**Peran:**
- ✅ **Theme Toggle** - Dark/Light mode support
- ✅ **System Preference** - Auto-detect system theme
- ✅ **Persistent** - Save theme preference

**Penggunaan:**
- Dark mode toggle di navigation bar

---

## 📦 DEPENDENCY CATEGORIES

### **Core Dependencies**
```
react: ^18.3.1          → UI Framework
react-dom: ^18.3.1      → React DOM renderer
@supabase/supabase-js: ^2.43.5  → Backend service
```

### **UI & Styling**
```
tailwind-merge          → Merge Tailwind classes
class-variance-authority → Component variants
@radix-ui/*             → Headless UI components (25+ packages)
lucide-react            → Icons
framer-motion           → Animations
```

### **Forms & Inputs**
```
react-hook-form         → Form management
@radix-ui/react-*       → Form components
input-otp               → OTP input
react-day-picker        → Date picker
```

### **Data Visualization**
```
recharts                → Charts & graphs
```

### **Notifications**
```
sonner                  → Toast notifications
```

### **Routing & Navigation**
```
react-router-dom        → Client-side routing
```

### **Drag & Drop**
```
@dnd-kit/*              → Drag and drop functionality
@hello-pangea/dnd       → Alternative DnD library
```

### **Utilities**
```
clsx                    → Conditional class names
qrcode.react            → QR code generation
next-themes             → Theme management
```

---

## 🎯 PERAN MASING-MASING

### **1. TypeScript**
**Peran:** Type safety, mengurangi bugs, better developer experience

### **2. React**
**Peran:** Framework utama untuk membangun UI, component-based architecture

### **3. Vite**
**Peran:** Build tool untuk development dan production, fast HMR

### **4. Tailwind CSS**
**Peran:** Styling framework, utility-first approach, responsive design

### **5. shadcn/ui (Radix UI)**
**Peran:** UI component library, accessible components, customizable

### **6. React Router DOM**
**Peran:** Client-side routing, navigation, route protection

### **7. React Context API**
**Peran:** Global state management, share state antar komponen

### **8. Supabase**
**Peran:** Backend service, database, authentication, storage

### **9. @dnd-kit**
**Peran:** Drag & drop functionality untuk menu sorting

### **10. React Hook Form**
**Peran:** Form state management, validation

### **11. Lucide React**
**Peran:** Icon library untuk UI

### **12. Framer Motion**
**Peran:** Animations dan transitions

### **13. Recharts**
**Peran:** Data visualization, charts untuk analytics

### **14. Sonner**
**Peran:** Toast notifications untuk user feedback

---

## 📊 TECH STACK SUMMARY

| Category | Technology | Version | Peran |
|----------|-----------|---------|-------|
| **Language** | TypeScript | 5.0+ | Type safety, better DX |
| **UI Framework** | React | 18.3.1 | Core framework |
| **Build Tool** | Vite | 6.3.5 | Build & dev server |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Accessible components |
| **Icons** | Lucide React | 0.487.0 | Icon library |
| **Animations** | Framer Motion | 12.23.24 | Smooth animations |
| **Charts** | Recharts | 2.15.2 | Data visualization |
| **Routing** | React Router | 6.20.0 | Client-side routing |
| **State** | Context API | Built-in | Global state |
| **Backend** | Supabase | 2.43.5 | BaaS, database, auth |
| **Forms** | React Hook Form | 7.55.0 | Form management |
| **DnD** | @dnd-kit | 6.3.1+ | Drag & drop |
| **Notifications** | Sonner | 2.0.3 | Toast messages |
| **QR Code** | qrcode.react | Latest | QR generation |
| **Theme** | next-themes | 0.4.6 | Dark/light mode |

---

## 🔄 DATA FLOW

```
User Interaction
  ↓
React Component (TypeScript)
  ↓
React Context (State Management)
  ↓
Service Layer (menuService.ts / analyticsService.ts)
  ↓
Supabase Client (Backend)
  ↓
Supabase Database (PostgreSQL)
  ↓
Response → Context → Component → UI Update
```

---

## 🎨 STYLING FLOW

```
Component (React)
  ↓
Tailwind CSS Classes
  ↓
shadcn/ui Components (Radix UI)
  ↓
Custom Styling (Tailwind utilities)
  ↓
Rendered UI
```

---

## 📝 KESIMPULAN

**Stack yang Digunakan:**

1. **TypeScript** - Bahasa pemrograman
2. **React** - UI Framework
3. **Vite** - Build Tool
4. **Tailwind CSS** - Styling
5. **shadcn/ui** - UI Components
6. **Supabase** - Backend Service
7. **React Router** - Routing
8. **Context API** - State Management

**Tidak Digunakan:**
- ❌ Redux (pakai Context API)
- ❌ Next.js (pakai Vite + React Router)
- ❌ Express.js (pakai Supabase BaaS)
- ❌ MongoDB (pakai PostgreSQL via Supabase)

**Kenapa Stack Ini?**
- ✅ Modern dan up-to-date
- ✅ Fast development
- ✅ Type-safe (TypeScript)
- ✅ No backend server needed (Supabase)
- ✅ Great developer experience
- ✅ Production-ready

---

**File ini menjelaskan semua teknologi yang digunakan dan perannya masing-masing dalam aplikasi Digital Menu App! 🚀**

