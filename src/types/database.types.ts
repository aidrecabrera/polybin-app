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
      alert_log: {
        Row: {
          bin_type: string | null
          created_at: string
          id: number
        }
        Insert: {
          bin_type?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          bin_type?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      bin_levels: {
        Row: {
          created_at: string
          id: number
          SENSOR_1: number
          SENSOR_2: number
          SENSOR_3: number
          SENSOR_4: number
        }
        Insert: {
          created_at?: string
          id?: number
          SENSOR_1: number
          SENSOR_2: number
          SENSOR_3: number
          SENSOR_4: number
        }
        Update: {
          created_at?: string
          id?: number
          SENSOR_1?: number
          SENSOR_2?: number
          SENSOR_3?: number
          SENSOR_4?: number
        }
        Relationships: []
      }
      dispose_log: {
        Row: {
          bin_type: string
          created_at: string
          id: number
        }
        Insert: {
          bin_type: string
          created_at?: string
          id?: number
        }
        Update: {
          bin_type?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      prediction_log: {
        Row: {
          class: string
          class_id: number
          confidence: number
          created_at: string
          detection_id: string
          height: number
          prediction_id: number
          width: number
          x: number
          y: number
        }
        Insert: {
          class: string
          class_id: number
          confidence: number
          created_at?: string
          detection_id: string
          height: number
          prediction_id?: never
          width: number
          x: number
          y: number
        }
        Update: {
          class?: string
          class_id?: number
          confidence?: number
          created_at?: string
          detection_id?: string
          height?: number
          prediction_id?: never
          width?: number
          x?: number
          y?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never