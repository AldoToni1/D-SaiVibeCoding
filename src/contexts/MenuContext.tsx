'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Tipe Data ---
export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  description: string;
  descriptionEn?: string;
  category: string;
  image?: string;
  order: number;
  template?: string;
}

export interface MenuSettings {
  restaurantName: string;
  restaurantNameEn?: string;
  whatsappNumber: string;
  template: 'minimalist' | 'colorful' | 'elegant' | 'modern';
  // Field tambahan untuk kompatibilitas dengan kode UI lama
  openHours?: string; 
  address?: ReactNode;
}

interface Analytics {
  totalViews: number;
  itemViews: Record<string, number>;
  lastViewed: string;
}

interface MenuContextType {
  menuItems: MenuItem[];
  settings: MenuSettings;
  analytics: Analytics;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'order'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  reorderMenuItems: (items: MenuItem[]) => Promise<void>;
  updateSettings: (settings: Partial<MenuSettings>) => void;
  trackView: (itemId?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 🔥 KUNCI PENYIMPANAN (PENTING: Harus sama di seluruh aplikasi)
const STORAGE_KEY_ITEMS = 'menuKu_items'; 
const STORAGE_KEY_SETTINGS = 'menuKu_settings';

// DATA DUMMY DEFAULT (Hanya muncul jika LocalStorage kosong)
const DUMMY_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    nameEn: 'Special Fried Rice',
    price: 25000,
    description: 'Nasi goreng dengan telur, ayam suwir, dan kerupuk',
    descriptionEn: 'Fried rice with egg, shredded chicken, and crackers',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1603133872878-684f571d70f2?w=400&h=400&fit=crop',
    order: 0,
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    nameEn: 'Chicken Noodle with Meatball',
    price: 18000,
    description: 'Mie ayam jamur dengan tambahan bakso sapi asli',
    descriptionEn: 'Mushroom chicken noodles with real beef meatballs',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop',
    order: 1,
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    nameEn: 'Sweet Iced Tea',
    price: 5000,
    description: 'Teh manis dingin segar',
    descriptionEn: 'Fresh sweet iced tea',
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    order: 2,
  },
  {
    id: '4',
    name: 'Sate Ayam Madura',
    nameEn: 'Chicken Satay',
    price: 30000,
    description: '10 tusuk sate ayam dengan bumbu kacang khas Madura',
    descriptionEn: '10 skewers of chicken satay with Madura peanut sauce',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    order: 3,
  },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  // 1. INITIALIZE: Cek LocalStorage dulu, kalau kosong baru pakai DUMMY
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      // Jika ada data tersimpan, pakai itu. Jika tidak, pakai DUMMY.
      return saved ? JSON.parse(saved) : DUMMY_MENU_ITEMS;
    }
    return DUMMY_MENU_ITEMS;
  });

  const [settings, setSettings] = useState<MenuSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : {
        restaurantName: 'DSAI Kitchen',
        restaurantNameEn: 'DSAI Kitchen',
        whatsappNumber: '628123456789',
        template: 'modern',
        openHours: '10:00 - 22:00',
        address: 'Jl. Contoh No. 123, Jakarta'
      };
    }
    return {
        restaurantName: 'DSAI Kitchen',
        restaurantNameEn: 'DSAI Kitchen',
        whatsappNumber: '628123456789',
        template: 'modern',
        openHours: '10:00 - 22:00',
        address: 'Jl. Contoh No. 123, Jakarta'
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 1250,
    itemViews: {},
    lastViewed: new Date().toISOString(),
  });

  // 2. AUTO-SAVE: Setiap kali menu/settings berubah, simpan ke LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // 3. SYNC ANTAR TAB: Biar Admin & Public View nyambung real-time
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_ITEMS && event.newValue) {
        console.log("Syncing items from other tab...");
        setMenuItems(JSON.parse(event.newValue));
      }
      if (event.key === STORAGE_KEY_SETTINGS && event.newValue) {
        console.log("Syncing settings from other tab...");
        setSettings(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- CRUD ACTIONS (Modifikasi State) ---

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'order'>) => {
    const newItem = { ...item, id: Date.now().toString(), order: menuItems.length };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    // Update state lokal. Karena ada useEffect di atas, ini otomatis tersimpan ke LocalStorage
    setMenuItems(items);
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const trackView = async (itemId?: string) => {
    console.log('View tracked:', itemId || 'Overall');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        settings,
        analytics,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        updateSettings,
        trackView,
        isLoading,
        error,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}