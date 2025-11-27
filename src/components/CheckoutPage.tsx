import React from 'react';
import { useCart } from "../contexts/cartcontext";
import { useMenu } from "../contexts/MenuContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from './ui/button';
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { settings } = useMenu();
  const { language, t } = useLanguage();
  const total = cart.reduce((t, i) => t + i.qty * i.price, 0);

  const sendWA = () => {
    const restaurantName = language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;
    let msg = language === 'id' 
      ? `Halo ${restaurantName}, saya ingin memesan:%0A%0A`
      : `Hello ${restaurantName}, I would like to order:%0A%0A`;
    
    cart.forEach(i => {
      msg += `• ${i.qty}x ${i.name} – Rp ${(i.qty * i.price).toLocaleString('id-ID')}%0A`;
    });
    msg += `%0A${language === 'id' ? 'Total' : 'Total'}: Rp ${total.toLocaleString('id-ID')}`;

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${msg}`, "_blank");
  };

  if (!cart.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">
          {language === 'id' ? 'Keranjang masih kosong' : 'Cart is empty'}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {language === 'id' ? 'Tambahkan menu ke keranjang untuk memulai' : 'Add items to cart to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {cart.map(i => (
          <div key={i.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{i.name}</h3>
                <p className="text-orange-600 font-semibold text-base mb-2">
                  Rp {i.price.toLocaleString('id-ID')} / item
                </p>
                <div className="text-sm font-semibold text-gray-700 mt-2">
                  {language === 'id' ? 'Subtotal' : 'Subtotal'}: <span className="text-orange-600">Rp {(i.qty * i.price).toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => updateQty(i.id, i.qty - 1)}
                    className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    disabled={i.qty <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-base">{i.qty}</span>
                  <button
                    onClick={() => updateQty(i.id, i.qty + 1)}
                    className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(i.id)}
                  className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  aria-label="Remove item"
                  title={language === 'id' ? 'Hapus dari keranjang' : 'Remove from cart'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4 sticky bottom-0 bg-white pb-2">
        <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border border-orange-200">
          <span className="text-lg font-semibold text-gray-900">
            {language === 'id' ? 'Total Pembayaran' : 'Total Payment'}
          </span>
          <span className="text-2xl font-bold text-orange-600">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={sendWA}
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <MessageCircle className="w-5 h-5" />
            {language === 'id' ? 'Pesan via WhatsApp' : 'Order via WhatsApp'}
          </Button>
          <Button
            onClick={clearCart}
            variant="outline"
            className="w-full h-10 border-red-200 text-red-600 hover:bg-red-50"
          >
            {language === 'id' ? 'Bersihkan Keranjang' : 'Clear Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
