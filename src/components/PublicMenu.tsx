import React, { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/cartcontext';
import { LanguageToggle } from './LanguageToggle';
import { CategoryChip } from './CategoryChip';
import { MenuCard } from './MenuCard';
import { Moon, Sun, Instagram, Facebook, MapPin, Clock, ArrowLeft, ShoppingCart, X } from 'lucide-react';
import { Button } from './ui/button';
import Checkout from './CheckoutPage';

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings, trackView } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const { cart, getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showCart, setShowCart] = useState(false);

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

  const handleAddToCart = (item: any) => {
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
              {/* Cart Icon */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
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
              const label =
                category === 'all'
                  ? categoryLabels.all[language]
                  : categoryLabels[category]?.[language] || category;
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
                  itemId={item.id}
                  onAddToCart={() => handleAddToCart(item)}
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
            <p>&copy; 2024 {restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar Modal */}
      {showCart && (
        <div 
          className="fixed inset-0 overflow-hidden" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'auto'
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
            onClick={() => setShowCart(false)}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          />
          
          {/* Cart Sidebar */}
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            style={{ 
              position: 'absolute',
              zIndex: 2,
              top: 0,
              right: 0,
              height: '100%',
              maxWidth: '28rem'
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {language === 'id' ? 'Keranjang Belanja' : 'Shopping Cart'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {totalItems} {language === 'id' ? 'item' : 'items'}
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
