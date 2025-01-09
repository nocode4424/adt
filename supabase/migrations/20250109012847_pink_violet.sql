/*
  # Fix Policy Syntax and Add Security Enhancements

  1. Changes
    - Fix policy syntax for soft delete
    - Add proper RLS policies
    - Add security constraints

  2. Security
    - Proper policy checks
    - Additional validation
*/

-- Fix policy syntax for soft delete
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can soft delete own incidents" ON incidents;
  
  CREATE POLICY "Users can soft delete own incidents" 
    ON incidents
    FOR UPDATE
    USING (
      auth.uid() = user_id
      AND deleted_at IS NULL
    )
    WITH CHECK (
      auth.uid() = user_id
      AND deleted_at IS NOT NULL
    );

  -- Add additional security policies
  DROP POLICY IF EXISTS "Users can view own incidents" ON incidents;
  CREATE POLICY "Users can view own incidents"
    ON incidents
    FOR SELECT
    USING (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM shared_access
        WHERE shared_with_email = auth.email()
        AND access_level IN ('read', 'write')
        AND expires_at > CURRENT_TIMESTAMP
      )
    );

  DROP POLICY IF EXISTS "Users can create incidents" ON incidents;
  CREATE POLICY "Users can create incidents"
    ON incidents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own incidents" ON incidents;
  CREATE POLICY "Users can update own incidents"
    ON incidents
    FOR UPDATE
    USING (
      auth.uid() = user_id
      AND deleted_at IS NULL
    );

END $$;