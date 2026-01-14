export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_plans: {
        Row: {
          available_minutes: number
          completed_minutes: number
          created_at: string
          focus_level: string
          focus_warning: string | null
          id: string
          plan_date: string
          selected_tasks: Json
          total_planned_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_minutes: number
          completed_minutes?: number
          created_at?: string
          focus_level: string
          focus_warning?: string | null
          id?: string
          plan_date: string
          selected_tasks?: Json
          total_planned_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_minutes?: number
          completed_minutes?: number
          created_at?: string
          focus_level?: string
          focus_warning?: string | null
          id?: string
          plan_date?: string
          selected_tasks?: Json
          total_planned_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          achievement_plan: Json | null
          available_hours: number | null
          calibrated_skill_level: string | null
          created_at: string
          deadline: string
          description: string | null
          estimated_hours: number | null
          feasibility_status:
          | Database["public"]["Enums"]["feasibility_status"]
          | null
          field: string | null
          hour_gap: number | null
          hours_per_week: number
          id: string
          is_active: boolean
          quiz_results: Json | null
          recommendations: Json | null
          selected_approach_id: string | null
          skill_level: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_plan?: Json | null
          available_hours?: number | null
          calibrated_skill_level?: string | null
          created_at?: string
          deadline: string
          description?: string | null
          estimated_hours?: number | null
          feasibility_status?:
          | Database["public"]["Enums"]["feasibility_status"]
          | null
          field?: string | null
          hour_gap?: number | null
          hours_per_week: number
          id?: string
          is_active?: boolean
          quiz_results?: Json | null
          recommendations?: Json | null
          selected_approach_id?: string | null
          skill_level: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_plan?: Json | null
          available_hours?: number | null
          calibrated_skill_level?: string | null
          created_at?: string
          deadline?: string
          description?: string | null
          estimated_hours?: number | null
          feasibility_status?:
          | Database["public"]["Enums"]["feasibility_status"]
          | null
          field?: string | null
          hour_gap?: number | null
          hours_per_week?: number
          id?: string
          is_active?: boolean
          quiz_results?: Json | null
          recommendations?: Json | null
          selected_approach_id?: string | null
          skill_level?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      micro_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_minutes: number
          id: string
          order_index: number
          status: Database["public"]["Enums"]["task_status"]
          task_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes: number
          id?: string
          order_index: number
          status?: Database["public"]["Enums"]["task_status"]
          task_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes?: number
          id?: string
          order_index?: number
          status?: Database["public"]["Enums"]["task_status"]
          task_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "micro_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_hours_per_week: number | null
          avatar_url: string | null
          completed_goals: number
          country: string | null
          created_at: string
          current_streak: number
          display_name: string | null
          education_level: string | null
          email: string | null
          full_name: string | null
          id: string
          last_reassessment_date: string | null
          longest_streak: number
          phone: string | null
          preferred_study_time: string | null
          primary_commitment: string | null
          reassessment_reminder_days: number | null
          reassessment_reminder_enabled: boolean | null
          stream: string | null
          tokens: number
          max_tokens: number
          total_goals: number
          total_hours_logged: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_hours_per_week?: number | null
          avatar_url?: string | null
          completed_goals?: number
          country?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          education_level?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_reassessment_date?: string | null
          longest_streak?: number
          phone?: string | null
          preferred_study_time?: string | null
          primary_commitment?: string | null
          reassessment_reminder_days?: number | null
          reassessment_reminder_enabled?: boolean | null
          stream?: string | null
          tokens?: number
          max_tokens?: number
          total_goals?: number
          total_hours_logged?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_hours_per_week?: number | null
          avatar_url?: string | null
          completed_goals?: number
          country?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          education_level?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_reassessment_date?: string | null
          longest_streak?: number
          phone?: string | null
          preferred_study_time?: string | null
          primary_commitment?: string | null
          reassessment_reminder_days?: number | null
          reassessment_reminder_enabled?: boolean | null
          stream?: string | null
          tokens?: number
          max_tokens?: number
          total_goals?: number
          total_hours_logged?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string
          tokens_received: number
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string
          tokens_received: number
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          tokens_received?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          uses_count?: number
        }
        Relationships: []
      }
      roadmap_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          estimated_hours: number
          id: string
          is_milestone: boolean
          order_index: number
          roadmap_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_hours: number
          id?: string
          is_milestone?: boolean
          order_index: number
          roadmap_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_hours?: number
          id?: string
          is_milestone?: boolean
          order_index?: number
          roadmap_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_steps_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          completed_steps: number
          created_at: string
          goal_id: string
          id: string
          is_active: boolean
          last_regenerated_at: string | null
          regeneration_count: number
          title: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_steps?: number
          created_at?: string
          goal_id: string
          id?: string
          is_active?: boolean
          last_regenerated_at?: string | null
          regeneration_count?: number
          title: string
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_steps?: number
          created_at?: string
          goal_id?: string
          id?: string
          is_active?: boolean
          last_regenerated_at?: string | null
          regeneration_count?: number
          title?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          estimated_hours: number
          goal_id: string
          id: string
          order_index: number
          phase_number: number
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_hours: number
          goal_id: string
          id?: string
          order_index: number
          phase_number: number
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_hours?: number
          goal_id?: string
          id?: string
          order_index?: number
          phase_number?: number
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      token_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string
          feature_used: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description: string
          feature_used?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string
          feature_used?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          avatar_url: string | null
          created_at: string
          eligible_for_testimonial: boolean
          feature: string
          feedback_text: string | null
          flag: string
          id: string
          rating: number | null
          role: string | null
          show_in_testimonial: boolean
          user_id: string
          user_name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          eligible_for_testimonial: boolean
          feature: string
          feedback_text?: string | null
          flag: string
          id?: string
          rating?: number | null
          role?: string | null
          show_in_testimonial?: boolean
          user_id: string
          user_name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          eligible_for_testimonial?: boolean
          feature?: string
          feedback_text?: string | null
          flag?: string
          id?: string
          rating?: number | null
          role?: string | null
          show_in_testimonial?: boolean
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      feasibility_status: "realistic" | "risky" | "unrealistic"
      task_status: "locked" | "unlocked" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      feasibility_status: ["realistic", "risky", "unrealistic"],
      task_status: ["locked", "unlocked", "in_progress", "completed"],
    },
  },
} as const
