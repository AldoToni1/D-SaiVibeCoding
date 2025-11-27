'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

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

// 🔥 DATA DUMMY GLOBAL (Agar muncul di Builder, Sorter & Public View)
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
  {
    id: '5',
    name: 'Kopi Susu Gula Aren',
    nameEn: 'Palm Sugar Coffee Latte',
    price: 18000,
    description: 'Kopi susu kekinian dengan gula aren asli',
    descriptionEn: 'Modern milk coffee with real palm sugar',
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop',
    order: 4,
  },
  {
    id: '6',
    name: 'Pisang Goreng Keju',
    nameEn: 'Cheese Fried Banana',
    price: 15000,
    description: 'Pisang goreng crispy dengan topping keju dan susu',
    descriptionEn: 'Crispy fried banana topped with cheese and milk',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=400&fit=crop',
    order: 5,
  },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  // ✅ Langsung isi state dengan DATA DUMMY
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DUMMY_MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<MenuSettings>({
    restaurantName: 'DSAI Kitchen',
    restaurantNameEn: 'DSAI Kitchen',
    whatsappNumber: '628123456789',
    template: 'modern',
  });

  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 1250,
    itemViews: { '1': 450, '2': 300, '5': 200 },
    lastViewed: new Date().toISOString(),
  });

  // --- FUNGSI CRUD SIMULASI (Hanya update state, tidak ke DB) ---

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