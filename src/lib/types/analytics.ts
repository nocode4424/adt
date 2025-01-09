export interface IncidentTrend {
  week: string;
  type: string;
  incident_count: number;
  avg_sentiment: number;
  high_severity_count: number;
}

export interface LocationStat {
  location: string;
  incident_count: number;
  incident_types: string[];
  high_severity_count: number;
}

export interface AnalyticsSummary {
  trends: IncidentTrend[];
  locations: LocationStat[];
  totalIncidents: number;
  highSeverityPercentage: number;
}