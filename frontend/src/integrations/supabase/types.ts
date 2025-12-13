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
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string
          sender_id: string | null
          sender_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message: string
          sender_id?: string | null
          sender_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string
          sender_id?: string | null
          sender_name?: string
          user_id?: string
        }
        Relationships: []
      }
      credits_transactions: {
        Row: {
          amount: number
          created_at: string | null
          credits: number
          description: string | null
          id: string
          payment_status: string | null
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          credits: number
          description?: string | null
          id?: string
          payment_status?: string | null
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          credits?: number
          description?: string | null
          id?: string
          payment_status?: string | null
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      endorsements: {
        Row: {
          created_at: string | null
          endorser_company: string | null
          endorser_name: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          testimonial: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          endorser_company?: string | null
          endorser_name: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          testimonial?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          endorser_company?: string | null
          endorser_name?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          testimonial?: string | null
          user_id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string | null
          enquiry_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          reference_id: string | null
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enquiry_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          sender_email?: string | null
          sender_name: string
          sender_phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          enquiry_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kyc_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_name: string
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number | null
          reply: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_name: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reply?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_name?: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reply?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          name: string
          price: number | null
          specifications: Json | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          price?: number | null
          specifications?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number | null
          specifications?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          bio: string | null
          company_logo: string | null
          completed_projects: number | null
          created_at: string | null
          id: string
          portfolio_items: Json | null
          pricing_type: string | null
          profile_photo: string | null
          rate: number | null
          skill_sets: string[] | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          company_logo?: string | null
          completed_projects?: number | null
          created_at?: string | null
          id?: string
          portfolio_items?: Json | null
          pricing_type?: string | null
          profile_photo?: string | null
          rate?: number | null
          skill_sets?: string[] | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          company_logo?: string | null
          completed_projects?: number | null
          created_at?: string | null
          id?: string
          portfolio_items?: Json | null
          pricing_type?: string | null
          profile_photo?: string | null
          rate?: number | null
          skill_sets?: string[] | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          facebook_url: string | null
          full_name: string | null
          gst_no: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          phone: string | null
          profile_image_url: string | null
          twitter_url: string | null
          updated_at: string | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          gst_no?: string | null
          id: string
          instagram_url?: string | null
          linkedin_url?: string | null
          phone?: string | null
          profile_image_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          gst_no?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          phone?: string | null
          profile_image_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          images: string[] | null
          location: string | null
          project_cost: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          project_cost?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          project_cost?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          area_sqft: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          images: string[] | null
          listing_type: string | null
          location: string | null
          price: number | null
          property_type: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          listing_type?: string | null
          location?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          listing_type?: string | null
          location?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      requirements: {
        Row: {
          created_at: string | null
          id: string
          item_description: string
          location: string | null
          quantity: number | null
          specifications: string | null
          status: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description: string
          location?: string | null
          quantity?: number | null
          specifications?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string
          location?: string | null
          quantity?: number | null
          specifications?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_config: {
        Row: {
          brand_logo: string | null
          created_at: string | null
          id: string
          show_products: boolean | null
          show_professionals: boolean | null
          show_projects: boolean | null
          show_properties: boolean | null
          theme_color: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand_logo?: string | null
          created_at?: string | null
          id?: string
          show_products?: boolean | null
          show_professionals?: boolean | null
          show_projects?: boolean | null
          show_properties?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand_logo?: string | null
          created_at?: string | null
          id?: string
          show_products?: boolean | null
          show_professionals?: boolean | null
          show_projects?: boolean | null
          show_properties?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id?: string
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
