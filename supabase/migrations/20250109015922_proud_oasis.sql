-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_incidents_sensitivity ON incidents(sensitivity_level) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Add missing constraints using DO block
DO $$ BEGIN
  -- Check if constraints exist before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_incident_dates'
  ) THEN
    ALTER TABLE incidents 
      ADD CONSTRAINT check_incident_dates 
      CHECK (occurred_at <= CURRENT_TIMESTAMP);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_expense_amount'
  ) THEN
    ALTER TABLE expenses 
      ADD CONSTRAINT check_expense_amount 
      CHECK (amount >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_asset_value'
  ) THEN
    ALTER TABLE assets 
      ADD CONSTRAINT check_asset_value 
      CHECK (value >= 0);
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE incidents IS 'Stores incident records with sensitivity levels and metadata';
COMMENT ON TABLE expenses IS 'Tracks financial transactions related to divorce proceedings';
COMMENT ON TABLE assets IS 'Manages property and valuables subject to division';
COMMENT ON TABLE audit_logs IS 'Records system activity for security and compliance';