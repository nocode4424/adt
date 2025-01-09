export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          profile_data: Json
          settings: Json
          metadata: Json
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          profile_data?: Json
          settings?: Json
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          profile_data?: Json
          settings?: Json
          metadata?: Json
        }
      }
      incidents: {
        Row: {
          id: string
          user_id: string
          type: string
          description: string | null
          occurred_at: string
          location: string | null
          ai_classification: string | null
          sentiment_score: number | null
          metadata: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
          version: number
          revision_history: Json[]
          sensitivity_level: 'high' | 'medium' | 'low' | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          description?: string | null
          occurred_at: string
          location?: string | null
          ai_classification?: string | null
          sentiment_score?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          version?: number
          revision_history?: Json[]
          sensitivity_level?: 'high' | 'medium' | 'low' | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          description?: string | null
          occurred_at?: string
          location?: string | null
          ai_classification?: string | null
          sentiment_score?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          version?: number
          revision_history?: Json[]
          sensitivity_level?: 'high' | 'medium' | 'low' | null
        }
      }
    }
    Views: {
      monthly_incident_summary: {
        Row: {
          user_id: string
          month: string
          total_incidents: number
          unique_types: number
          avg_sentiment: number | null
          high_priority_count: number
        }
      }
    }
  }
}