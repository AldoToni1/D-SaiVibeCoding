import { useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MenuItem } from '../contexts/MenuContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuItemFormData {
  name: string;
  nameEn: string;
  price: string;
  description: string;
  descriptionEn: string;
  category: string;
  image: string;
}

function SortableMenuItem({ item, onEdit, onDelete }: { item: MenuItem; onEdit: () => void; onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex items-start gap-4">
        <button
          className="mt-2 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5 text-gray-400" />
        </button>
        
        {item.image && (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              {item.nameEn && <p className="text-sm text-gray-500">{item.nameEn}</p>}
              <p className="text-orange-600 font-semibold mt-1">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          {item.descriptionEn && (
            <p className="text-sm text-gray-500 mt-1 italic">{item.descriptionEn}</p>
          )}
          <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            {item.category}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function MenuBuilder() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } = useMenu();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    nameEn: '',
    price: '',
    description: '',
    descriptionEn: '',
    category: '',
    image: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categories = Array.from(new Set(menuItems.map((item) => item.category))).filter(Boolean);

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

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

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
    setEditingItem(null);
  };

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
    setIsDialogOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(menuItems, oldIndex, newIndex);
      reorderMenuItems(reordered);
    }
  };

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tambah, edit, atau drag untuk mengatur urutan menu
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open : boolean) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Menu Item' : 'Tambah Menu Item Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Menu (Indonesia) *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nasi Goreng"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Nama Menu (English)</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Fried Rice"
                    />
                  </div>
                </div>

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
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Indonesia) *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nasi goreng spesial dengan telur, ayam, dan sayuran"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Deskripsi (English)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Special fried rice with egg, chicken, and vegetables"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL Gambar</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Upload gambar ke layanan seperti Imgur atau gunakan URL gambar
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update' : 'Tambah'} Menu
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada menu item. Klik "Tambah Menu" untuk memulai.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedMenuItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sortedMenuItems.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => {
                      if (confirm(`Hapus "${item.name}" dari menu?`)) {
                        deleteMenuItem(item.id);
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
