import React, { useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/cartcontext';
import { LanguageToggle } from './LanguageToggle';
import { CategoryChip } from './CategoryChip';
import { MenuCard } from './MenuCard';
import { Moon, Sun, Instagram, Facebook, MapPin, Clock, ArrowLeft, ShoppingCart, X, Grid3x3, Utensils, Coffee } from 'lucide-react';
import Checkout from './CheckoutPage';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

// Icon mapping untuk kategori
const categoryIcons: Record<string, typeof Grid3x3> = {
  all: Grid3x3,
  food: Utensils,
  drinks: Coffee,
  makanan: Utensils,
  minuman: Coffee,
};

// Component untuk CategoryChip dengan auto-translate
function CategoryChipWithTranslate({
  category,
  categoryLabels,
  language,
  isSelected,
  onClick,
}: {
  category: string;
  categoryLabels: Record<string, { id: string; en: string }>;
  language: 'id' | 'en';
  isSelected: boolean;
  onClick: () => void;
}) {
  // Get label dari mapping jika ada
  let label: string;
  if (category === 'all') {
    label = categoryLabels.all[language];
  } else if (categoryLabels[category]?.[language]) {
    label = categoryLabels[category][language];
  } else {
    // Jika tidak ada di mapping, gunakan auto-translate
    const { displayText } = useAutoTranslate(category, undefined, language, `category_${category}`);
    label = displayText;
  }

  // Get icon untuk kategori
  const categoryKey = category.toLowerCase();
  const Icon = categoryIcons[categoryKey] || categoryIcons[category] || Grid3x3;

  return <CategoryChip label={label} isSelected={isSelected} onClick={onClick} icon={Icon} />;
}

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const { cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showCart, setShowCart] = useState(false);

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const categoryLabels: Record<string, { id: string; en: string }> = {
    all: { id: 'Semua', en: 'All' },
    food: { id: 'Makanan', en: 'Food' },
    drinks: { id: 'Minuman', en: 'Drinks' },
    coffee: { id: 'Kopi', en: 'Coffee' },
    dessert: { id: 'Dessert', en: 'Dessert' },
  };

  const filteredItems =
    selectedCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

  // Auto-translate restaurant name jika language = 'en' dan tidak ada restaurantNameEn
  const {
    displayText: restaurantName,
  } = useAutoTranslate(
    settings.restaurantName,
    settings.restaurantNameEn,
    language,
    'restaurant_name'
  );

  // Get theme colors dari settings
  const themeColor = settings.templateColor || {
    bgClass: 'bg-gray-50',
    headerBg: 'bg-white',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-200',
    textPrimary: 'text-gray-900',
    accentColor: 'text-orange-600',
    buttonBg: 'bg-orange-500',
    buttonHover: 'hover:bg-orange-600',
  };

  return (
    <div className={`min-h-screen ${themeColor.bgClass}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${themeColor.headerBg} border-b ${themeColor.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`flex items-center gap-2 ${themeColor.textPrimary} hover:opacity-80 transition-colors`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('Kembali', 'Back')}</span>
                </button>
              )}
              <h1 className={`${themeColor.textPrimary} text-lg sm:text-xl font-semibold`}>{restaurantName}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {/* Cart Icon */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cart.length > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 ${themeColor.buttonBg} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
                  >
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <section className={`${themeColor.cardBg} border-b ${themeColor.cardBorder} sticky top-[65px] z-40 shadow-sm`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-2 w-full">
            {categories.map((category) => (
              <CategoryChipWithTranslate
                key={category}
                category={category}
                categoryLabels={categoryLabels}
                language={language}
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </nav>
        </div>
      </section>

      {/* Menu Items */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ${themeColor.bgClass}`}>
        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${themeColor.accentColor}`}>{t('Belum ada menu tersedia', 'No menu items available')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch justify-items-center">
            {sortedItems.map((item) => (
              <MenuCard key={item.id} item={item} language={language} themeColor={themeColor} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">{restaurantName}</h3>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-gray-400 mb-1">{language === 'id' ? 'Jam Operasional' : 'Operational Hours'}</p>
                  <p className="text-white">
                    {language === 'id' ? 'Senin - Minggu: 10:00 - 22:00' : 'Monday - Sunday: 10:00 AM - 10:00 PM'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-gray-400 mb-1">{language === 'id' ? 'Alamat' : 'Address'}</p>
                  <p className="text-white">
                    {language === 'id'
                      ? 'Jl. Kuliner Raya No. 123, Jakarta Selatan'
                      : '123 Culinary Street, South Jakarta'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden" style={{ pointerEvents: 'auto' }}>
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowCart(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {language === 'id' ? 'Keranjang Belanja' : 'Shopping Cart'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {cart.length} {language === 'id' ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <Checkout />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
