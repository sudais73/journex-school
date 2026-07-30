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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          enrollment_id: string | null
          file_url: string | null
          id: string
          issued_at: string
          title: string
          user_id: string
        }
        Insert: {
          enrollment_id?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string
          title: string
          user_id: string
        }
        Update: {
          enrollment_id?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      compensation_rules: {
        Row: {
          code: string
          created_at: string
          depth: number
          description: string | null
          id: string
          is_active: boolean
          label: string
          point_type: string
          points: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          depth?: number
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          point_type: string
          points?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          depth?: number
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          point_type?: string
          points?: number
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          package_id: string
          progress: number
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          package_id: string
          progress?: number
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          package_id?: string
          progress?: number
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number | null
          features: Json
          id: string
          is_active: boolean
          language: string
          name: string
          pjp_reward: number
          price_etb: number
          sort_order: number
          tier: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          features?: Json
          id?: string
          is_active?: boolean
          language: string
          name: string
          pjp_reward?: number
          price_etb: number
          sort_order?: number
          tier: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          features?: Json
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          pjp_reward?: number
          price_etb?: number
          sort_order?: number
          tier?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_etb: number
          created_at: string
          enrollment_id: string | null
          id: string
          package_id: string | null
          provider: string
          reference: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_etb: number
          created_at?: string
          enrollment_id?: string | null
          id?: string
          package_id?: string | null
          provider?: string
          reference?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_etb?: number
          created_at?: string
          enrollment_id?: string | null
          id?: string
          package_id?: string | null
          provider?: string
          reference?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      point_events: {
        Row: {
          created_at: string
          depth: number
          id: string
          point_type: string
          points: number
          reason: string
          rule_code: string | null
          source_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          depth?: number
          id?: string
          point_type: string
          points: number
          reason: string
          rule_code?: string | null
          source_user_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          depth?: number
          id?: string
          point_type?: string
          points?: number
          reason?: string
          rule_code?: string | null
          source_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_events_source_user_id_fkey"
            columns: ["source_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_number: string | null
          address: string | null
          age: number | null
          avatar_url: string | null
          created_at: string
          educational_status: string | null
          email: string | null
          first_name: string
          gender: string | null
          id: string
          job: string | null
          last_name: string
          level: string
          middle_name: string | null
          phone: string | null
          referral_username: string
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          educational_status?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          id: string
          job?: string | null
          last_name: string
          level?: string
          middle_name?: string | null
          phone?: string | null
          referral_username: string
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          educational_status?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          job?: string | null
          last_name?: string
          level?: string
          middle_name?: string | null
          phone?: string | null
          referral_username?: string
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
      wallets: {
        Row: {
          balance_etb: number
          created_at: string
          id: string
          lifetime_earned_etb: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_etb?: number
          created_at?: string
          id?: string
          lifetime_earned_etb?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_etb?: number
          created_at?: string
          id?: string
          lifetime_earned_etb?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_referral_points: { Args: { _new_user: string }; Returns: undefined }
      complete_registration: { Args: { _payload: Json }; Returns: Json }
      generate_referral_username: {
        Args: { _first: string; _last: string }
        Returns: string
      }
      get_referral_team: {
        Args: { _max_depth?: number }
        Returns: {
          depth: number
          first_name: string
          id: string
          joined_at: string
          last_name: string
          level: string
          referral_username: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      my_referrer: { Args: never; Returns: string }
      referral_username_exists: {
        Args: { _username: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partner" | "user"
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
      app_role: ["admin", "partner", "user"],
    },
  },
} as const
