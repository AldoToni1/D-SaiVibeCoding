'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllMenus, createMenu, updateMenu, deleteMenu } from '../lib/services/menuService';
import { useLanguage } from '../contexts/LanguageContext';
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
  // Field template color (untuk custom warna background dan card)
  templateColor?: {
    name: string;
    bgGradient: string;
    bgClass: string;
    cardBg: string;
    cardBorder: string;
    headerBg: string;
    textPrimary: string;
    accentColor: string;
    buttonBg: string;
    buttonHover: string;
  };
  // Field tambahan untuk kompatibilitas dengan kode UI lama
  openHours?: string;
  address?: ReactNode;
}

interface Analytics {
  totalViews: number;
  itemViews: Record<string, number>;
  itemNames: Record<string, string>;
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
  trackView: (itemId?: string, itemName?: string) => Promise<void>;
  resetAnalytics: () => void;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 🔥 KUNCI PENYIMPANAN (PENTING: Harus sama di seluruh aplikasi)
const STORAGE_KEY_ITEMS = 'menuKu_items';
const STORAGE_KEY_SETTINGS = 'menuKu_settings';

export function MenuProvider({ children }: { children: ReactNode }) {
  // 1. INITIALIZE: Mulai dengan array kosong, data akan di-load dari Supabase
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      // Jika ada data tersimpan di localStorage, pakai itu sebagai fallback sementara
      // Tapi data utama akan di-load dari Supabase dan akan replace ini
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [settings, setSettings] = useState<MenuSettings>(() => {
    const defaultSettings = {
      restaurantName: 'DSAI Kitchen',
      restaurantNameEn: 'DSAI Kitchen',
      whatsappNumber: '6281227281923',
      template: 'modern' as const,
      openHours: '10:00 - 22:00',
      address: 'Jl. Contoh No. 123, Jakarta',
    };

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Update jika restaurantName masih "Rumah Makan Saya" atau kosong
        if (parsed.restaurantName === 'Rumah Makan Saya' || !parsed.restaurantName) {
          parsed.restaurantName = defaultSettings.restaurantName;
        }
        // Update jika restaurantNameEn adalah "My Restaurant" atau kosong atau tidak ada
        if (parsed.restaurantNameEn === 'My Restaurant' || !parsed.restaurantNameEn) {
          parsed.restaurantNameEn = defaultSettings.restaurantNameEn;
        }
        return parsed;
      }
      return defaultSettings;
    }
    return defaultSettings;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('menuKu_analytics');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old data to include itemNames if missing
        return {
          totalViews: parsed.totalViews || 0,
          itemViews: parsed.itemViews || {},
          itemNames: parsed.itemNames || {},
          lastViewed: parsed.lastViewed || new Date().toISOString(),
        };
      }
    }
    return {
      totalViews: 0,
      itemViews: {},
      itemNames: {},
      lastViewed: new Date().toISOString(),
    };
  });

  // 2. MIGRATE SETTINGS: Update settings jika masih menggunakan nilai lama
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let needsUpdate = false;
      const updatedSettings = { ...settings };
      
      // Update jika restaurantName masih "Rumah Makan Saya"
      if (settings.restaurantName === 'Rumah Makan Saya') {
        updatedSettings.restaurantName = 'DSAI Kitchen';
        needsUpdate = true;
      }
      
      // Update jika restaurantNameEn adalah "My Restaurant" atau kosong
      if (settings.restaurantNameEn === 'My Restaurant' || !settings.restaurantNameEn) {
        updatedSettings.restaurantNameEn = 'DSAI Kitchen';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setSettings(updatedSettings);
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      }
    }
  }, []); // Hanya sekali saat mount

  // 3. AUTO-SAVE: Setiap kali menu/settings berubah, simpan ke LocalStorage
  // Filter out base64 images to prevent quota exceeded errors
  useEffect(() => {
    try {
      const menuItemsWithoutBase64 = menuItems.map((item) => ({
        ...item,
        // Hapus base64 data URLs, keep valid Supabase Storage URLs
        image: item.image && !item.image.startsWith('data:') ? item.image : undefined,
      }));
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(menuItemsWithoutBase64));
    } catch (err) {
      if (err instanceof DOMException && err.code === 22) {
        console.error('❌ localStorage quota exceeded, attempting cleanup...');
        // Clear old data to make space
        localStorage.removeItem(STORAGE_KEY_ITEMS);
        localStorage.removeItem(STORAGE_KEY_SETTINGS);
        localStorage.removeItem('menuKu_analytics');
      }
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }, [settings]);

  // 3. SYNC ANTAR TAB: Biar Admin & Public View nyambung real-time
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_ITEMS && event.newValue) {
        console.log('Syncing items from other tab...');
        setMenuItems(JSON.parse(event.newValue));
      }
      if (event.key === STORAGE_KEY_SETTINGS && event.newValue) {
        console.log('Syncing settings from other tab...');
        setSettings(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 4. LOAD DATA FROM SUPABASE: Fetch menu items saat component mount
  useEffect(() => {
    const loadMenusFromSupabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const supabaseMenus = await getAllMenus();
        if (supabaseMenus && supabaseMenus.length > 0) {
          console.log('Loaded menus from Supabase:', supabaseMenus);
          // Set data dari Supabase (akan replace data dari localStorage jika ada)
          setMenuItems(supabaseMenus);
        } else {
          console.log('No menus in Supabase');
          // Jika tidak ada data di Supabase, set ke array kosong (tidak pakai dummy)
          setMenuItems([]);
        }
      } catch (err) {
        console.error('Failed to load menus from Supabase:', err);
        setError('Failed to load menus from Supabase');
        // Jika error, tetap gunakan data dari localStorage jika ada (tidak pakai dummy)
        // menuItems sudah di-set dari localStorage di initial state
      } finally {
        setIsLoading(false);
      }
    };

    loadMenusFromSupabase();
  }, []);

  // --- CRUD ACTIONS (Modifikasi State + Supabase) ---

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'order'>) => {
    try {
      setIsLoading(true);
      // Create di Supabase terlebih dahulu
      const newItemFromSupabase = await createMenu(item);
      // Update local state
      setMenuItems((prev) => [...prev, newItemFromSupabase]);
      setError(null);
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Failed to add menu item');
      // Fallback: tambah ke local state saja
      const newItem = { ...item, id: Date.now().toString(), order: menuItems.length };
      setMenuItems((prev) => [...prev, newItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setIsLoading(true);
      // Update di Supabase terlebih dahulu
      const updatedItemFromSupabase = await updateMenu(id, updates);
      // Update local state
      setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItemFromSupabase } : item)));
      setError(null);
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Failed to update menu item');
      // Fallback: update local state saja
      setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setIsLoading(true);
      // Delete di Supabase terlebih dahulu
      await deleteMenu(id);
      // Update local state
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Failed to delete menu item');
      // Fallback: delete dari local state saja
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    try {
      setIsLoading(true);
      // Update state lokal dengan order baru
      const itemsWithNewOrder = items.map((item, index) => ({
        ...item,
        order: index,
      }));
      setMenuItems(itemsWithNewOrder);
      // Note: Order tidak disimpan ke Supabase, hanya ke localStorage
      setError(null);
    } catch (err) {
      console.error('Error reordering menu items:', err);
      setError('Failed to reorder menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const trackView = async (itemId?: string, itemName?: string) => {
    setAnalytics((prev) => {
      const updated = {
        ...prev,
        totalViews: prev.totalViews + 1,
        lastViewed: new Date().toISOString(),
        itemViews: itemId
          ? {
              ...prev.itemViews,
              [itemId]: (prev.itemViews[itemId] || 0) + 1,
            }
          : prev.itemViews,
        itemNames:
          itemId && itemName
            ? {
                ...prev.itemNames,
                [itemId]: itemName,
              }
            : prev.itemNames,
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('menuKu_analytics', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetAnalytics = () => {
    const freshAnalytics: Analytics = {
      totalViews: 0,
      itemViews: {},
      itemNames: {},
      lastViewed: new Date().toISOString(),
    };
    setAnalytics(freshAnalytics);
    if (typeof window !== 'undefined') {
      localStorage.setItem('menuKu_analytics', JSON.stringify(freshAnalytics));
    }
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
        resetAnalytics,
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
