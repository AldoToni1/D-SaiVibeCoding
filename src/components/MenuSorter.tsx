/**
 * 🎯 Komponen Drag & Drop "Pengurutan Menu"
 * 
 * Fitur:
 * - Drag & Drop untuk mengubah urutan menu
 * - Tampilan real-time JSON urutan terbaru
 * - Fungsi simpanUrutan() untuk mock API
 * - UI modern dengan card design
 * - Animasi halus dan cursor grab
 * 
 * Teknologi: React + @dnd-kit/sortable
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, Save, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// TIPE DATA MENU ITEM
// ============================================
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  order: number;
}

// ============================================
// KOMPONEN SORTABLE MENU CARD
// ============================================
interface SortableMenuCardProps {
  item: MenuItem;
  isDragging?: boolean;
}

function SortableMenuCard({ item, isDragging = false }: SortableMenuCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isItemDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-lg border-2 shadow-sm
        transition-all duration-200 ease-in-out
        ${isItemDragging ? 'border-blue-500 shadow-lg scale-105 z-[55]' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Drag Handle - Cursor Grab */}
        <button
          {...attributes}
          {...listeners}
          className="
            cursor-grab active:cursor-grabbing 
            p-2 text-gray-400 hover:text-gray-600 
            hover:bg-gray-100 rounded-md transition-colors
            touch-none select-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Thumbnail / Foto Menu */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback jika gambar gagal load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-2xl font-bold text-orange-600">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Informasi Menu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {item.name}
              </h3>
              <p className="text-orange-600 font-bold text-lg mt-1">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {item.category}
            </span>
          </div>
        </div>

        {/* Order Badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
          {item.order + 1}
        </div>
      </div>
    </div>
  );
}

// ============================================
// KOMPONEN DRAG OVERLAY (Item yang sedang di-drag)
// ============================================
function DragOverlayItem({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 shadow-xl scale-105 opacity-90">
      <div className="flex items-center gap-4 p-4">
        <GripVertical className="w-5 h-5 text-gray-400" />
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-2xl font-bold text-orange-600">
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h3>
          <p className="text-orange-600 font-bold text-lg mt-1">
            Rp {item.price.toLocaleString('id-ID')}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            {item.category}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
          {item.order + 1}
        </div>
      </div>
    </div>
  );
}

// ============================================
// KOMPONEN UTAMA MENU SORTER
// ============================================
export function MenuSorter() {
  // State untuk menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sensors untuk drag & drop (mouse dan keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Harus drag minimal 8px baru aktif (untuk prevent accidental drag)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ============================================
  // FUNGSI: Memuat Data Awal (Dummy Data)
  // ============================================
  const loadInitialData = (): MenuItem[] => {
    // Dummy data menu untuk demo
    const dummyMenus: Omit<MenuItem, 'order'>[] = [
      {
        id: '1',
        name: 'Nasi Goreng Spesial',
        price: 25000,
        category: 'Makanan Utama',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe762bc9?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'Mie Ayam Bakso',
        price: 18000,
        category: 'Makanan Utama',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        name: 'Gado-Gado',
        price: 15000,
        category: 'Makanan Tradisional',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      },
      {
        id: '4',
        name: 'Es Teh Manis',
        price: 5000,
        category: 'Minuman',
        image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=400&fit=crop',
      },
      {
        id: '5',
        name: 'Sate Ayam (10 tusuk)',
        price: 30000,
        category: 'Makanan Utama',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
      },
      {
        id: '6',
        name: 'Es Jeruk',
        price: 6000,
        category: 'Minuman',
      },
      {
        id: '7',
        name: 'Rendang',
        price: 35000,
        category: 'Makanan Utama',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
      },
      {
        id: '8',
        name: 'Kerupuk',
        price: 3000,
        category: 'Snack',
      },
    ];

    // Tambahkan order property
    return dummyMenus.map((menu, index) => ({
      ...menu,
      order: index,
    }));
  };

  // Load data saat komponen mount
  useEffect(() => {
    setIsLoading(true);
    // Simulasi loading dari API
    setTimeout(() => {
      const data = loadInitialData();
      setMenuItems(data);
      setIsLoading(false);
    }, 500);
  }, []);

  // ============================================
  // HANDLER: Drag Start
  // ============================================
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // ============================================
  // HANDLER: Drag End (Ketika item di-drop)
  // ============================================
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Reorder items
        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update order property
        return reordered.map((item, index) => ({
          ...item,
          order: index,
        }));
      });

      toast.success('Urutan menu berhasil diubah!', {
        description: 'Klik "Simpan Urutan" untuk menyimpan ke server',
      });
    }
  };

  // ============================================
  // FUNGSI: Simpan Urutan ke Backend (Mock API)
  // ============================================
  const simpanUrutan = async (): Promise<void> => {
    setIsSaving(true);

    try {
      // Simulasi API call dengan delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock API endpoint (ganti dengan endpoint real Anda)
      const response = await fetch('/api/menu/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: menuItems.map((item) => ({
            id: item.id,
            order: item.order,
          })),
        }),
      });

      // Simulasi response (karena ini mock, kita skip actual fetch)
      // const data = await response.json();

      // Untuk demo, kita simpan ke localStorage sebagai backup
      localStorage.setItem('menu_order_backup', JSON.stringify(menuItems));

      toast.success('Urutan menu berhasil disimpan!', {
        description: `${menuItems.length} item menu telah diupdate`,
      });
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Gagal menyimpan urutan', {
        description: 'Silakan coba lagi atau hubungi support',
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // FUNGSI: Copy JSON ke Clipboard
  // ============================================
  const copyJsonToClipboard = async () => {
    const jsonData = JSON.stringify(menuItems, null, 2);
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      toast.success('JSON berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Gagal menyalin JSON');
    }
  };

  // ============================================
  // RENDER
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Memuat menu...</span>
      </div>
    );
  }

  const activeItem = activeId ? menuItems.find((item) => item.id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pengurutan Menu</CardTitle>
          <CardDescription>
            Geser (drag) kartu menu untuk mengubah urutan. Urutan akan terupdate secara real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={simpanUrutan}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Urutan
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={copyJsonToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Salin JSON
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DnD Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={menuItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {menuItems.map((item) => (
              <SortableMenuCard key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay - Item yang sedang di-drag */}
        <DragOverlay style={{ zIndex: 60 }}>
          {activeItem ? <DragOverlayItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* JSON Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview JSON Urutan Terbaru</CardTitle>
          <CardDescription>
            Data JSON ini terupdate secara real-time saat Anda mengubah urutan menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto text-sm">
            <code>{JSON.stringify(menuItems, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

