import { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Globe, ShoppingCart, X, Plus, Minus, Send, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

  useEffect(() => {
    trackView();
  }, []);

  const handleItemClick = (itemId: string) => {
    trackView(itemId);
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((cartItem) =>
          cartItem.item.id === itemId ? { ...cartItem, quantity: cartItem.quantity + delta } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);

  const sendWhatsAppOrder = () => {
    const orderText = cart
      .map(
        (cartItem) =>
          `${cartItem.quantity}x ${
            language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name
          } - Rp ${(cartItem.item.price * cartItem.quantity).toLocaleString('id-ID')}`
      )
      .join('\n');

    const restaurantName =
      language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;

    const message = `Halo ${restaurantName}, saya ingin memesan:\n\n${orderText}\n\nTotal: Rp ${totalAmount.toLocaleString(
      'id-ID'
    )}`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getTemplate = () => {
    switch (settings.template) {
      case 'colorful':
        return {
          bg: 'bg-gradient-to-br from-pink-500 to-orange-500',
          cardBg: 'bg-white/95',
          headerText: 'text-white',
          accentText: 'text-pink-600',
          buttonBg: 'bg-gradient-to-r from-pink-500 to-orange-500',
        };
      case 'elegant':
        return {
          bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
          cardBg: 'bg-gray-800/95',
          headerText: 'text-yellow-400',
          accentText: 'text-yellow-400',
          buttonBg: 'bg-yellow-500 text-gray-900',
        };
      case 'modern':
        return {
          bg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
          cardBg: 'bg-white/95',
          headerText: 'text-white',
          accentText: 'text-blue-600',
          buttonBg: 'bg-blue-600',
        };
      default: // minimalist
        return {
          bg: 'bg-gray-50',
          cardBg: 'bg-white',
          headerText: 'text-gray-900',
          accentText: 'text-orange-600',
          buttonBg: 'bg-orange-500',
        };
    }
  };

  const theme = getTemplate();

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <header className={`${theme.cardBg} shadow-lg sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="size-4" />
                {t('Kembali', 'Back')}
              </Button>
            )}
            <div className="flex-1 text-center">
              <div className="inline-block px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <h1 className={`text-2xl font-bold drop-shadow-lg`}>
                  {language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="gap-2"
              >
                <Globe className="size-4" />
                {language === 'id' ? 'EN' : 'ID'}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCart(true)}
                className={`gap-2 ${theme.buttonBg}`}
              >
                <ShoppingCart className="size-4" />
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className={`${theme.cardBg} shadow-sm sticky top-[73px] z-30`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? theme.buttonBg : ''}
              >
                {category === 'all' ? t('Semua', 'All') : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6">
        {sortedItems.length === 0 ? (
          <Card className={`${theme.cardBg} p-12 text-center`}>
            <p className="text-gray-500">{t('Belum ada menu tersedia', 'No menu items available')}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedItems.map((item) => (
              <Card
                key={item.id}
                className={`${theme.cardBg} overflow-hidden hover:shadow-xl transition-shadow cursor-pointer`}
                onClick={() => handleItemClick(item.id)}
              >
                {item.image && (
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'id' ? item.name : item.nameEn || item.name}
                    </h3>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'id' ? item.description : item.descriptionEn || item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${theme.accentText}`}>Rp {item.price.toLocaleString('id-ID')}</p>
                    <Button
                      size="sm"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className={theme.buttonBg}
                    >
                      <Plus className="size-4 mr-1" />
                      {t('Tambah', 'Add')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold">{t('Pesanan Anda', 'Your Order')}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('Keranjang kosong', 'Cart is empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((cartItem) => (
                    <Card key={cartItem.item.id} className="p-4">
                      <div className="flex gap-3">
                        {cartItem.item.image && (
                          <ImageWithFallback
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name}
                          </h3>
                          <p className="text-sm text-orange-600">Rp {cartItem.item.price.toLocaleString('id-ID')}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(cartItem.item.id, -1)}>
                              <Minus className="size-3" />
                            </Button>
                            <span className="font-medium">{cartItem.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(cartItem.item.id, 1)}>
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={sendWhatsAppOrder}>
                      <Send className="size-4" />
                      {t('Pesan via WhatsApp', 'Order via WhatsApp')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
