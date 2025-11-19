import { supabase } from '../lib/supabase';

export interface CreateWorkOrderData {
  customer_id: string;
  vehicle_id: string;
  service_type: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimated_completion?: string;
  photos?: File[];
}

export const workOrderService = {
  async createWorkOrder(data: CreateWorkOrderData) {
    try {
      const { data: workOrder, error } = await supabase
        .from('work_orders')
        .insert({
          customer_id: data.customer_id,
          vehicle_id: data.vehicle_id,
          service_type: data.service_type,
          description: data.description,
          priority: data.priority,
          estimated_completion: data.estimated_completion,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Upload photos if provided
      if (data.photos && data.photos.length > 0) {
        await this.uploadWorkOrderPhotos(workOrder.id, data.photos);
      }

      return { data: workOrder, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getWorkOrders(customerId?: string, status?: string) {
    try {
      let query = supabase
        .from('work_orders')
        .select(`
          *,
          vehicles (id, make, model, year, color, license_plate, mileage),
          customer:profiles!customer_id (first_name, last_name, email, phone),
          technician:profiles!technician_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateWorkOrderStatus(workOrderId: string, status: string, technicianId?: string) {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString(),
      };

      if (technicianId) {
        updateData.technician_id = technicianId;
      }

      if (status === 'completed') {
        updateData.actual_completion = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('work_orders')
        .update(updateData)
        .eq('id', workOrderId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadWorkOrderPhotos(workOrderId: string, photos: File[]) {
    try {
      const uploadPromises = photos.map(async (photo, index) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${workOrderId}_${Date.now()}_${index}.${fileExt}`;
        const filePath = `work-orders/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        return {
          work_order_id: workOrderId,
          url: urlData.publicUrl,
          category: 'before' as const,
          description: `Uploaded photo ${index + 1}`,
        };
      });

      const photoData = await Promise.all(uploadPromises);

      const { error } = await supabase
        .from('photos')
        .insert(photoData);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getWorkOrderPhotos(workOrderId: string) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};