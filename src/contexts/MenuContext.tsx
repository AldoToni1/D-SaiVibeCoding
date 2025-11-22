import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllMenus, createMenu, updateMenu, deleteMenu } from '../lib/services/menuService';
import { getAnalyticsSummary, trackOverallView, trackMenuView } from '../lib/services/analyticsService';

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

const STORAGE_KEYS = {
  MENU_ITEMS: 'menuKu_items',
  SETTINGS: 'menuKu_settings',
  ANALYTICS: 'menuKu_analytics',
};

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<MenuSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored
      ? JSON.parse(stored)
      : {
          restaurantName: 'Rumah Makan Saya',
          restaurantNameEn: 'My Restaurant',
          whatsappNumber: '6281227281923',
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

  // Load initial data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load menus from Supabase
        const menus = await getAllMenus();
        setMenuItems(menus);

        // Load analytics from Supabase
        const analyticsSummary = await getAnalyticsSummary();
        setAnalytics({
          totalViews: analyticsSummary.totalViews,
          itemViews: analyticsSummary.itemViews,
          lastViewed: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load menu data');
        // Fallback to localStorage if Supabase fails
        const stored = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
        if (stored) {
          setMenuItems(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'order'>) => {
    try {
      setError(null);
      const newItem = await createMenu(item);
      setMenuItems([...menuItems, newItem]);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify([...menuItems, newItem]));
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Failed to add menu item');
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setError(null);
      const updated = await updateMenu(id, updates);
      const newItems = menuItems.map((item) => (item.id === id ? updated : item));
      setMenuItems(newItems);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(newItems));
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Failed to update menu item');
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setError(null);
      await deleteMenu(id);
      const newItems = menuItems.filter((item) => item.id !== id);
      setMenuItems(newItems);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(newItems));
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Failed to delete menu item');
      throw err;
    }
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    try {
      setError(null);
      const reordered = items.map((item, index) => ({ ...item, order: index }));
      setMenuItems(reordered);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(reordered));

      // Update order in Supabase
      await Promise.all(reordered.map((item) => updateMenu(item.id, { order: item.order })));
    } catch (err) {
      console.error('Error reordering menu items:', err);
      setError('Failed to reorder menu items');
      throw err;
    }
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  const trackView = async (itemId?: string) => {
    try {
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

      // Track in Supabase
      if (itemId) {
        await trackMenuView(itemId);
      } else {
        await trackOverallView();
      }
    } catch (err) {
      console.error('Error tracking view:', err);
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
