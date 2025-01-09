import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { sanitizeInput } from '../utils';

// Input sanitization middleware
export function sanitizeData<T extends Record<string, any>>(data: T): T {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

// File upload security checks
export async function validateFileUpload(file: File): Promise<boolean> {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > MAX_FILE_SIZE) {
    toast.error('File size exceeds 10MB limit');
    return false;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error('File type not supported');
    return false;
  }

  return true;
}

// Audit logging
export async function createAuditLog(params: {
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
}) {
  const supabase = createClientComponentClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      details: params.details,
      ip_address: window.location.hostname,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}