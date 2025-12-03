import { supabase } from '../supabase';

export interface ConnectionStatus {
  isConnected: boolean;
  hasCredentials: boolean;
  canAccessDatabase: boolean;
  canAccessStorage: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Mengecek status koneksi Supabase
 */
export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  const status: ConnectionStatus = {
    isConnected: false,
    hasCredentials: false,
    canAccessDatabase: false,
    canAccessStorage: false,
    errors: [],
    warnings: [],
  };

  // Check 1: Environment Variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    status.errors.push(
      'Environment variables tidak lengkap. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah di-set di file .env'
    );
    return status;
  }

  status.hasCredentials = true;

  // Check 2: Test Auth Connection
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      status.warnings.push(`Auth connection warning: ${error.message}`);
    }
  } catch (error: any) {
    status.errors.push(`Auth connection error: ${error.message}`);
    return status;
  }

  // Check 3: Test Database Connection (menus table)
  try {
    const { data, error } = await supabase.from('menus').select('id').limit(1);

    if (error) {
      status.errors.push(`Database error: ${error.message}`);
      status.warnings.push(
        'Kemungkinan penyebab: Table "menus" belum dibuat atau RLS (Row Level Security) belum dikonfigurasi'
      );
    } else {
      status.canAccessDatabase = true;
    }
  } catch (error: any) {
    status.errors.push(`Database connection error: ${error.message}`);
  }

  // Check 4: Test Storage Connection
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      status.warnings.push(`Storage warning: ${error.message}`);
    } else {
      const hasMenuPhotos = data?.some((bucket) => bucket.name === 'menu_photos');
      if (hasMenuPhotos) {
        status.canAccessStorage = true;
      } else {
        status.warnings.push('Bucket "menu_photos" belum dibuat di Supabase Storage');
      }
    }
  } catch (error: any) {
    status.warnings.push(`Storage connection warning: ${error.message}`);
  }

  // Overall connection status
  status.isConnected = status.hasCredentials && status.canAccessDatabase && status.errors.length === 0;

  return status;
}

