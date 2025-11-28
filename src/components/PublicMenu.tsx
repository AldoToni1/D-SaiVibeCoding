import { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Globe,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Send,
  ArrowLeft,
  Moon,
  Sun,
  MessageCircle,
  Instagram,
  Facebook,
  Clock,
  MapPin,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  item: any;
  quantity: number;
}

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings, trackView } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    trackView();
  }, []);

  // Sinkronisasi dark mode dengan class HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleItemClick = (itemId: string) => {
    trackView(itemId);
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + delta }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const totalAmount = cart.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = (item?: any) => {
    let orderText: string;
    let total: number;

    if (item) {
      const itemName = language === 'id' ? item.name : item.nameEn || item.name;
      orderText = `1x ${itemName} - Rp ${item.price.toLocaleString('id-ID')}`;
      total = item.price;
    } else {
      orderText = cart
        .map(
          (cartItem) =>
            `${cartItem.quantity}x ${
              language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name
            } - Rp ${(cartItem.item.price * cartItem.quantity).toLocaleString('id-ID')}`
        )
        .join('\n');
      total = totalAmount;
    }

    const restaurantName =
      language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;

    const message = `Halo ${restaurantName}, saya ingin memesan:\n\n${orderText}\n\nTotal: Rp ${total.toLocaleString(
      'id-ID'
    )}`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col font-sans ${darkMode ? 'bg-[#0f1115] text-gray-100' : 'bg-[#f8f9fc] text-slate-800'}`}>
      
      {/* Header - Glassmorphism & Pill Shape Elements */}
<header
  className={`
    sticky top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-2xl border 
    backdrop-blur-xl transition-all duration-300 
    ${darkMode 
      ? 'bg-gray-900/60 border-gray-800/40 shadow-2xl shadow-black/30' 
      : 'bg-white/70 border-white/60 shadow-xl shadow-gray-300/40'
    }
  `}
>
  <div className="px-4 sm:px-6">
    <div className="flex items-center justify-between h-[72px]">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={`
              rounded-full transition-all duration-300 
              hover:scale-105 active:scale-95
              ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}
            `}
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}

        {/* Restaurant Name */}
        <h1 className="
          text-lg md:text-2xl font-extrabold tracking-tight
          bg-gradient-to-r from-orange-500 via-red-500 to-purple-600
          bg-clip-text text-transparent drop-shadow-sm
          whitespace-nowrap max-w-[200px] sm:max-w-full truncate
        ">
          {language === 'id'
            ? settings.restaurantName
            : settings.restaurantNameEn || settings.restaurantName}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className={`
            rounded-full px-4 font-medium transition-all duration-300
            hover:scale-105 active:scale-95
            ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-slate-600'}
          `}
        >
          <Globe className="size-4 mr-2" />
          <span className="hidden sm:inline">
            {language === 'id' ? 'ID' : 'EN'}
          </span>
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className={`
            rounded-full transition-all duration-300 
            hover:scale-105 active:scale-95
            ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}
        >
          {darkMode ? (
            <Sun className="size-5 text-amber-400" />
          ) : (
            <Moon className="size-5 text-indigo-600" />
          )}
        </Button>

        {/* Cart Button */}
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCart(true)}
            className={`
              relative rounded-full transition-all duration-300 
              hover:scale-105 active:scale-95
              ${darkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-orange-50 text-orange-600'}
            `}
          >
            <ShoppingCart className="size-5" />
            <span className="
              absolute -top-1.5 -right-1.5 
              bg-gradient-to-r from-orange-500 to-red-500 
              text-white text-[11px] font-bold 
              rounded-full w-5 h-5 flex items-center justify-center 
              shadow-md ring-2 ring-white dark:ring-[#0f1115]
            ">
              {totalItems}
            </span>
          </Button>
        )}

      </div>

    </div>
  </div>
</header>

      {/* Categories - Pill Navigation */}
      <div className={`sticky top-24 z-40 py-4 transition-colors duration-300`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           {/* Glass Container for Categories */}
          <div className={`flex gap-3 overflow-x-auto p-2 scrollbar-hide items-center no-scrollbar rounded-full max-w-min mx-auto md:px-4 ${darkMode ? 'bg-gray-900/60 backdrop-blur-md border border-gray-800' : 'bg-white/60 backdrop-blur-md border border-gray-200/50 shadow-sm'}`}>
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-bold tracking-wide ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 transform scale-105'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {category === 'all' ? t('Semua', 'All') : category}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items - Clean Cards */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {sortedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-[2rem] p-24 text-center border-2 border-dashed ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50 border-gray-200'}`}
          >
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                <MessageCircle className="size-10" />
            </div>
            <p className={`font-medium text-xl ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {t('Belum ada menu tersedia', 'No menu items available')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleItemClick(item.id)}
                  className="group h-full perspective-1000"
                >
                  <Card className={`h-full flex flex-col transition-all duration-300 hover:-translate-y-2 rounded-[2rem] border-0 relative overflow-visible ${
                    darkMode 
                    ? 'bg-[#16181d] shadow-2xl shadow-black/40 ring-1 ring-white/5' 
                    : 'bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] ring-1 ring-black/5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]'
                  }`}>
                    
                    {/* Image Container with Floating Effect */}
                    <div className="p-3 pb-0">
                        <div className="relative h-60 overflow-hidden rounded-[1.8rem] w-full shadow-md">
                        {item.image ? (
                            <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <MessageCircle className="size-12 text-gray-400/50" />
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      {/* Name + Price Row */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3
                          className={`text-lg font-bold leading-tight flex-1 ${
                            darkMode ? "text-gray-100" : "text-slate-800"
                          }`}
                        >
                          {language === "id" ? item.name : item.nameEn || item.name}
                        </h3>

                        {/* Price beside name */}
                        <span
                          className={`
                            text-base font-extrabold whitespace-nowrap rounded-full px-3 py-1
                            shadow-sm backdrop-blur-md
                            ${
                              darkMode
                                ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
                                : "bg-orange-100 text-orange-700 ring-1 ring-orange-300/40"
                            }
                          `}
                        >
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-sm leading-relaxed line-clamp-2 ${
                          darkMode ? "text-gray-400" : "text-slate-500"
                        }`}
                      >
                        {language === "id"
                          ? item.description
                          : item.descriptionEn || item.description}
                      </p>
                    </div>

                      <div className="flex gap-3 mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-gray-800/50">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            sendWhatsAppOrder(item);
                          }}
                          className="flex-1 font-bold rounded-xl h-12 transition-all"
                          style={{
                            backgroundColor: darkMode ? 'rgba(117, 33, 15, 1)' : 'rgba(239, 125, 63, 1)',
                            color: darkMode ? '#141313ff' : '#f2f0eeff',
                          }}
                        >
                          {t('Pesan', 'Order')}
                        </Button>
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className={`shrink-0 w-12 h-12 rounded-xl transition-all shadow-none ${
                              darkMode 
                              ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white' 
                              : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                          }`}
                        >
                          <Plus className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer - Massive & Dark */}
      {/* Footer Clean Style */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">{language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName}</h3>
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
            <p>&copy; 2024 {language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar - Refined */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`fixed right-0 top-0 bottom-0 w-full max-w-[420px] ${
                darkMode ? 'bg-[#121418] border-l border-gray-800' : 'bg-white'
              } z-50 shadow-2xl flex flex-col`}
            >
              <div className="p-8 pb-4 flex items-center justify-between shrink-0">
                <h2 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {t('Pesanan Anda', 'Your Order')}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(false)}
                  className={`rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-slate-500'}`}
                >
                  <X className="size-6" />
                </Button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
                        <ShoppingCart className={`size-12 ${darkMode ? 'text-gray-600' : 'text-orange-300'}`} />
                    </div>
                    <div className="px-10">
                        <p className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {t('Keranjang masih kosong', 'Cart is empty')}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        {t('Pilih menu lezat dari daftar dan pesan sekarang!', 'Pick delicious items from the menu and order now!')}
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-full px-8 border-2" onClick={() => setShowCart(false)}>
                        {t('Kembali ke Menu', 'Back to Menu')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <AnimatePresence mode="popLayout">
                      {cart.map((cartItem) => (
                        <motion.div
                          key={cartItem.item.id}
                          layout
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                        >
                          <div className={`flex gap-4 p-3 rounded-2xl border transition-colors group ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]'}`}>
                            {cartItem.item.image && (
                              <ImageWithFallback
                                src={cartItem.item.image}
                                alt={cartItem.item.name}
                                className="w-20 h-20 object-cover rounded-xl shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h3 className={`font-bold text-sm truncate mb-0.5 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                    {language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name}
                                </h3>
                                <p className="text-xs text-orange-500 font-bold">
                                    Rp {cartItem.item.price.toLocaleString('id-ID')}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className={`flex items-center gap-3 rounded-lg px-2 py-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                  <button
                                    onClick={() => updateQuantity(cartItem.item.id, -1)}
                                    className={`p-1 rounded-md transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className={`text-sm font-bold w-4 text-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>{cartItem.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(cartItem.item.id, 1)}
                                    className={`p-1 rounded-md transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Rp {(cartItem.item.price * cartItem.quantity).toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className={`p-8 pb-10 ${darkMode ? 'bg-[#121418] border-t border-gray-800' : 'bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
                  <div className="flex justify-between items-end mb-6">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{t('Total Pembayaran', 'Total Payment')}</span>
                    <span className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02]"
                    onClick={() => {
                      sendWhatsAppOrder();
                      setShowCart(false);
                    }}
                  >
                    <Send className="size-5 mr-3" />
                    {t('Pesan via WhatsApp', 'Order via WhatsApp')}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}