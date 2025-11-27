"use client";
import React, { useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// Icon lengkap
import { Plus, Pencil, Trash2, GripVertical, Loader, Upload, X, UploadCloud } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MenuItem } from '../contexts/MenuContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

// --- Tipe Data Form ---
interface MenuItemFormData {
  name: string;
  nameEn: string;
  price: string;
  description: string;
  descriptionEn: string;
  category: string;
  image: string;
}

// --- Komponen Kartu Menu yang Bisa Di-Drag ---
function SortableMenuItem({ item, onEdit, onDelete }: { item: MenuItem; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as 'relative', // Casting tipe eksplisit
  };

  return (
    <Card ref={setNodeRef} style={style} className={`p-4 relative ${isDragging ? 'border-orange-400 shadow-lg' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Handle Drag */}
        <button 
          className="mt-2 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 hover:bg-gray-100 rounded" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="size-5 text-gray-400" />
        </button>

        {item.image && (
          <div className="flex-shrink-0">
            <ImageWithFallback 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              {item.nameEn && <p className="text-sm text-gray-500 truncate">{item.nameEn}</p>}
              <p className="text-orange-600 font-semibold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
              {item.category}
            </span>
            <span className="text-xs text-gray-400">
              Urutan: {item.order + 1}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// --- Komponen Utama MenuBuilder ---
export function MenuBuilder() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems, isLoading, error } = useMenu();
  
  // State Lokal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); // State untuk sync
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    nameEn: '',
    price: '',
    description: '',
    descriptionEn: '',
    category: '',
    image: '',
  });

  // Sensor Drag & Drop (Dioptimalkan untuk Mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Harus digeser 8px baru dianggap drag (mencegah kepencet saat scroll)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mengambil list kategori unik untuk dropdown
  const categories = Array.from(new Set(menuItems.map((item) => item.category))).filter(Boolean);

  // PENTING: Selalu urutkan menu berdasarkan 'order' sebelum di-render
  const sortedMenuItems = [...menuItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // --- HANDLER: Sinkronisasi Lokal ke Cloud ---
  const handleSync = async () => {
    if (!confirm('Upload semua menu lokal ke database Cloud? Pastikan Anda sudah login.')) return;
    
    setIsSyncing(true);
    try {
      const localDataString = localStorage.getItem('menuKu_items');
      if (!localDataString) {
        toast.error('Tidak ada data lokal ditemukan!');
        return;
      }
      
      const localItems = JSON.parse(localDataString);
      if (!Array.isArray(localItems) || localItems.length === 0) {
         toast.error('Data lokal kosong.');
         return;
      }

      let count = 0;
      for (const item of localItems) {
        const { id, order, ...itemData } = item; // Buang ID lama
        itemData.price = Number(itemData.price);
        await addMenuItem(itemData); 
        count++;
      }

      toast.success(`Berhasil mengupload ${count} menu ke Cloud!`);
    } catch (e) {
      console.error(e);
      toast.error('Gagal melakukan sinkronisasi.');
    } finally {
      setIsSyncing(false);
    }
  };

  // --- HANDLER: Submit Form (Tambah/Edit) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      nameEn: formData.nameEn || undefined,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      descriptionEn: formData.descriptionEn || undefined,
      category: formData.category,
      image: formData.image || undefined,
    };

    setIsSaving(true);

    const operation = editingItem ? updateMenuItem(editingItem.id, itemData) : addMenuItem(itemData);

    operation
      .then(() => {
        toast.success(editingItem ? 'Menu berhasil diupdate' : 'Menu berhasil ditambahkan');
        setIsDialogOpen(false);
        resetForm();
      })
      .catch((err) => {
        toast.error('Gagal menyimpan menu');
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // --- HANDLER: Reset Form ---
  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      price: '',
      description: '',
      descriptionEn: '',
      category: '',
      image: '',
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  // --- HANDLER: Upload Gambar ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Gunakan format JPG atau PNG');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // --- HANDLER: Edit Button ---
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameEn: item.nameEn || '',
      price: item.price.toString(),
      description: item.description,
      descriptionEn: item.descriptionEn || '',
      category: item.category,
      image: item.image || '',
    });
    setImagePreview(item.image || null);
    setIsDialogOpen(true);
  };

  // --- HANDLER: Drag End (Simpan Urutan) ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedMenuItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedMenuItems.findIndex((item) => item.id === over.id);
      
      // Buat array baru dengan urutan baru
      const reordered = arrayMove(sortedMenuItems, oldIndex, newIndex);

      // Panggil fungsi update di context (ini akan update state + DB)
      reorderMenuItems(reordered).catch((err) => {
        toast.error('Gagal mengubah urutan menu');
        console.error(err);
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daftar Menu</h2>
            <p className="text-sm text-gray-600 mt-1">Kelola dan atur urutan menu Anda di sini</p>
            {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Tombol Sync */}
            <Button 
              variant="outline" 
              onClick={handleSync} 
              disabled={isSyncing || isLoading}
              className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none"
            >
              {isSyncing ? <Loader className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
              {isSyncing ? 'Uploading...' : 'Sync Cloud'}
            </Button>

            {/* Dialog Tambah Menu */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open: boolean) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 flex-1 sm:flex-none" disabled={isLoading || isSaving}>
                  <Plus className="size-4" />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Tambah Menu Item Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Input Nama */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Menu (ID) *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Nasi Goreng"
                        required
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Menu Name (EN)</Label>
                      <Input
                        id="nameEn"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="Ex: Fried Rice"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  {/* Input Harga & Kategori */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga (Rp) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="25000"
                        required
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Makanan Utama"
                        list="categories"
                        required
                        disabled={isSaving}
                      />
                      <datalist id="categories">
                        {categories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Input Deskripsi */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi (ID) *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Description (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      rows={2}
                      disabled={isSaving}
                    />
                  </div>

                  {/* Input Gambar */}
                  <div className="space-y-2">
                    <Label>Gambar Menu</Label>
                    <div className="flex items-center gap-2">
                      <label htmlFor="image-upload" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50">
                          <Upload className="size-5 text-gray-500" />
                          <span className="text-sm text-gray-700 font-medium">
                            {imagePreview ? 'Ganti Gambar' : 'Upload Gambar'}
                          </span>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isSaving}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 w-full h-40">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Tombol Aksi Form */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? <Loader className="size-4 mr-2 animate-spin" /> : null}
                      {editingItem ? 'Simpan Perubahan' : 'Simpan Menu'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* List Menu Drag & Drop */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <Loader className="size-8 mx-auto mb-2 animate-spin" />
            <p>Memuat menu...</p>
          </div>
        ) : sortedMenuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p>Belum ada menu.</p>
            <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah" di atas untuk memulai.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedMenuItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 w-full">
                {sortedMenuItems.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => {
                      if (confirm(`Hapus "${item.name}"?`)) {
                        deleteMenuItem(item.id)
                          .then(() => toast.success('Menu dihapus'))
                          .catch(() => toast.error('Gagal menghapus'));
                      }
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>
    </div>
  );
}