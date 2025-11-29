import React from 'react';
import { ShoppingCart, ImageIcon, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/cartcontext';
import { useMenu } from '../contexts/MenuContext';
import type { MenuItem } from '../contexts/MenuContext';

interface MenuCardProps {
  item: MenuItem;
  language?: 'id' | 'en';
  themeColor?: {
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    accentColor: string;
    buttonBg: string;
    buttonHover: string;
  };
}

export function MenuCard({ item, language = 'id', themeColor }: MenuCardProps) {
  const { addToCart, getQuantity, decrementQuantity, incrementQuantity } = useCart();
  const { trackView } = useMenu();

  const displayName = language === 'id' ? item.name : item.nameEn || item.name;
  const displayDescription = language === 'id' ? item.description : item.descriptionEn || item.description;

  const currentQuantity = getQuantity(item.id);

  // Default theme colors jika tidak diberikan
  const colors = themeColor || {
    cardBg: 'bg-white',
    cardBorder: 'border-gray-200',
    textPrimary: 'text-gray-900',
    accentColor: 'text-orange-600',
    buttonBg: 'bg-orange-500',
    buttonHover: 'hover:bg-orange-600',
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: displayName,
      price: item.price,
    });
  };

  const handleImageClick = () => {
    // Track saat user klik foto item
    trackView(item.id, displayName);
  };

  const handleDecrement = () => {
    decrementQuantity(item.id);
  };

  const handleIncrement = () => {
    if (currentQuantity === 0) {
      addToCart({
        id: item.id,
        name: displayName,
        price: item.price,
      });
    } else {
      incrementQuantity(item.id);
    }
  };

  return (
    <div
      className={`${colors.cardBg} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border ${colors.cardBorder} flex flex-col h-full overflow-hidden max-w-[350px] w-full mx-auto`}
    >
      {/* Image Section */}
      <div
        className="aspect-video overflow-hidden bg-gray-100 flex-shrink-0 w-full relative rounded-t-xl cursor-pointer"
        onClick={handleImageClick}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={displayName}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 flex flex-col flex-grow justify-between min-h-[180px]">
        <div className="flex-grow flex flex-col">
          <h3
            className={`${colors.textPrimary} font-bold text-lg mb-2 leading-tight line-clamp-2`}
            style={{ minHeight: '3rem' }}
          >
            {displayName || 'Menu Item'}
          </h3>

          <p className={`text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3`} style={{ minHeight: '2.5rem' }}>
            {displayDescription || 'No description'}
          </p>

          <div className="mb-3">
            <span className={`${colors.accentColor} font-bold text-xl`}>{formatPrice(item.price)}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-2">
          {currentQuantity > 0 ? (
            <div
              className={`flex items-center justify-center gap-3 rounded-lg py-2.5 px-4 border`}
              style={{
                backgroundColor: colors.buttonBg + '20',
                borderColor: colors.accentColor.replace('text-', 'border-'),
              }}
            >
              <button
                onClick={handleDecrement}
                disabled={item.price <= 0}
                className={`w-9 h-9 flex items-center justify-center bg-white rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                style={{
                  borderColor: colors.accentColor.replace('text-', 'border-'),
                }}
                aria-label="Decrease quantity"
              >
                <Minus className={`w-4 h-4 ${colors.accentColor}`} />
              </button>

              <span className={`${colors.accentColor} font-bold text-lg min-w-[2rem] text-center`}>
                {currentQuantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={item.price <= 0}
                className={`w-9 h-9 flex items-center justify-center bg-white rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                style={{
                  borderColor: colors.accentColor.replace('text-', 'border-'),
                }}
                aria-label="Increase quantity"
              >
                <Plus className={`w-4 h-4 ${colors.accentColor}`} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={item.price <= 0}
              className={`w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none ${colors.buttonBg} ${colors.buttonHover}`}
              type="button"
            >
              <ShoppingCart size={20} className="flex-shrink-0" />
              <span>Tambah ke Keranjang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
