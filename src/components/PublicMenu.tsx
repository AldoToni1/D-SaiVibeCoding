import React, { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { CategoryChip } from './CategoryChip';
import { MenuCard } from './MenuCard';
import { Moon, Sun, Instagram, Facebook, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings, trackView } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    trackView();
  }, []);

  const handleItemClick = (itemId: string) => {
    trackView(itemId);
  };

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

  const handleOrderClick = (item: any) => {
    const itemName = language === 'id' ? item.name : item.nameEn || item.name;
    const restaurantName =
      language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;
    const message =
      language === 'id'
        ? `Halo ${restaurantName}, saya ingin pesan ${itemName}.`
        : `Hello ${restaurantName}, I would like to order ${itemName}.`;
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    trackView(item.id);
  };

  const restaurantName =
    language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;

  const orderViaWhatsApp = language === 'id' ? 'Pesan via WhatsApp' : 'Order via WhatsApp';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('Kembali', 'Back')}</span>
                </button>
              )}
              <h1 className="text-gray-900 text-lg sm:text-xl font-semibold">
                {restaurantName}
              </h1>
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
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-4 overflow-x-auto scrollbar-hide flex-nowrap sm:flex-wrap">
            {categories.map((category) => {
  // Jika 'all', pakai terjemahan. Jika tidak, pakai nama kategori aslinya (Kapital di awal)
  const label = category === 'all' 
    ? (language === 'id' ? 'Semua' : 'All') 
    : category.charAt(0).toUpperCase() + category.slice(1); 

  return (
    <CategoryChip
      key={category}
      label={label}
      isSelected={selectedCategory === category}
      onClick={() => setSelectedCategory(category)}
    />
  );
})}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-gray-50">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('Belum ada menu tersedia', 'No menu items available')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {sortedItems.map((item) => {
              const itemName = language === 'id' ? item.name : item.nameEn || item.name;
              const itemDescription =
                language === 'id' ? item.description : item.descriptionEn || item.description;
              const price = `Rp ${item.price.toLocaleString('id-ID')}`;

              return (
                <MenuCard
                  key={item.id}
                  image={item.image || ''}
                  name={itemName || 'Menu Item'}
                  description={itemDescription || 'No description'}
                  price={price}
                  onOrderClick={() => handleOrderClick(item)}
                  whatsappLabel={orderViaWhatsApp}
                />
              );
            })}
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
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-gray-400 mb-1">
                    {language === 'id' ? 'Jam Operasional' : 'Operational Hours'}
                  </p>
                  <p className="text-white">
                    {language === 'id'
                      ? 'Senin - Minggu: 10:00 - 22:00'
                      : 'Monday - Sunday: 10:00 AM - 10:00 PM'}
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
                    {language === 'id' ? 'Jl. Kuliner Raya No. 123, Jakarta Selatan' : '123 Culinary Street, South Jakarta'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 {restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
