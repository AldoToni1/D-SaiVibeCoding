import { supabase } from '../supabase';

export interface AnalyticsRow {
  id: string;
  menu_id: string | null;
  view_count: number;
  created_at: string;
}

/**
 * Get analytics for a specific menu item
 */
export async function getMenuAnalytics(menuId: string): Promise<AnalyticsRow | null> {
  try {
    const { data: analytics, error } = await supabase.from('analytics').select('*').eq('menu_id', menuId).single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows found" error, which is expected
      throw error;
    }

    return analytics || null;
  } catch (error) {
    console.error('Error fetching menu analytics:', error);
    return null;
  }
}

/**
 * Get all analytics records
 */
export async function getAllAnalytics(): Promise<AnalyticsRow[]> {
  try {
    const { data: analytics, error } = await supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return analytics || [];
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    return [];
  }
}

/**
 * Increment view count for a menu item
 */
export async function trackMenuView(menuId: string): Promise<AnalyticsRow | null> {
  try {
    // First, check if analytics record exists
    let analytics = await getMenuAnalytics(menuId);

    if (!analytics) {
      // Create new record
      const { data: newAnalytics, error } = await supabase
        .from('analytics')
        .insert([
          {
            menu_id: menuId,
            view_count: 1,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return newAnalytics;
    } else {
      // Increment existing record
      const { data: updatedAnalytics, error } = await supabase
        .from('analytics')
        .update({
          view_count: analytics.view_count + 1,
        })
        .eq('id', analytics.id)
        .select()
        .single();

      if (error) throw error;
      return updatedAnalytics;
    }
  } catch (error) {
    console.error('Error tracking menu view:', error);
    return null;
  }
}

/**
 * Track overall menu view (without specific item)
 */
export async function trackOverallView(): Promise<AnalyticsRow | null> {
  try {
    // Get overall analytics (menu_id is null)
    const { data: analytics, error: fetchError } = await supabase
      .from('analytics')
      .select('*')
      .eq('menu_id', null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (!analytics) {
      // Create new overall analytics record
      const { data: newAnalytics, error } = await supabase
        .from('analytics')
        .insert([
          {
            view_count: 1,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return newAnalytics;
    } else {
      // Increment existing record
      const { data: updatedAnalytics, error } = await supabase
        .from('analytics')
        .update({
          view_count: analytics.view_count + 1,
        })
        .eq('id', analytics.id)
        .select()
        .single();

      if (error) throw error;
      return updatedAnalytics;
    }
  } catch (error) {
    console.error('Error tracking overall view:', error);
    return null;
  }
}

/**
 * Get view count summary
 */
export async function getAnalyticsSummary(): Promise<{
  totalViews: number;
  itemViews: Record<string, number>;
}> {
  try {
    const analytics = await getAllAnalytics();

    const totalViews = analytics.find((a) => a.menu_id === null)?.view_count || 0;

    const itemViews: Record<string, number> = {};
    analytics.forEach((a) => {
      if (a.menu_id) {
        itemViews[a.menu_id] = a.view_count;
      }
    });

    return {
      totalViews,
      itemViews,
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      totalViews: 0,
      itemViews: {},
    };
  }
}
