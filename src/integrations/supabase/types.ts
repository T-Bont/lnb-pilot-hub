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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          budget: number | null
          created_at: string | null
          id: string
          location: string
          name: string
          num_employees: number | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          id?: string
          location: string
          name: string
          num_employees?: number | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          num_employees?: number | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          airport_code: string
          city: string
          country: string
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          state_province: string | null
        }
        Insert: {
          airport_code: string
          city: string
          country: string
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          state_province?: string | null
        }
        Update: {
          airport_code?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          state_province?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          available_pto_hrs: number | null
          created_at: string | null
          department_id: string | null
          dob: string | null
          first_name: string
          id: string
          last_name: string
          user_id: string | null
        }
        Insert: {
          available_pto_hrs?: number | null
          created_at?: string | null
          department_id?: string | null
          dob?: string | null
          first_name: string
          id?: string
          last_name: string
          user_id?: string | null
        }
        Update: {
          available_pto_hrs?: number | null
          created_at?: string | null
          department_id?: string | null
          dob?: string | null
          first_name?: string
          id?: string
          last_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          arrival_time: string
          created_at: string | null
          departure_time: string
          destination: string
          flight_number: string
          id: string
          num_passengers: number | null
          origin: string
        }
        Insert: {
          arrival_time: string
          created_at?: string | null
          departure_time: string
          destination: string
          flight_number: string
          id?: string
          num_passengers?: number | null
          origin: string
        }
        Update: {
          arrival_time?: string
          created_at?: string | null
          departure_time?: string
          destination?: string
          flight_number?: string
          id?: string
          num_passengers?: number | null
          origin?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          reason: string | null
          request_time: string | null
          request_type: string
          shift_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
          request_time?: string | null
          request_type: string
          shift_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
          request_time?: string | null
          request_type?: string
          shift_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          location: string
          shift_date: string
          shift_end: string
          shift_start: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          location: string
          shift_date: string
          shift_end: string
          shift_start: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          location?: string
          shift_date?: string
          shift_end?: string
          shift_start?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
