export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          role: 'customer' | 'admin' | 'technician';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          role?: 'customer' | 'admin' | 'technician';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          role?: 'customer' | 'admin' | 'technician';
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
          status: 'pending' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up';
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
          status?: 'pending' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up';
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
          status?: 'pending' | 'in_progress' | 'quality_check' | 'completed' | 'picked_up';
          service_type?: string;
          description?: string;
          estimated_completion?: string;
          actual_completion?: string | null;
          technician_id?: string | null;
          total_amount?: number;
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