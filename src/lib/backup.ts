import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

const TABLES_TO_BACKUP = [
  'incidents',
  'expenses',
  'assets',
  'audit_logs',
  'notifications'
];

export async function createBackup() {
  const supabase = createClientComponentClient();
  const timestamp = new Date().toISOString();

  try {
    // Start backup record
    const { data: backup, error: backupError } = await supabase
      .from('backups')
      .insert({
        timestamp,
        status: 'in_progress',
        tables_included: TABLES_TO_BACKUP
      })
      .select()
      .single();

    if (backupError) throw backupError;

    // Fetch and backup each table
    const backupData: Record<string, any> = {};
    for (const table of TABLES_TO_BACKUP) {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) throw error;
      backupData[table] = data;
    }

    // Create backup file
    const backupContent = JSON.stringify(backupData, null, 2);
    const backupBlob = new Blob([backupContent], { type: 'application/json' });
    const backupFile = new File([backupBlob], `backup-${timestamp}.json`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('backups')
      .upload(`${timestamp}/data.json`, backupFile);

    if (uploadError) throw uploadError;

    // Update backup record
    await supabase
      .from('backups')
      .update({
        status: 'completed',
        size_bytes: backupFile.size,
        completed_at: new Date().toISOString()
      })
      .eq('id', backup.id);

    toast.success('Backup completed successfully');
    return { success: true, timestamp };
  } catch (error) {
    console.error('Backup error:', error);
    toast.error('Backup failed');
    throw error;
  }
}

export async function restoreFromBackup(backupId: string) {
  const supabase = createClientComponentClient();

  try {
    // Get backup record
    const { data: backup, error: backupError } = await supabase
      .from('backups')
      .select('*')
      .eq('id', backupId)
      .single();

    if (backupError) throw backupError;

    // Download backup file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('backups')
      .download(`${backup.timestamp}/data.json`);

    if (downloadError) throw downloadError;

    // Parse backup data
    const backupContent = await fileData.text();
    const backupData = JSON.parse(backupContent);

    // Restore each table
    for (const [table, data] of Object.entries(backupData)) {
      const { error } = await supabase
        .from(table)
        .upsert(data as any[]);

      if (error) throw error;
    }

    toast.success('Backup restored successfully');
    return { success: true };
  } catch (error) {
    console.error('Restore error:', error);
    toast.error('Failed to restore backup');
    throw error;
  }
}

export async function listBackups() {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing backups:', error);
    throw error;
  }
}

export async function scheduleBackup(schedule: 'daily' | 'weekly' | 'monthly') {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase
      .from('backup_schedules')
      .upsert({
        schedule,
        next_run: calculateNextRun(schedule),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    toast.success(`Automatic backups scheduled ${schedule}`);
  } catch (error) {
    console.error('Error scheduling backup:', error);
    toast.error('Failed to schedule backup');
    throw error;
  }
}

function calculateNextRun(schedule: 'daily' | 'weekly' | 'monthly'): string {
  const now = new Date();
  switch (schedule) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
  }
  return now.toISOString();
}