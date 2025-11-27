import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/cartcontext";

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  itemId: string;
  onAddToCart?: () => void;
}

export function MenuCard({
  image,
  name,
  description,
  price,
  itemId,
  onAddToCart,
}: MenuCardProps) {
  const { addToCart } = useCart();
  const numericPrice = parseFloat(price.replace(/[^\d]/g, '')) || 0;
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: itemId,
      name: name,
      price: numericPrice,
    });
    
    // Trigger success animation
    setIsAdded(true);
    setIsAnimating(true);
    
    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
      setIsAnimating(false);
    }, 2000);
    
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 flex flex-col h-full">
      {/* Image Section */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0 w-full relative">
        <ImageWithFallback
          src={image || ""}
          alt={name || "Menu item"}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-gray-900 font-semibold text-base flex-1 leading-tight min-w-0">{name || "Menu Item"}</h3>
          <span className="text-amber-600 whitespace-nowrap font-semibold text-base flex-shrink-0">{price || "Rp 0"}</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-1 min-h-0">{description || "No description"}</p>
        
        {/* Add to Cart Button - Always visible at bottom */}
        <div className="mt-auto pt-2 border-t border-gray-100 -mx-4 -mb-4 px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={isAnimating || numericPrice <= 0}
            className={`
              w-full h-12 text-white text-[16px]
              rounded-[14px] flex items-center justify-center gap-2
              transition-all duration-200 font-semibold
              ${isAnimating || numericPrice <= 0
                ? 'bg-[#D9D9D9] cursor-not-allowed font-normal shadow-none'
                : isAdded 
                  ? 'bg-green-500 hover:bg-green-600 shadow-lg' 
                  : 'bg-[#FF6A00] hover:bg-[#E85B00] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md'
              }
              ${isAnimating ? 'animate-bounce' : ''}
            `}
            type="button"
            style={{
              boxShadow: isAdded 
                ? '0 4px 12px rgba(34, 197, 94, 0.3)' 
                : (isAnimating || numericPrice <= 0) 
                  ? 'none' 
                  : '0 2px 8px rgba(255, 106, 0, 0.25), 0 0 0 1px rgba(255, 106, 0, 0.1)'
            }}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <span>Ditambahkan!</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.53 13.496a1.125 1.125 0 001.087.829h9.316a1.125 1.125 0 001.086-.828l1.257-6.729a1.125 1.125 0 00-1.086-1.322H5.106l.387-1.44zm3.97 13.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm10.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <span>Tambah ke Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

