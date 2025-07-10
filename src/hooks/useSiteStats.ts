
import { useQuery } from '@tanstack/react-query';
import { SiteStatsService } from '@/services/siteStatsService';

export interface SiteStat {
  id: string;
  label: string;
  value: string;
  display_order: number;
}

export const useSiteStats = () => {
  return useQuery({
    queryKey: ['site_stats'],
    queryFn: SiteStatsService.getAllSiteStats,
  });
};
