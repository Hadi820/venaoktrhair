import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          company_name: string | null;
          website: string | null;
          address: string | null;
          bank_account: string | null;
          authorized_signer: string | null;
          id_number: string | null;
          bio: string | null;
          income_categories: any[];
          expense_categories: any[];
          project_types: any[];
          event_types: any[];
          asset_categories: any[];
          sop_categories: any[];
          package_categories: any[];
          project_status_config: any[];
          notification_settings: any;
          security_settings: any;
          briefing_template: string | null;
          terms_and_conditions: string | null;
          contract_template: string | null;
          logo_base64: string | null;
          brand_color: string | null;
          public_page_config: any;
          package_share_template: string | null;
          booking_form_template: string | null;
          chat_templates: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          company_name?: string | null;
          website?: string | null;
          address?: string | null;
          bank_account?: string | null;
          authorized_signer?: string | null;
          id_number?: string | null;
          bio?: string | null;
          income_categories?: any[];
          expense_categories?: any[];
          project_types?: any[];
          event_types?: any[];
          asset_categories?: any[];
          sop_categories?: any[];
          package_categories?: any[];
          project_status_config?: any[];
          notification_settings?: any;
          security_settings?: any;
          briefing_template?: string | null;
          terms_and_conditions?: string | null;
          contract_template?: string | null;
          logo_base64?: string | null;
          brand_color?: string | null;
          public_page_config?: any;
          package_share_template?: string | null;
          booking_form_template?: string | null;
          chat_templates?: any[];
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          company_name?: string | null;
          website?: string | null;
          address?: string | null;
          bank_account?: string | null;
          authorized_signer?: string | null;
          id_number?: string | null;
          bio?: string | null;
          income_categories?: any[];
          expense_categories?: any[];
          project_types?: any[];
          event_types?: any[];
          asset_categories?: any[];
          sop_categories?: any[];
          package_categories?: any[];
          project_status_config?: any[];
          notification_settings?: any;
          security_settings?: any;
          briefing_template?: string | null;
          terms_and_conditions?: string | null;
          contract_template?: string | null;
          logo_base64?: string | null;
          brand_color?: string | null;
          public_page_config?: any;
          package_share_template?: string | null;
          booking_form_template?: string | null;
          chat_templates?: any[];
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          whatsapp: string | null;
          since: string;
          instagram: string | null;
          status: string;
          client_type: string;
          last_contact: string;
          portal_access_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          whatsapp?: string | null;
          since?: string;
          instagram?: string | null;
          status?: string;
          client_type?: string;
          last_contact?: string;
          portal_access_id?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          whatsapp?: string | null;
          since?: string;
          instagram?: string | null;
          status?: string;
          client_type?: string;
          last_contact?: string;
          portal_access_id?: string;
        };
      };
      // Add other table types as needed...
    };
  };
}

// Minimal helpers and constants used by other modules. These are safe defaults
// for local development (no real Supabase session) and keep TypeScript happy.
export const TABLES = {
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  TEAM_MEMBERS: 'team_members',
  TRANSACTIONS: 'transactions',
  PACKAGES: 'packages',
  ADD_ONS: 'add_ons',
  TEAM_PROJECT_PAYMENTS: 'team_project_payments',
  TEAM_PAYMENT_RECORDS: 'team_payment_records',
  POCKETS: 'pockets',
  PROFILE: 'profiles',
  LEADS: 'leads',
  REWARD_LEDGER_ENTRIES: 'reward_ledger_entries',
  CARDS: 'cards',
  ASSETS: 'assets',
  CONTRACTS: 'contracts',
  CLIENT_FEEDBACK: 'client_feedback',
  NOTIFICATIONS: 'notifications',
  SOCIAL_MEDIA_POSTS: 'social_media_posts',
  PROMO_CODES: 'promo_codes',
  SOPS: 'sops',
  USERS: 'users'
} as const;

export function getSessionId(): string {
  // For local dev we don't have per-session tables; return a stable default.
  return 'default';
}

export function handleSupabaseError(err: any): void {
  // Basic error handler used by library functions. In prod this should be
  // replaced with proper logging and user-friendly UI handling.
  console.error('Supabase error:', err);
}