import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnalyticsSummary, IncidentTrend, LocationStat } from '../types/analytics';

const supabase = createClientComponentClient();

export async function getIncidentAnalytics(userId: string): Promise<AnalyticsSummary> {
  const [trendsResponse, locationsResponse] = await Promise.all([
    supabase
      .from('incident_trends')
      .select('*')
      .eq('user_id', userId)
      .order('week', { ascending: false })
      .limit(12),
    supabase
      .from('incident_location_stats')
      .select('*')
      .eq('user_id', userId)
  ]);

  if (trendsResponse.error) throw trendsResponse.error;
  if (locationsResponse.error) throw locationsResponse.error;

  const trends = trendsResponse.data as IncidentTrend[];
  const locations = locationsResponse.data as LocationStat[];

  const totalIncidents = trends.reduce((sum, trend) => sum + trend.incident_count, 0);
  const totalHighSeverity = trends.reduce((sum, trend) => sum + trend.high_severity_count, 0);
  const highSeverityPercentage = totalIncidents > 0 
    ? (totalHighSeverity / totalIncidents) * 100 
    : 0;

  return {
    trends,
    locations,
    totalIncidents,
    highSeverityPercentage
  };
}