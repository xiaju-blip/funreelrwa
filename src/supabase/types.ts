export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_important: boolean | null
          status: number | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          status?: number | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          status?: number | null
          title?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          apy: number | null
          cover: string | null
          created_at: string | null
          description: string | null
          duration_days: number | null
          end_time: string | null
          id: string
          name: string
          raised_amount: number | null
          start_time: string | null
          status: number | null
          target_amount: number
        }
        Insert: {
          apy?: number | null
          cover?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          end_time?: string | null
          id?: string
          name: string
          raised_amount?: number | null
          start_time?: string | null
          status?: number | null
          target_amount: number
        }
        Update: {
          apy?: number | null
          cover?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          end_time?: string | null
          id?: string
          name?: string
          raised_amount?: number | null
          start_time?: string | null
          status?: number | null
          target_amount?: number
        }
        Relationships: []
      }
      dramas: {
        Row: {
          category_id: string | null
          cover_image: string
          created_at: string | null
          description: Json | null
          id: string
          release_date: string | null
          status: number | null
          title: Json
          total_episodes: number | null
          updated_at: string | null
          vip_level: number | null
        }
        Insert: {
          category_id?: string | null
          cover_image: string
          created_at?: string | null
          description?: Json | null
          id?: string
          release_date?: string | null
          status?: number | null
          title: Json
          total_episodes?: number | null
          updated_at?: string | null
          vip_level?: number | null
        }
        Update: {
          category_id?: string | null
          cover_image?: string
          created_at?: string | null
          description?: Json | null
          id?: string
          release_date?: string | null
          status?: number | null
          title?: Json
          total_episodes?: number | null
          updated_at?: string | null
          vip_level?: number | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string | null
          drama_id: string
          duration: number | null
          episode_num: number
          id: string
          sort_order: number | null
          title: Json
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          drama_id: string
          duration?: number | null
          episode_num: number
          id?: string
          sort_order?: number | null
          title: Json
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          drama_id?: string
          duration?: number | null
          episode_num?: number
          id?: string
          sort_order?: number | null
          title?: Json
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_drama_id_fkey"
            columns: ["drama_id"]
            referencedRelation: "dramas"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_records: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          points_used: number
          quantity: number | null
          status: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          points_used?: number
          quantity?: number | null
          status?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          points_used?: number
          quantity?: number | null
          status?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_records_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_records: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          invitee_id: string
          inviter_id: string
          level: number
          reward_points: number | null
          reward_token: number | null
          status: number | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          invitee_id: string
          inviter_id: string
          level?: number
          reward_points?: number | null
          reward_token?: number | null
          status?: number | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          level?: number
          reward_points?: number | null
          reward_token?: number | null
          status?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_records_invitee_id_fkey"
            columns: ["invitee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_records_inviter_id_fkey"
            columns: ["inviter_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_config: {
        Row: {
          api_key: string | null
          client_id: string
          client_secret: string
          created_at: string | null
          enabled: boolean | null
          id: number
          provider: string
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          client_id: string
          client_secret: string
          created_at?: string | null
          enabled?: boolean | null
          id?: number
          provider: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          client_id?: string
          client_secret?: string
          created_at?: string | null
          enabled?: boolean | null
          id?: number
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          asset_id: string
          created_at: string | null
          id: string
          price: number
          status: number | null
          type: number
          user_id: string
        }
        Insert: {
          amount: number
          asset_id: string
          created_at?: string | null
          id?: string
          price: number
          status?: number | null
          type: number
          user_id: string
        }
        Update: {
          amount?: number
          asset_id?: string
          created_at?: string | null
          id?: string
          price?: number
          status?: number | null
          type?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_asset_id_fkey"
            columns: ["asset_id"]
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          id: string
          source_id: string | null
          type: number
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          id?: string
          source_id?: string | null
          type: number
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          id?: string
          source_id?: string | null
          type?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          amount: number
          asset_id: string
          cost_price: number
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount?: number
          asset_id: string
          cost_price?: number
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_id?: string
          cost_price?: number
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_asset_id_fkey"
            columns: ["asset_id"]
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          created_at: string | null
          daily_limit: number | null
          id: string
          image: string | null
          name: string
          points: number
          sort_order: number | null
          status: number | null
          stock: number | null
          token_amount: number | null
          type: number
          vip_days: number | null
        }
        Insert: {
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          image?: string | null
          name: string
          points?: number
          sort_order?: number | null
          status?: number | null
          stock?: number | null
          token_amount?: number | null
          type: number
          vip_days?: number | null
        }
        Update: {
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          image?: string | null
          name?: string
          points?: number
          sort_order?: number | null
          status?: number | null
          stock?: number | null
          token_amount?: number | null
          type?: number
          vip_days?: number | null
        }
        Relationships: []
      }
      sign_records: {
        Row: {
          created_at: string | null
          id: string
          is_makeup: boolean | null
          points_earned: number | null
          sign_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_makeup?: boolean | null
          points_earned?: number | null
          sign_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_makeup?: boolean | null
          points_earned?: number | null
          sign_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sign_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stake_pools: {
        Row: {
          base_apy: number
          created_at: string | null
          id: string
          lock_days: number
          max_stake: number | null
          name: string
          sort_order: number | null
          status: number | null
          total_staked: number | null
          vip_bonus: number | null
        }
        Insert: {
          base_apy?: number
          created_at?: string | null
          id?: string
          lock_days?: number
          max_stake?: number | null
          name: string
          sort_order?: number | null
          status?: number | null
          total_staked?: number | null
          vip_bonus?: number | null
        }
        Update: {
          base_apy?: number
          created_at?: string | null
          id?: string
          lock_days?: number
          max_stake?: number | null
          name?: string
          sort_order?: number | null
          status?: number | null
          total_staked?: number | null
          vip_bonus?: number | null
        }
        Relationships: []
      }
      stake_records: {
        Row: {
          amount: number
          auto_compound: boolean | null
          created_at: string | null
          id: string
          lock_end_time: string | null
          pending_earned: number | null
          pool_id: string
          status: number | null
          total_earned: number | null
          user_id: string
          vip_level_at_stake: number | null
        }
        Insert: {
          amount?: number
          auto_compound?: boolean | null
          created_at?: string | null
          id?: string
          lock_end_time?: string | null
          pending_earned?: number | null
          pool_id: string
          status?: number | null
          total_earned?: number | null
          user_id: string
          vip_level_at_stake?: number | null
        }
        Update: {
          amount?: number
          auto_compound?: boolean | null
          created_at?: string | null
          id?: string
          lock_end_time?: string | null
          pending_earned?: number | null
          pool_id?: string
          status?: number | null
          total_earned?: number | null
          user_id?: string
          vip_level_at_stake?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stake_records_pool_id_fkey"
            columns: ["pool_id"]
            referencedRelation: "stake_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stake_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          condition_type: string
          condition_value: Json | null
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          name: string
          reward_points: number | null
          reward_token: number | null
          sort_order: number | null
          start_time: string | null
          status: number | null
          type: number
        }
        Insert: {
          condition_type: string
          condition_value?: Json | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          name: string
          reward_points?: number | null
          reward_token?: number | null
          sort_order?: number | null
          start_time?: string | null
          status?: number | null
          type: number
        }
        Update: {
          condition_type?: string
          condition_value?: Json | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          name?: string
          reward_points?: number | null
          reward_token?: number | null
          sort_order?: number | null
          start_time?: string | null
          status?: number | null
          type?: number
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          id: string
          status: number | null
          tx_hash: string | null
          type: number
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          id?: string
          status?: number | null
          tx_hash?: string | null
          type: number
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          id?: string
          status?: number | null
          tx_hash?: string | null
          type?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          status: number | null
          target: number | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: number | null
          target?: number | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: number | null
          target?: number | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string | null
          id: string
          invite_code: string
          inviter_id: string | null
          kyc_level: number | null
          language: string | null
          nickname: string
          password_hash: string | null
          phone: string | null
          points: number | null
          status: number | null
          timezone: string | null
          token_balance: number | null
          updated_at: string | null
          vip_expire_at: string | null
          vip_level: number | null
          wallet_address: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          invite_code: string
          inviter_id?: string | null
          kyc_level?: number | null
          language?: string | null
          nickname?: string
          password_hash?: string | null
          phone?: string | null
          points?: number | null
          status?: number | null
          timezone?: string | null
          token_balance?: number | null
          updated_at?: string | null
          vip_expire_at?: string | null
          vip_level?: number | null
          wallet_address?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          invite_code?: string
          inviter_id?: string | null
          kyc_level?: number | null
          language?: string | null
          nickname?: string
          password_hash?: string | null
          phone?: string | null
          points?: number | null
          status?: number | null
          timezone?: string | null
          token_balance?: number | null
          updated_at?: string | null
          vip_expire_at?: string | null
          vip_level?: number | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_inviter_id_fkey"
            columns: ["inviter_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_records: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          drama_id: string
          episode_id: string
          has_interaction: boolean | null
          id: string
          ip_address: string | null
          is_completed: boolean | null
          user_id: string
          watch_duration: number | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          drama_id: string
          episode_id: string
          has_interaction?: boolean | null
          id?: string
          ip_address?: string | null
          is_completed?: boolean | null
          user_id: string
          watch_duration?: number | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          drama_id?: string
          episode_id?: string
          has_interaction?: boolean | null
          id?: string
          ip_address?: string | null
          is_completed?: boolean | null
          user_id?: string
          watch_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "watch_records_drama_id_fkey"
            columns: ["drama_id"]
            referencedRelation: "dramas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_records_episode_id_fkey"
            columns: ["episode_id"]
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_rdsvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      rds_float_normalize_i16: {
        Args: { "": unknown }
        Returns: unknown
      }
      rds_vector_norm: {
        Args: { "": string }
        Returns: number
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify_password: {
        Args: { password_hash: string; password: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
