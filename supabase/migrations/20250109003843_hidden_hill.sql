/*
  # Add Monthly Summary View

  1. New Views
    - `monthly_incident_summary`: Summarizes incidents by user and month
      - Total incidents
      - Unique incident types
      - Average sentiment score
      - High priority incident count

  2. Functions
    - `refresh_summaries()`: Function to refresh materialized views
*/

-- Create materialized view for reporting
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_incident_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', occurred_at) as month,
  COUNT(*) as total_incidents,
  COUNT(DISTINCT type) as unique_types,
  AVG(sentiment_score) as avg_sentiment,
  SUM(CASE WHEN sensitivity_level = 'high' THEN 1 ELSE 0 END) as high_priority_count
FROM incidents
WHERE deleted_at IS NULL
GROUP BY user_id, DATE_TRUNC('month', occurred_at);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_summaries()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_incident_summary;
END;
$$ LANGUAGE plpgsql;