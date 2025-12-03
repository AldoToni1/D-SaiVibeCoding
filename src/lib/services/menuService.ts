import { supabase } from '../supabase';
import type { MenuItem } from '../../contexts/MenuContext';

export interface MenuRow {
  id: string;
  name: string;
  name_en?: string | null;
  nameEn?: string | null;
  price: number;
  description: string;
  description_en?: string | null;
  descriptionEn?: string | null;
  category: string;
  order?: number;
  created_at: string;
}

export interface MenuItemWithPhotos extends MenuItem {
  photos?: string[];
}

/**
 * Fetch all menus from Supabase
 */
export async function getAllMenus(): Promise<MenuItemWithPhotos[]> {
  try {
    const { data: menus, error: menusError } = await supabase
      .from('menus')
      .select('*')
      .order('created_at', { ascending: true });

    if (menusError) throw menusError;

    if (!menus) return [];

    // Fetch photos for each menu
    const menusWithPhotos = await Promise.all(
      menus.map(async (menu: MenuRow) => {
        const photos = await getMenuPhotos(menu.id);
        return {
          id: menu.id,
          name: menu.name,
          nameEn: menu.name_en || menu.nameEn || undefined,
          price: menu.price,
          description: menu.description || '',
          descriptionEn: menu.description_en || menu.descriptionEn || undefined,
          category: menu.category || '',
          image: photos[0] || undefined,
          photos: photos,
          order: menu.order || 0,
        } as MenuItemWithPhotos;
      })
    );

    return menusWithPhotos;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
}

/**
 * Get a single menu by ID
 */
export async function getMenuById(id: string): Promise<MenuItemWithPhotos | null> {
  try {
    const { data: menu, error } = await supabase.from('menus').select('*').eq('id', id).single();

    if (error) throw error;
    if (!menu) return null;

    const photos = await getMenuPhotos(id);

    return {
      id: menu.id,
      name: menu.name,
      nameEn: menu.name_en || menu.nameEn || undefined,
      price: menu.price,
      description: menu.description || '',
      descriptionEn: menu.description_en || menu.descriptionEn || undefined,
      category: menu.category || '',
      image: photos[0] || undefined,
      photos: photos,
      order: menu.order || 0,
    };
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}

/**
 * Create a new menu item
 */
export async function createMenu(menuData: Omit<MenuItem, 'id' | 'order'>): Promise<MenuItemWithPhotos> {
  try {
    const { data: menu, error } = await supabase
      .from('menus')
      .insert([
        {
          name: menuData.name,
          name_en: menuData.nameEn || null,
          price: menuData.price,
          description: menuData.description,
          description_en: menuData.descriptionEn || null,
          category: menuData.category,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Add photo if image URL is provided
    let photos: string[] = [];
    if (menuData.image) {
      photos = await addMenuPhoto(menu.id, menuData.image);
    }

    const menuRow = menu as MenuRow;
    return {
      id: menuRow.id,
      name: menuRow.name,
      nameEn: menuRow.name_en || menuRow.nameEn || menuData.nameEn || undefined,
      price: menuRow.price,
      description: menuRow.description || '',
      descriptionEn: menuRow.description_en || menuRow.descriptionEn || menuData.descriptionEn || undefined,
      category: menuRow.category || '',
      image: menuData.image,
      photos: photos,
      order: 0,
    };
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
}

/**
 * Update an existing menu item
 */
export async function updateMenu(
  id: string,
  updates: Partial<Omit<MenuItem, 'id' | 'order'>>
): Promise<MenuItemWithPhotos> {
  try {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.nameEn !== undefined) updateData.name_en = updates.nameEn || null;
    if (updates.price) updateData.price = updates.price;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.descriptionEn !== undefined) updateData.description_en = updates.descriptionEn || null;
    if (updates.category) updateData.category = updates.category;

    const { data: menu, error } = await supabase.from('menus').update(updateData).eq('id', id).select().single();

    if (error) throw error;

    // Handle image update
    let photos = await getMenuPhotos(id);
    if (updates.image && updates.image !== photos[0]) {
      // Delete old photos
      await deleteMenuPhotos(id);
      // Add new photo
      photos = await addMenuPhoto(id, updates.image);
    }

    const menuRow = menu as MenuRow;
    return {
      id: menuRow.id,
      name: menuRow.name,
      nameEn: menuRow.name_en || menuRow.nameEn || updates.nameEn || undefined,
      price: menuRow.price,
      description: menuRow.description || '',
      descriptionEn: menuRow.description_en || menuRow.descriptionEn || updates.descriptionEn || undefined,
      category: menuRow.category || '',
      image: photos[0] || undefined,
      photos: photos,
      order: menuRow.order || 0,
    };
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
}

/**
 * Delete a menu item and its associated photos
 */
export async function deleteMenu(id: string): Promise<void> {
  try {
    // Delete photos first
    await deleteMenuPhotos(id);

    // Delete menu
    const { error } = await supabase.from('menus').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
}

/**
 * Get all photos for a menu item
 */
export async function getMenuPhotos(menuId: string): Promise<string[]> {
  try {
    const { data: photos, error } = await supabase
      .from('menu_photos')
      .select('url')
      .eq('menu_id', menuId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return photos?.map((photo) => photo.url) || [];
  } catch (error) {
    console.error('Error fetching menu photos:', error);
    return [];
  }
}

/**
 * Add a photo to a menu item
 */
export async function addMenuPhoto(menuId: string, photoUrl: string): Promise<string[]> {
  try {
    const { error } = await supabase.from('menu_photos').insert([
      {
        menu_id: menuId,
        url: photoUrl,
      },
    ]);

    if (error) throw error;

    return getMenuPhotos(menuId);
  } catch (error) {
    console.error('Error adding menu photo:', error);
    throw error;
  }
}

/**
 * Delete all photos for a menu item
 */
export async function deleteMenuPhotos(menuId: string): Promise<void> {
  try {
    const { error } = await supabase.from('menu_photos').delete().eq('menu_id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu photos:', error);
    throw error;
  }
}
