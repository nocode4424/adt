/*
  # Add Incident Analytics

  1. New Functions
    - `calculate_incident_severity`: Calculates severity score based on multiple factors
    - `update_incident_stats`: Updates incident statistics for reporting
    
  2. New Views
    - `incident_trends`: Analyzes incident patterns over time
    - `incident_location_stats`: Summarizes incidents by location
*/

-- Create function to calculate incident severity
CREATE OR REPLACE FUNCTION calculate_incident_severity(
  incident_type TEXT,
  sentiment_score FLOAT,
  has_attachments BOOLEAN
) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    CASE incident_type
      WHEN 'physical' THEN 5
      WHEN 'verbal' THEN 3
      WHEN 'financial' THEN 4
      ELSE 2
    END +
    CASE 
      WHEN sentiment_score < -0.5 THEN 2
      WHEN sentiment_score < 0 THEN 1
      ELSE 0
    END +
    CASE WHEN has_attachments THEN 1 ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view for incident trends
CREATE OR REPLACE VIEW incident_trends AS
SELECT
  user_id,
  DATE_TRUNC('week', occurred_at) as week,
  type,
  COUNT(*) as incident_count,
  AVG(sentiment_score) as avg_sentiment,
  COUNT(CASE WHEN sensitivity_level = 'high' THEN 1 END) as high_severity_count
FROM incidents
WHERE deleted_at IS NULL
GROUP BY user_id, DATE_TRUNC('week', occurred_at), type
ORDER BY week DESC;

-- Create view for location-based statistics
CREATE OR REPLACE VIEW incident_location_stats AS
SELECT
  user_id,
  location,
  COUNT(*) as incident_count,
  array_agg(DISTINCT type) as incident_types,
  COUNT(CASE WHEN sensitivity_level = 'high' THEN 1 END) as high_severity_count
FROM incidents
WHERE deleted_at IS NULL AND location IS NOT NULL
GROUP BY user_id, location;