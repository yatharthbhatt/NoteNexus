import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { AnalyticsData } from '../types';

export const useAnalytics = () => {
  const { user } = useAuth();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!user) throw new Error('User not authenticated');

      // Get total notes count
      const { count: totalNotes } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_trashed', false);

      // Get notes created this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: notesThisWeek } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      // Get most used labels
      const { data: labelUsage } = await supabase
        .from('note_labels')
        .select(`
          label_id,
          labels(name)
        `)
        .eq('labels.user_id', user.id);

      const labelCounts = labelUsage?.reduce((acc: any, item: any) => {
        const labelName = item.labels?.name;
        if (labelName) {
          acc[labelName] = (acc[labelName] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const mostUsedLabels = Object.entries(labelCounts)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get activity heatmap (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activityData } = await supabase
        .from('notes')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const activityHeatmap = activityData?.reduce((acc: any, note: any) => {
        const date = new Date(note.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const heatmapArray = Object.entries(activityHeatmap)
        .map(([date, count]) => ({ date, count: count as number }));

      // Get note types distribution
      const { data: noteTypes } = await supabase
        .from('notes')
        .select('type')
        .eq('user_id', user.id)
        .eq('is_trashed', false);

      const typeDistribution = noteTypes?.reduce((acc: any, note: any) => {
        acc[note.type] = (acc[note.type] || 0) + 1;
        return acc;
      }, {}) || {};

      const noteTypesArray = Object.entries(typeDistribution)
        .map(([type, count]) => ({ type, count: count as number }));

      return {
        totalNotes: totalNotes || 0,
        notesThisWeek: notesThisWeek || 0,
        mostUsedLabels,
        activityHeatmap: heatmapArray,
        noteTypes: noteTypesArray,
      };
    },
    enabled: !!user,
  });

  const trackEvent = async (eventType: string, eventData: any) => {
    if (!user) return;

    try {
      await supabase.from('user_analytics').insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  return {
    analyticsData,
    loading: isLoading,
    trackEvent,
  };
};