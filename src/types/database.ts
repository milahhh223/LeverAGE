/**
 * Hand-written types matching supabase/migrations/0001-0004.
 *
 * Once the Supabase CLI is set up locally, replace this file by running:
 *   supabase gen types typescript --local > src/types/database.ts
 * That command regenerates this file automatically from the live schema —
 * keep it in sync by hand until then.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          strategy: string;
          market_focus: string;
          risk_profile: string;
          max_allocation_pct: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          strategy: string;
          market_focus: string;
          risk_profile: string;
          max_allocation_pct?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          strategy?: string;
          market_focus?: string;
          risk_profile?: string;
          max_allocation_pct?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          id: string;
          agent_id: string | null;
          user_id: string;
          market: string;
          dataset_id: string;
          starting_capital: number;
          current_capital: number;
          status: string;
          mode: string;
          label: string | null;
          current_sequence: number;
          position_side: string | null;
          position_entry_price: number | null;
          position_allocation_pct: number | null;
          position_allocation_value: number | null;
          peak_value: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id?: string | null;
          user_id: string;
          market: string;
          dataset_id: string;
          starting_capital?: number;
          current_capital?: number;
          status?: string;
          mode?: string;
          label?: string | null;
          current_sequence?: number;
          position_side?: string | null;
          position_entry_price?: number | null;
          position_allocation_pct?: number | null;
          position_allocation_value?: number | null;
          peak_value?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string | null;
          user_id?: string;
          market?: string;
          dataset_id?: string;
          starting_capital?: number;
          current_capital?: number;
          status?: string;
          mode?: string;
          label?: string | null;
          current_sequence?: number;
          position_side?: string | null;
          position_entry_price?: number | null;
          position_allocation_pct?: number | null;
          position_allocation_value?: number | null;
          peak_value?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      evaluation_decisions: {
        Row: {
          id: string;
          evaluation_id: string;
          agent_id: string | null;
          user_id: string;
          sequence: number;
          market_price: number;
          observation: string;
          reasoning: string;
          action: string;
          confidence: number;
          allocation_pct: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          evaluation_id: string;
          agent_id?: string | null;
          user_id: string;
          sequence: number;
          market_price: number;
          observation: string;
          reasoning: string;
          action: string;
          confidence: number;
          allocation_pct: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          evaluation_id?: string;
          agent_id?: string | null;
          user_id?: string;
          sequence?: number;
          market_price?: number;
          observation?: string;
          reasoning?: string;
          action?: string;
          confidence?: number;
          allocation_pct?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      evaluation_snapshots: {
        Row: {
          id: string;
          evaluation_id: string;
          agent_id: string | null;
          user_id: string;
          sequence: number;
          portfolio_value: number;
          return_pct: number;
          drawdown_pct: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          evaluation_id: string;
          agent_id?: string | null;
          user_id: string;
          sequence: number;
          portfolio_value: number;
          return_pct: number;
          drawdown_pct: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          evaluation_id?: string;
          agent_id?: string | null;
          user_id?: string;
          sequence?: number;
          portfolio_value?: number;
          return_pct?: number;
          drawdown_pct?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AgentRow = Database["public"]["Tables"]["agents"]["Row"];
export type EvaluationRow = Database["public"]["Tables"]["evaluations"]["Row"];
export type EvaluationDecisionRow = Database["public"]["Tables"]["evaluation_decisions"]["Row"];
export type EvaluationSnapshotRow = Database["public"]["Tables"]["evaluation_snapshots"]["Row"];
