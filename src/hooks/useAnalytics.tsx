import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  pageViews: { page: string; views: number; date: string }[];
  totalViews: number;
  uniqueVisitors: number;
  popularPages: { title: string; slug: string; views: number }[];
  recentActivity: { action: string; page: string; timestamp: string }[];
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // In a real implementation, you would fetch from an analytics table
      // For now, we'll simulate analytics data based on pages
      const { data: pages } = await supabase
        .from('pages')
        .select('title, slug, created_at')
        .eq('is_published', true);

      if (pages) {
        // Simulate analytics data
        const simulatedData: AnalyticsData = {
          pageViews: pages.map((page, index) => ({
            page: page.title,
            views: Math.floor(Math.random() * 100) + 10,
            date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })),
          totalViews: pages.length * 45,
          uniqueVisitors: pages.length * 23,
          popularPages: pages.slice(0, 5).map((page, index) => ({
            title: page.title,
            slug: page.slug,
            views: Math.floor(Math.random() * 50) + 20 - index * 5
          })).sort((a, b) => b.views - a.views),
          recentActivity: pages.slice(0, 10).map((page, index) => ({
            action: Math.random() > 0.5 ? 'View' : 'Search',
            page: page.title,
            timestamp: new Date(Date.now() - index * 60000).toISOString()
          }))
        };

        setAnalytics(simulatedData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (pageSlug: string, pageTitle: string) => {
    // In a real implementation, you would insert into an analytics table
    console.log('Tracking page view:', pageSlug, pageTitle);
  };

  return {
    analytics,
    loading,
    refreshAnalytics: fetchAnalytics,
    trackPageView
  };
}