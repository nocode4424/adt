export interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data?: {
    name?: string;
    avatar_url?: string;
  };
  settings?: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

export interface Incident {
  id: string;
  user_id: string;
  type: string;
  description: string;
  occurred_at: string;
  location?: string;
  ai_classification?: string;
  sentiment_score?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  value?: number;
  status: 'active' | 'pending' | 'divided';
  division_details?: Record<string, any>;
}