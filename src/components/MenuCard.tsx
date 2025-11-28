import React from "react";
import { MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  onOrderClick: () => void;
  whatsappLabel: string;
}

export function MenuCard({
  image,
  name,
  description,
  price,
  onOrderClick,
  whatsappLabel,
}: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-900">{name}</h3>
          <span className="text-amber-600 whitespace-nowrap ml-2">{price}</span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onOrderClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {whatsappLabel}
        </button>
      </div>
    </div>
  );
}

