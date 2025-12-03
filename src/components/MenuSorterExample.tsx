/**
 * 📝 Contoh Penggunaan MenuSorter
 * 
 * File ini menunjukkan berbagai cara menggunakan komponen MenuSorter
 * Bisa dijadikan referensi atau langsung digunakan
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MenuSorter } from './MenuSorter';
import { useMenu, type MenuItem } from '../contexts/MenuContext';

/**
 * Contoh 1: MenuSorter Standalone (dengan dummy data)
 * 
 * Gunakan ini jika ingin menggunakan komponen dengan data sendiri
 */
export function MenuSorterStandalone() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MenuSorter />
    </div>
  );
}

/**
 * Contoh 2: MenuSorter dengan MenuContext Integration
 * 
 * Gunakan ini jika ingin sync dengan MenuContext yang sudah ada
 */
export function MenuSorterWithContext() {
  const { menuItems, reorderMenuItems } = useMenu();
  const [items, setItems] = useState<MenuItem[]>([]);

  // Convert MenuContext items ke format MenuSorter
  useEffect(() => {
    const converted = menuItems.map((item, index) => ({
      ...item,
      order: item.order ?? index,
    }));
    setItems(converted);
  }, [menuItems]);

  // Handler untuk sync dengan MenuContext
  const handleOrderChange = async (newItems: MenuItem[]) => {
    setItems(newItems);
    
    // Update via MenuContext
    await reorderMenuItems(newItems);
  };

  // Note: Untuk implementasi lengkap, perlu modifikasi MenuSorter
  // agar menerima props onOrderChange dan items
  return (
    <div className="container mx-auto px-4 py-8">
      <MenuSorter />
      <p className="mt-4 text-sm text-gray-600">
        Note: Untuk integrasi penuh dengan MenuContext, modifikasi MenuSorter
        agar menerima props items dan onOrderChange
      </p>
    </div>
  );
}

/**
 * Contoh 3: Custom Save Function
 * 
 * Contoh bagaimana membuat custom save function
 */
export async function customSaveOrder(items: MenuItem[]): Promise<void> {
  try {
    // Contoh: Save ke Supabase
    const response = await fetch('/api/menu/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          order: item.order,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save order');
    }

    const data = await response.json();
    console.log('Order saved:', data);
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

/**
 * Contoh 4: Load Data dari API
 * 
 * Contoh bagaimana load data dari API external
 */
export async function loadMenuFromAPI(): Promise<MenuItem[]> {
  try {
    const response = await fetch('https://api-anda.com/menus');
    const data = await response.json();

    return data.map((item: any, index: number) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image_url,
      order: item.display_order ?? index,
    }));
  } catch (error) {
    console.error('Error loading menu:', error);
    return [];
  }
}

