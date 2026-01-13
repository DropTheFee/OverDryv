export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          subdomain: string;
          name: string;
          legal_name: string | null;
          subscription_plan: 'starter' | 'professional' | 'growth' | 'enterprise' | 'founder';
          monthly_price: number | null;
          user_limit: number | null;
          subscription_status: 'demo' | 'onboarding' | 'active' | 'past_due' | 'suspended' | 'cancelled';
          onboarding_completed_at: string | null;
          subscription_starts_at: string | null;
          first_billing_date: string | null;
          next_billing_date: string | null;
          is_founder: boolean;
          current_user_count: number;
          current_customer_count: number;
          current_work_orders_total: number;
          current_storage_bytes: number;
          addon_quickbooks_async: boolean;
          addon_partstech: boolean;
          addon_digits_ai: 'basic' | 'professional' | 'enterprise' | null;
          addon_honkamp_payroll: boolean;
          billing_email: string;
          payment_gateway: string;
          dejavoo_merchant_id: string | null;
          phone: string | null;
          address: Record<string, any> | null;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          subdomain: string;
          name: string;
          legal_name?: string | null;
          subscription_plan?: 'starter' | 'professional' | 'growth' | 'enterprise' | 'founder';
          monthly_price?: number | null;
          user_limit?: number | null;
          subscription_status?: 'demo' | 'onboarding' | 'active' | 'past_due' | 'suspended' | 'cancelled';
          onboarding_completed_at?: string | null;
          subscription_starts_at?: string | null;
          first_billing_date?: string | null;
          next_billing_date?: string | null;
          is_founder?: boolean;
          current_user_count?: number;
          current_customer_count?: number;
          current_work_orders_total?: number;
          current_storage_bytes?: number;
          addon_quickbooks_async?: boolean;
          addon_partstech?: boolean;
          addon_digits_ai?: 'basic' | 'professional' | 'enterprise' | null;
          addon_honkamp_payroll?: boolean;
          billing_email: string;
          payment_gateway?: string;
          dejavoo_merchant_id?: string | null;
          phone?: string | null;
          address?: Record<string, any> | null;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          subdomain?: string;
          name?: string;
          legal_name?: string | null;
          subscription_plan?: 'starter' | 'professional' | 'growth' | 'enterprise' | 'founder';
          monthly_price?: number | null;
          user_limit?: number | null;
          subscription_status?: 'demo' | 'onboarding' | 'active' | 'past_due' | 'suspended' | 'cancelled';
          onboarding_completed_at?: string | null;
          subscription_starts_at?: string | null;
          first_billing_date?: string | null;
          next_billing_date?: string | null;
          is_founder?: boolean;
          current_user_count?: number;
          current_customer_count?: number;
          current_work_orders_total?: number;
          current_storage_bytes?: number;
          addon_quickbooks_async?: boolean;
          addon_partstech?: boolean;
          addon_digits_ai?: 'basic' | 'professional' | 'enterprise' | null;
          addon_honkamp_payroll?: boolean;
          billing_email?: string;
          payment_gateway?: string;
          dejavoo_merchant_id?: string | null;
          phone?: string | null;
          address?: Record<string, any> | null;
          settings?: Record<string, any>;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      organization_features: {
        Row: {
          id: string;
          organization_id: string;
          feature_key: string;
          enabled: boolean;
          config: Record<string, any>;
          enabled_at: string | null;
          disabled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          feature_key: string;
          enabled?: boolean;
          config?: Record<string, any>;
          enabled_at?: string | null;
          disabled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          feature_key?: string;
          enabled?: boolean;
          config?: Record<string, any>;
          enabled_at?: string | null;
          disabled_at?: string | null;
          updated_at?: string;
        };
      };
      organization_integrations: {
        Row: {
          id: string;
          organization_id: string;
          integration_key: string;
          enabled: boolean;
          credentials: Record<string, any> | null;
          config: Record<string, any>;
          status: 'active' | 'error' | 'disabled' | 'testing';
          last_synced_at: string | null;
          last_error: string | null;
          error_count: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          integration_key: string;
          enabled?: boolean;
          credentials?: Record<string, any> | null;
          config?: Record<string, any>;
          status?: 'active' | 'error' | 'disabled' | 'testing';
          last_synced_at?: string | null;
          last_error?: string | null;
          error_count?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          integration_key?: string;
          enabled?: boolean;
          credentials?: Record<string, any> | null;
          config?: Record<string, any>;
          status?: 'active' | 'error' | 'disabled' | 'testing';
          last_synced_at?: string | null;
          last_error?: string | null;
          error_count?: number;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      feature_audit_log: {
        Row: {
          id: string;
          organization_id: string;
          feature_key: string | null;
          integration_key: string | null;
          action: 'enabled' | 'disabled' | 'configured' | 'upgraded' | 'downgraded' | 'tested';
          changed_by: string | null;
          changed_by_name: string | null;
          previous_value: Record<string, any> | null;
          new_value: Record<string, any> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          feature_key?: string | null;
          integration_key?: string | null;
          action: 'enabled' | 'disabled' | 'configured' | 'upgraded' | 'downgraded' | 'tested';
          changed_by?: string | null;
          changed_by_name?: string | null;
          previous_value?: Record<string, any> | null;
          new_value?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          feature_key?: string | null;
          integration_key?: string | null;
          action?: 'enabled' | 'disabled' | 'configured' | 'upgraded' | 'downgraded' | 'tested';
          changed_by?: string | null;
          changed_by_name?: string | null;
          previous_value?: Record<string, any> | null;
          new_value?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      subscription_history: {
        Row: {
          id: string;
          organization_id: string;
          previous_plan: string | null;
          new_plan: string;
          action: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'reactivated' | 'demo_completed' | 'onboarding_started' | 'onboarding_completed' | 'expired' | 'founder_activated';
          previous_amount: number | null;
          new_amount: number | null;
          effective_date: string;
          notes: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          previous_plan?: string | null;
          new_plan: string;
          action: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'reactivated' | 'demo_completed' | 'onboarding_started' | 'onboarding_completed' | 'expired' | 'founder_activated';
          previous_amount?: number | null;
          new_amount?: number | null;
          effective_date?: string;
          notes?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          previous_plan?: string | null;
          new_plan?: string;
          action?: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'reactivated' | 'demo_completed' | 'onboarding_started' | 'onboarding_completed' | 'expired' | 'founder_activated';
          previous_amount?: number | null;
          new_amount?: number | null;
          effective_date?: string;
          notes?: string | null;
          changed_by?: string | null;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          organization_id: string;
          metric: string;
          value: number;
          period: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          metric: string;
          value: number;
          period: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          metric?: string;
          value?: number;
          period?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          role: 'customer' | 'admin' | 'technician' | 'master_admin';
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          role?: 'customer' | 'admin' | 'technician' | 'master_admin';
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          role?: 'customer' | 'admin' | 'technician' | 'master_admin';
          organization_id?: string | null;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          customer_id: string;
          vin: string;
          make: string;
          model: string;
          year: number;
          color: string;
          mileage: number;
          license_plate: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          vin: string;
          make: string;
          model: string;
          year: number;
          color?: string;
          mileage?: number;
          license_plate?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          vin?: string;
          make?: string;
          model?: string;
          year?: number;
          color?: string;
          mileage?: number;
          license_plate?: string;
          updated_at?: string;
        };
      };
      work_orders: {
        Row: {
          id: string;
          customer_id: string;
          vehicle_id: string;
          status: 'estimate' | 'pending' | 'approved' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up' | 'declined';
          service_type: string;
          description: string;
          estimated_completion: string;
          actual_completion: string | null;
          technician_id: string | null;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          vehicle_id: string;
          status?: 'estimate' | 'pending' | 'approved' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up' | 'declined';
          service_type: string;
          description: string;
          estimated_completion: string;
          actual_completion?: string | null;
          technician_id?: string | null;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          vehicle_id?: string;
          status?: 'estimate' | 'pending' | 'approved' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up' | 'declined';
          service_type?: string;
          description?: string;
          estimated_completion?: string;
          actual_completion?: string | null;
          technician_id?: string | null;
          total_amount?: number;
          updated_at?: string;
        };
      };
      estimates: {
        Row: {
          id: string;
          customer_id: string;
          vehicle_id: string;
          estimate_number: string;
          description: string;
          status: 'draft' | 'sent' | 'approved' | 'declined' | 'expired';
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total_amount: number;
          valid_until: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          vehicle_id: string;
          estimate_number: string;
          description?: string;
          status?: 'draft' | 'sent' | 'approved' | 'declined' | 'expired';
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount?: number;
          valid_until?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          vehicle_id?: string;
          estimate_number?: string;
          description?: string;
          status?: 'draft' | 'sent' | 'approved' | 'declined' | 'expired';
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount?: number;
          valid_until?: string;
          notes?: string | null;
          updated_at?: string;
        };
      };
      service_items: {
        Row: {
          id: string;
          estimate_id: string | null;
          work_order_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estimate_id?: string | null;
          work_order_id?: string | null;
          description: string;
          quantity?: number;
          unit_price: number;
          total_price: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estimate_id?: string | null;
          work_order_id?: string | null;
          description?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          category?: string | null;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          work_order_id: string;
          invoice_number: string;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total_amount: number;
          payment_method: 'cash' | 'card' | 'check' | 'other' | null;
          paid: boolean;
          paid_at: string | null;
          due_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_order_id: string;
          invoice_number: string;
          subtotal: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount: number;
          payment_method?: 'cash' | 'card' | 'check' | 'other' | null;
          paid?: boolean;
          paid_at?: string | null;
          due_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_order_id?: string;
          invoice_number?: string;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount?: number;
          payment_method?: 'cash' | 'card' | 'check' | 'other' | null;
          paid?: boolean;
          paid_at?: string | null;
          due_date?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      shop_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          work_order_id: string;
          url: string;
          category: 'before' | 'during' | 'after' | 'damage';
          description: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_order_id: string;
          url: string;
          category: 'before' | 'during' | 'after' | 'damage';
          description?: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          work_order_id?: string;
          url?: string;
          category?: 'before' | 'during' | 'after' | 'damage';
          description?: string;
          uploaded_by?: string;
        };
      };
      waivers: {
        Row: {
          id: string;
          customer_id: string;
          work_order_id: string;
          signature_data: string;
          ip_address: string;
          signed_at: string;
          waiver_text: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          work_order_id: string;
          signature_data: string;
          ip_address: string;
          signed_at?: string;
          waiver_text: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          work_order_id?: string;
          signature_data?: string;
          ip_address?: string;
          waiver_text?: string;
        };
      };
    };
  };
}