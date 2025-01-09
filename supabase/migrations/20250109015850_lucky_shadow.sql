-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can create own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can read tags" ON tags;
DROP POLICY IF EXISTS "Users can create tags" ON tags;
DROP POLICY IF EXISTS "Users can read incident tags" ON incident_tags;
DROP POLICY IF EXISTS "Users can manage own incident tags" ON incident_tags;
DROP POLICY IF EXISTS "Only authenticated users can access backups" ON backups;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
DROP TRIGGER IF EXISTS calendar_event_notification ON calendar_events;
DROP TRIGGER IF EXISTS update_backup_schedule ON backups;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS notify_user() CASCADE;
DROP FUNCTION IF EXISTS schedule_next_backup() CASCADE;

-- Create tables first
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  type TEXT CHECK (type IN ('court', 'meeting', 'deadline', 'other')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('incident', 'expense', 'asset', 'system')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS incident_tags (
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (incident_id, tag_id)
);

CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL,
  size_bytes BIGINT,
  tables_included TEXT[],
  status TEXT CHECK (status IN ('in_progress', 'completed', 'failed')),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS backup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule TEXT CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  next_run TIMESTAMPTZ NOT NULL,
  last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_schedules ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_time ON calendar_events(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_incident_tags_incident ON incident_tags(incident_id);
CREATE INDEX IF NOT EXISTS idx_backups_timestamp ON backups(timestamp);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION notify_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, metadata)
  VALUES (
    NEW.user_id,
    CASE
      WHEN TG_TABLE_NAME = 'incidents' THEN 'New Incident Recorded'
      WHEN TG_TABLE_NAME = 'expenses' THEN 'New Expense Recorded'
      WHEN TG_TABLE_NAME = 'assets' THEN 'New Asset Recorded'
      WHEN TG_TABLE_NAME = 'calendar_events' THEN 'New Event Added'
    END,
    CASE
      WHEN TG_TABLE_NAME = 'incidents' THEN 'A new incident has been recorded'
      WHEN TG_TABLE_NAME = 'expenses' THEN 'A new expense has been recorded'
      WHEN TG_TABLE_NAME = 'assets' THEN 'A new asset has been recorded'
      WHEN TG_TABLE_NAME = 'calendar_events' THEN 'A new event has been added to your calendar'
    END,
    TG_TABLE_NAME,
    jsonb_build_object('record_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION schedule_next_backup()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE backup_schedules
  SET last_run = NEW.timestamp,
      next_run = CASE
        WHEN schedule = 'daily' THEN NEW.timestamp + INTERVAL '1 day'
        WHEN schedule = 'weekly' THEN NEW.timestamp + INTERVAL '1 week'
        WHEN schedule = 'monthly' THEN NEW.timestamp + INTERVAL '1 month'
      END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
CREATE POLICY "Users can view own calendar events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events"
  ON calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can read incident tags"
  ON incident_tags FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM incidents i
    WHERE i.id = incident_id
    AND i.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own incident tags"
  ON incident_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM incidents i
    WHERE i.id = incident_id
    AND i.user_id = auth.uid()
  ));

CREATE POLICY "Only authenticated users can access backups"
  ON backups FOR ALL
  TO authenticated
  USING (true);

-- Create triggers
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calendar_event_notification
  AFTER INSERT ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION notify_user();

CREATE TRIGGER update_backup_schedule
  AFTER INSERT ON backups
  FOR EACH ROW
  EXECUTE FUNCTION schedule_next_backup();