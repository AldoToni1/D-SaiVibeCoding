import React from 'react';
import { ShoppingCart, ImageIcon, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/cartcontext';
import { useMenu } from '../contexts/MenuContext';
import type { MenuItem } from '../contexts/MenuContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

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

  // Auto-translate jika language = 'en' dan tidak ada nameEn/descriptionEn
  const {
    displayText: displayName,
    isTranslating: isTranslatingName,
  } = useAutoTranslate(item.name, item.nameEn, language, `menu_${item.id}_name`);
  
  const {
    displayText: displayDescription,
    isTranslating: isTranslatingDescription,
  } = useAutoTranslate(item.description, item.descriptionEn, language, `menu_${item.id}_description`);

  const currentQuantity = getQuantity(item.id);
  const isTranslating = isTranslatingName || isTranslatingDescription;

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
    // Track saat user tambah ke keranjang
    trackView(item.id, displayName);
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
    // Track saat user tambah quantity
    trackView(item.id, displayName);
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
      className={`${colors.cardBg} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border ${colors.cardBorder} flex flex-col h-full overflow-hidden w-full`}
      style={{ maxWidth: '360px' }}
    >
      {/* Image Section - Height 210-240px */}
      <div
        className="overflow-hidden bg-gray-100 flex-shrink-0 w-full relative rounded-t-lg cursor-pointer"
        style={{ height: '225px' }}
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
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content - Padding lebih besar untuk teks tidak mepet */}
      <div className="px-6 py-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="flex items-start gap-2 mb-2">
          <h3
            className={`${colors.textPrimary} font-bold text-lg mb-2 leading-tight line-clamp-2 flex-1`}
          >
            {displayName || 'Menu Item'}
          </h3>
          {isTranslatingName && (
            <Loader2 className="size-4 text-gray-400 animate-spin mt-1 flex-shrink-0" />
          )}
        </div>

        {/* Description - Max 4-5 lines, spacing 6-8px dari judul */}
        <div className="flex items-start gap-2 mb-3">
          <p className={`text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1`}>
            {displayDescription || 'No description'}
          </p>
          {isTranslatingDescription && (
            <Loader2 className="size-4 text-gray-400 animate-spin mt-1 flex-shrink-0" />
          )}
        </div>

        {/* Price - Spacing 10-12px dari deskripsi */}
        <div className="mb-[18px]">
          <span className={`${colors.accentColor} font-bold text-xl`}>{formatPrice(item.price)}</span>
        </div>

        {/* Bottom Section - Push ke bawah dengan mt-auto, spacing ±18px dari harga */}
        <div className="mt-auto">
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
              <span>{language === 'id' ? 'Tambah ke Keranjang' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
