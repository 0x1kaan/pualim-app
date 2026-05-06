export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CustomerTag = 'vip' | 'loyal' | 'new' | 'at_risk' | 'lost'
export type CafePlan = 'starter' | 'pro' | 'chain'
export type PendingStampStatus = 'pending' | 'approved' | 'rejected'
export type RewardStatus = 'available' | 'redeemed' | 'expired'
export type NotificationChannel = 'whatsapp' | 'sms' | 'email'
export type NotificationType = 'stamp' | 'reward' | 'campaign' | 'winback' | 'birthday' | 'otp'
export type NotificationStatus = 'pending' | 'sent' | 'failed'

export interface Database {
  public: {
    Tables: {
      cafes: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          primary_color: string
          stamps_required: number
          plan: CafePlan
          plan_expires_at: string | null
          whatsapp_enabled: boolean
          sms_enabled: boolean
          email_enabled: boolean
          reward_title: string
          reward_description: string | null
          address: string | null
          phone: string | null
          instagram: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          stamps_required?: number
          plan?: CafePlan
          plan_expires_at?: string | null
          whatsapp_enabled?: boolean
          sms_enabled?: boolean
          email_enabled?: boolean
          reward_title?: string
          reward_description?: string | null
          address?: string | null
          phone?: string | null
          instagram?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          stamps_required?: number
          plan?: CafePlan
          plan_expires_at?: string | null
          whatsapp_enabled?: boolean
          sms_enabled?: boolean
          email_enabled?: boolean
          reward_title?: string
          reward_description?: string | null
          address?: string | null
          phone?: string | null
          instagram?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          cafe_id: string
          phone: string
          name: string | null
          birthday: string | null
          total_stamps: number
          current_stamps: number
          visit_count: number
          tag: CustomerTag
          last_visit_at: string | null
          notes: string | null
          whatsapp_consent: boolean
          sms_consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cafe_id: string
          phone: string
          name?: string | null
          birthday?: string | null
          total_stamps?: number
          current_stamps?: number
          visit_count?: number
          tag?: CustomerTag
          last_visit_at?: string | null
          notes?: string | null
          whatsapp_consent?: boolean
          sms_consent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string | null
          birthday?: string | null
          total_stamps?: number
          current_stamps?: number
          visit_count?: number
          tag?: CustomerTag
          last_visit_at?: string | null
          notes?: string | null
          whatsapp_consent?: boolean
          sms_consent?: boolean
          updated_at?: string
        }
      }
      pending_stamps: {
        Row: {
          id: string
          cafe_id: string
          customer_id: string | null
          phone: string
          status: PendingStampStatus
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          cafe_id: string
          customer_id?: string | null
          phone: string
          status?: PendingStampStatus
          created_at?: string
          expires_at?: string
        }
        Update: {
          customer_id?: string | null
          status?: PendingStampStatus
        }
      }
      stamps: {
        Row: {
          id: string
          customer_id: string
          cafe_id: string
          approved_by: string | null
          approved_at: string
          campaign_id: string | null
          multiplier: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cafe_id: string
          approved_by?: string | null
          approved_at?: string
          campaign_id?: string | null
          multiplier?: number
          note?: string | null
          created_at?: string
        }
        Update: never
      }
      rewards: {
        Row: {
          id: string
          customer_id: string
          cafe_id: string
          earned_at: string
          redeemed_at: string | null
          expires_at: string | null
          status: RewardStatus
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cafe_id: string
          earned_at?: string
          redeemed_at?: string | null
          expires_at?: string | null
          status?: RewardStatus
          created_at?: string
        }
        Update: {
          redeemed_at?: string | null
          status?: RewardStatus
        }
      }
      campaigns: {
        Row: {
          id: string
          cafe_id: string
          name: string
          description: string | null
          starts_at: string
          ends_at: string
          active_days: number[]
          active_hours_start: number
          active_hours_end: number
          stamp_multiplier: number
          bonus_stamps: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cafe_id: string
          name: string
          description?: string | null
          starts_at: string
          ends_at: string
          active_days?: number[]
          active_hours_start?: number
          active_hours_end?: number
          stamp_multiplier?: number
          bonus_stamps?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          starts_at?: string
          ends_at?: string
          active_days?: number[]
          active_hours_start?: number
          active_hours_end?: number
          stamp_multiplier?: number
          bonus_stamps?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          customer_id: string
          cafe_id: string
          channel: NotificationChannel
          type: NotificationType
          message: string
          status: NotificationStatus
          error_message: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          cafe_id: string
          channel: NotificationChannel
          type: NotificationType
          message: string
          status?: NotificationStatus
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          status?: NotificationStatus
          error_message?: string | null
          sent_at?: string | null
        }
      }
      otps: {
        Row: {
          id: string
          phone: string
          cafe_id: string
          code: string
          used: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          cafe_id: string
          code: string
          used?: boolean
          expires_at?: string
          created_at?: string
        }
        Update: {
          used?: boolean
        }
      }
    }
    Views: {
      [_ in never]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Functions: {
      get_cafe_analytics: {
        Args: { p_cafe_id: string; p_days?: number }
        Returns: Json
      }
      auto_tag_customers: {
        Args: { p_cafe_id?: string }
        Returns: void
      }
      expire_old_rewards: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: {
        [_ in never]: never
      }
    }
  }
}

// Convenience types
export type Cafe = Database['public']['Tables']['cafes']['Row']
export type CafeInsert = Database['public']['Tables']['cafes']['Insert']
export type CafeUpdate = Database['public']['Tables']['cafes']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type PendingStamp = Database['public']['Tables']['pending_stamps']['Row']
export type Stamp = Database['public']['Tables']['stamps']['Row']
export type Reward = Database['public']['Tables']['rewards']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert']
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update']
export type Notification = Database['public']['Tables']['notifications']['Row']
