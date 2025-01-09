/*
  # Complete Database Setup

  1. New Tables
    - `notifications`: Store user notifications
    - `tags`: Manage incident categorization
    - `incident_tags`: Junction table for incident-tag relationships

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
    - Add policies for admin users

  3. Functions
    - Add notification trigger
    - Add tag management functions
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('incident', 'expense', 'asset', 'system')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Create incident_tags junction table
CREATE TABLE IF NOT EXISTS incident_tags (
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (incident_id, tag_id)
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
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
  WITH CHECK (true);

CREATE POLICY "Users can read incident tags"
  ON incident_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own incident tags"
  ON incident_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM incidents i
      WHERE i.id = incident_id
      AND i.user_id = auth.uid()
    )
  );

-- Create notification trigger function
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
    END,
    CASE
      WHEN TG_TABLE_NAME = 'incidents' THEN 'A new incident has been recorded'
      WHEN TG_TABLE_NAME = 'expenses' THEN 'A new expense has been recorded'
      WHEN TG_TABLE_NAME = 'assets' THEN 'A new asset has been recorded'
    END,
    TG_TABLE_NAME,
    jsonb_build_object('record_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notification triggers
CREATE TRIGGER incident_notification
  AFTER INSERT ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION notify_user();

CREATE TRIGGER expense_notification
  AFTER INSERT ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION notify_user();

CREATE TRIGGER asset_notification
  AFTER INSERT ON assets
  FOR EACH ROW
  EXECUTE FUNCTION notify_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_incident_tags_incident ON incident_tags(incident_id);

-- Create tag management functions
CREATE OR REPLACE FUNCTION add_tags_to_incident(
  p_incident_id UUID,
  p_tag_names TEXT[]
)
RETURNS void AS $$
DECLARE
  v_tag_id UUID;
  v_tag_name TEXT;
BEGIN
  -- Check if user owns the incident
  IF NOT EXISTS (
    SELECT 1 FROM incidents
    WHERE id = p_incident_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Add tags
  FOREACH v_tag_name IN ARRAY p_tag_names
  LOOP
    -- Get or create tag
    INSERT INTO tags (name, color)
    VALUES (v_tag_name, '#' || encode(gen_random_bytes(3), 'hex'))
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO v_tag_id;

    IF v_tag_id IS NULL THEN
      SELECT id INTO v_tag_id FROM tags WHERE name = v_tag_name;
    END IF;

    -- Link tag to incident
    INSERT INTO incident_tags (incident_id, tag_id)
    VALUES (p_incident_id, v_tag_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;