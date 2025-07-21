
import { supabase } from '@/integrations/supabase/client';
import type { SiteStat } from '@/hooks/useSiteStats';

export class SiteStatsService {
  static async getAllSiteStats(): Promise<SiteStat[]> {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching site stats:', error);
      throw error;
    }
    
    return data as SiteStat[];
  }
}
