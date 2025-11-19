import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  type: 'work_order_created' | 'work_order_updated' | 'work_order_completed' | 'appointment_reminder' | 'maintenance_due';
  subject: string;
  html: string;
}

export const emailTemplates: Record<string, (data: any) => EmailTemplate> = {
  work_order_created: (data) => ({
    type: 'work_order_created',
    subject: `Work Order ${data.workOrderNumber} Created - ${data.shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">${data.shopName}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Work Order Created</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hello ${data.customerName},</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
            We've received your vehicle and created work order <strong>${data.workOrderNumber}</strong> 
            for your ${data.vehicleInfo}.
          </p>
          
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Service Details:</h3>
            <p><strong>Service Type:</strong> ${data.serviceType}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Estimated Completion:</strong> ${data.estimatedCompletion}</p>
            ${data.technician ? `<p><strong>Assigned Technician:</strong> ${data.technician}</p>` : ''}
          </div>
          
          <p style="color: #475569; line-height: 1.6;">
            We'll keep you updated on the progress. You can track your service status online 
            or call us at ${data.shopPhone} with any questions.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.trackingUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Track Service Status
            </a>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">${data.shopName} • ${data.shopAddress}</p>
          <p style="margin: 5px 0 0 0;">Phone: ${data.shopPhone} • Email: ${data.shopEmail}</p>
        </div>
      </div>
    `
  }),

  work_order_completed: (data) => ({
    type: 'work_order_completed',
    subject: `Your ${data.vehicleInfo} is Ready for Pickup - ${data.shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">${data.shopName}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Service Completed ✅</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f0fdf4;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Great news, ${data.customerName}!</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Your ${data.vehicleInfo} is ready for pickup! Work order <strong>${data.workOrderNumber}</strong> 
            has been completed successfully.
          </p>
          
          <div style="background: white; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">Service Summary:</h3>
            <p><strong>Service:</strong> ${data.serviceType}</p>
            <p><strong>Completed:</strong> ${data.completedDate}</p>
            <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
            <p><strong>Warranty:</strong> 90 days / 3,000 miles</p>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Pickup Hours:</strong> Mon-Fri 8AM-6PM, Sat 8AM-4PM
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.invoiceUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              View Invoice
            </a>
            <a href="tel:${data.shopPhone}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Call Shop
            </a>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Thank you for choosing ${data.shopName}!</p>
          <p style="margin: 5px 0 0 0;">Phone: ${data.shopPhone} • Email: ${data.shopEmail}</p>
        </div>
      </div>
    `
  }),

  maintenance_due: (data) => ({
    type: 'maintenance_due',
    subject: `${data.vehicleInfo} Maintenance Due - ${data.shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ea580c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">${data.shopName}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Maintenance Reminder 🔧</p>
        </div>
        
        <div style="padding: 30px 20px; background: #fff7ed;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${data.customerName},</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Your ${data.vehicleInfo} is ${data.isOverdue ? 'overdue' : 'due'} for maintenance. 
            It's been ${data.daysSinceService} days since your last service.
          </p>
          
          <div style="background: white; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #ea580c; margin-top: 0;">Recommended Services:</h3>
            <ul style="color: #475569; margin: 10px 0;">
              <li>Oil change and filter replacement</li>
              <li>Brake inspection</li>
              <li>Fluid level check</li>
              <li>General safety inspection</li>
            </ul>
          </div>
          
          <p style="color: #475569; line-height: 1.6;">
            Regular maintenance keeps your vehicle safe, reliable, and helps prevent costly repairs. 
            Schedule your appointment today!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.scheduleUrl}" style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Schedule Service
            </a>
            <a href="tel:${data.shopPhone}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Call Now
            </a>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">${data.shopName} • ${data.shopAddress}</p>
          <p style="margin: 5px 0 0 0;">Phone: ${data.shopPhone} • Email: ${data.shopEmail}</p>
        </div>
      </div>
    `
  }),
};

export const emailService = {
  async sendEmail(to: string, template: EmailTemplate) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject: template.subject,
          html: template.html,
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }
  },

  async sendWorkOrderCreated(workOrder: any, customer: any, vehicle: any) {
    const template = emailTemplates.work_order_created({
      workOrderNumber: workOrder.work_order_number,
      customerName: `${customer.first_name} ${customer.last_name}`,
      vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      serviceType: workOrder.service_type,
      description: workOrder.description,
      estimatedCompletion: new Date(workOrder.estimated_completion).toLocaleString(),
      technician: workOrder.technician ? `${workOrder.technician.first_name} ${workOrder.technician.last_name}` : null,
      shopName: 'OverDryv Auto Shop',
      shopPhone: '(555) 123-4567',
      shopEmail: 'info@overdryv.com',
      shopAddress: '123 Main Street, Anytown, ST 12345',
      trackingUrl: `${window.location.origin}/customer/status`,
    });

    return this.sendEmail(customer.email, template);
  },

  async sendWorkOrderCompleted(workOrder: any, customer: any, vehicle: any) {
    const template = emailTemplates.work_order_completed({
      workOrderNumber: workOrder.work_order_number,
      customerName: `${customer.first_name} ${customer.last_name}`,
      vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      serviceType: workOrder.service_type,
      completedDate: new Date().toLocaleString(),
      totalAmount: workOrder.total_amount.toFixed(2),
      shopName: 'OverDryv Auto Shop',
      shopPhone: '(555) 123-4567',
      shopEmail: 'info@overdryv.com',
      invoiceUrl: `${window.location.origin}/customer/history`,
    });

    return this.sendEmail(customer.email, template);
  },

  async sendMaintenanceReminder(customer: any, vehicle: any, isOverdue: boolean = false) {
    const daysSinceService = Math.floor(
      (Date.now() - new Date(vehicle.lastService).getTime()) / (1000 * 60 * 60 * 24)
    );

    const template = emailTemplates.maintenance_due({
      customerName: customer.name,
      vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      isOverdue,
      daysSinceService,
      shopName: 'OverDryv Auto Shop',
      shopPhone: '(555) 123-4567',
      shopEmail: 'info@overdryv.com',
      shopAddress: '123 Main Street, Anytown, ST 12345',
      scheduleUrl: `${window.location.origin}/check-in`,
    });

    return this.sendEmail(customer.email, template);
  },
};