import { supabase } from '../lib/supabase';

export interface CreateVehicleData {
  customer_id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  mileage?: number;
  license_plate?: string;
}

export const vehicleService = {
  async createVehicle(data: CreateVehicleData) {
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: vehicle, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCustomerVehicles(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAllVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          customer:profiles!customer_id (first_name, last_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateVehicle(vehicleId: string, updates: Partial<CreateVehicleData>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteVehicle(vehicleId: string) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getVehicleHistory(vehicleId: string) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          technician:profiles!technician_id (first_name, last_name),
          photos (*)
        `)
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};