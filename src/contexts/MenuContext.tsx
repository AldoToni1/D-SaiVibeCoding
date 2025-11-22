import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addMenuItem: (item: Omit<MenuItem, 'id' | 'order'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;
  updateSettings: (settings: Partial<MenuSettings>) => void;
  trackView: (itemId?: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU_ITEMS: 'menuKu_items',
  SETTINGS: 'menuKu_settings',
  ANALYTICS: 'menuKu_analytics',
};

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    return stored ? JSON.parse(stored) : [];
  });

  const [settings, setSettings] = useState<MenuSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored
      ? JSON.parse(stored)
      : {
          restaurantName: 'Rumah Makan Saya',
          restaurantNameEn: 'My Restaurant',
          whatsappNumber: '628123456789',
          template: 'minimalist',
        };
  });

  const [analytics, setAnalytics] = useState<Analytics>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return stored
      ? JSON.parse(stored)
      : {
          totalViews: 0,
          itemViews: {},
          lastViewed: new Date().toISOString(),
        };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  }, [analytics]);

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'order'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      order: menuItems.length,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const reorderMenuItems = (items: MenuItem[]) => {
    const reordered = items.map((item, index) => ({ ...item, order: index }));
    setMenuItems(reordered);
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  const trackView = (itemId?: string) => {
    setAnalytics((prev) => {
      const newAnalytics = {
        totalViews: prev.totalViews + 1,
        itemViews: { ...prev.itemViews },
        lastViewed: new Date().toISOString(),
      };

      if (itemId) {
        newAnalytics.itemViews[itemId] = (prev.itemViews[itemId] || 0) + 1;
      }

      return newAnalytics;
    });
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
