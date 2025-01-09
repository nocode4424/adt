import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AuditLogParams {
  action_type: string;
  table_name: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
}

export async function createAuditLog({
  action_type,
  table_name,
  record_id,
  old_data,
  new_data
}: AuditLogParams) {
  const supabase = createClientComponentClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action_type,
      table_name,
      record_id,
      old_data,
      new_data,
      ip_address: window.location.hostname,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}