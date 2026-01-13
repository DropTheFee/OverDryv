import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Calculator,
  Send,
  Download,
  Eye,
  Plus,
  Trash2,
  Printer
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceGeneratorProps {
  workOrderId?: string;
  workOrderData?: any;
  existingInvoice?: any;
  onClose?: () => void;
  onInvoiceSaved?: (invoiceData: any) => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ 
  workOrderId, 
  workOrderData, 
  existingInvoice,
  onClose,
  onInvoiceSaved 
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<'draft' | 'finalized' | 'sent'>('draft');
  const [invoice, setInvoice] = useState({
    invoiceNumber: existingInvoice?.invoiceNumber || `INV-${Date.now()}`,
    workOrderNumber: workOrderData?.work_order_number || 'WO-001',
    customerName: workOrderData?.customer ? `${workOrderData.customer.first_name} ${workOrderData.customer.last_name}` : 'John Smith',
    customerEmail: workOrderData?.customer?.email || 'john.smith@email.com',
    customerPhone: workOrderData?.customer?.phone || '(555) 123-4567',
    vehicleInfo: workOrderData?.vehicle ? `${workOrderData.vehicle.year} ${workOrderData.vehicle.make} ${workOrderData.vehicle.model}` : '2022 Toyota Camry',
    items: existingInvoice?.items || [
      {
        id: '1',
        description: workOrderData?.service_type || 'Oil Change Service',
        quantity: 1,
        unitPrice: workOrderData?.total_amount || 45.99,
        total: workOrderData?.total_amount || 45.99
      }
    ] as InvoiceItem[],
    subtotal: existingInvoice?.subtotal || workOrderData?.total_amount || 75.98,
    taxRate: 8.25,
    taxAmount: existingInvoice?.taxAmount || (workOrderData?.total_amount || 75.98) * 0.0825,
    total: existingInvoice?.total || (workOrderData?.total_amount || 75.98) * 1.0825,
    createdAt: existingInvoice?.createdAt || new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  useEffect(() => {
    if (existingInvoice) {
      setInvoiceStatus(existingInvoice.status || 'draft');
    }
  }, [existingInvoice]);

  // Dual Pricing Settings (would come from admin settings)
  const dualPricingSettings = {
    enabled: true,
    cardProcessingFee: 3.5,
    programLabel: 'Dual Pricing Program'
  };

  const calculateDualPricing = (amount: number) => {
    if (!dualPricingSettings.enabled) return { cash: amount, card: amount };
    
    // Cash price is the base price
    const cashPrice = amount;
    // Card price adds the processing fee to the cash price
    const cardPrice = amount * (1 + dualPricingSettings.cardProcessingFee / 100);
    
    return {
      cash: Math.round(cashPrice * 100) / 100,
      card: Math.round(cardPrice * 100) / 100
    };
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem]
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });

    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = invoice.items.filter(item => item.id !== id);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100
    });
  };

  const dualPricing = calculateDualPricing(invoice.total);

  // Generate complete invoice HTML for printing/PDF
  const generateInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            @page { 
              size: 8.5in 11in; 
              margin: 0.5in; 
            }
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: 'Arial', sans-serif; 
              font-size: 12px; 
              line-height: 1.4; 
              color: #000; 
              background: white;
              width: 7.5in;
              min-height: 10in;
            }
            .invoice-container {
              width: 100%;
              max-width: 7.5in;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            .invoice-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start;
              margin-bottom: 30px; 
              padding-bottom: 20px; 
              border-bottom: 3px solid #2563eb; 
            }
            .company-logo {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-icon {
              width: 40px;
              height: 40px;
              background: #2563eb;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
            }
            .company-info h1 { 
              font-size: 32px; 
              margin-bottom: 5px; 
              color: #1e293b;
              font-weight: bold;
            }
            .company-info h2 {
              font-size: 18px;
              color: #475569;
              margin-bottom: 10px;
            }
            .company-info p { 
              margin: 2px 0; 
              color: #374151; 
              font-size: 11px;
            }
            .invoice-details { 
              text-align: right; 
              background: #f1f5f9;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #cbd5e1;
            }
            .invoice-details h3 {
              font-size: 24px;
              color: #334155;
              margin-bottom: 10px;
            }
            .invoice-details p { 
              margin: 5px 0; 
              font-size: 11px;
            }
            .invoice-details .detail-label {
              font-weight: bold;
              color: #374151;
            }
            .customer-section { 
              display: flex; 
              justify-content: space-between; 
              margin: 30px 0; 
              gap: 40px;
            }
            .customer-info {
              flex: 1;
            }
            .customer-info h3 { 
              font-size: 14px; 
              margin-bottom: 10px; 
              color: #334155;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .customer-info p { 
              margin: 4px 0; 
              font-size: 11px;
            }
            .customer-name {
              font-weight: bold !important;
              font-size: 13px !important;
              color: #111827 !important;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 25px 0; 
              border: 1px solid #d1d5db;
            }
            .items-table th, .items-table td { 
              border: 1px solid #d1d5db; 
              padding: 12px 8px; 
              text-align: left; 
              font-size: 11px;
            }
            .items-table th { 
              background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
              color: white;
              font-weight: bold; 
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .items-table tbody tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .items-table tbody tr:hover {
              background-color: #f3f4f6;
            }
            .text-right { text-align: right !important; }
            .text-center { text-align: center !important; }
            .totals-section { 
              margin-top: 30px; 
              display: flex; 
              justify-content: flex-end; 
            }
            .pricing-container {
              ${dualPricingSettings.enabled ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 500px;' : 'width: 300px;'}
            }
            .pricing-box { 
              border: 2px solid #e5e7eb; 
              padding: 20px; 
              border-radius: 8px;
              background: white;
            }
            .pricing-box.cash-pricing {
              border-color: #334155;
              background: #f8fafc;
            }
            .pricing-box.card-pricing {
              border-color: #0d9488;
              background: #f0fdfa;
            }
            .pricing-box h4 { 
              margin-bottom: 15px; 
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .cash-pricing h4 { color: #059669; }
            .cash-pricing h4 { color: #334155; }
            .card-pricing h4 { color: #0d9488; }
            .pricing-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0; 
              font-size: 11px;
            }
            .total-row { 
              border-top: 2px solid #374151; 
              padding-top: 10px; 
              margin-top: 10px; 
              font-weight: bold; 
              font-size: 16px;
            }
            .cash-pricing .total-row { border-top-color: #10b981; }
            .cash-pricing .total-row { border-top-color: #334155; }
            .card-pricing .total-row { border-top-color: #0d9488; }
            .card-price { color: #0d9488 !important; font-weight: 600; }
            .footer-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              font-size: 10px;
              color: #6b7280;
            }
            .terms-section {
              margin-bottom: 20px;
            }
            .terms-section h4 {
              font-size: 12px;
              font-weight: bold;
              color: #374151;
              margin-bottom: 8px;
            }
            .terms-list {
              list-style: none;
              padding-left: 0;
            }
            .terms-list li {
              margin: 4px 0;
              padding-left: 15px;
              position: relative;
            }
            .terms-list li:before {
              content: "•";
              color: #2563eb;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .warranty-section {
              background: #ecfdf5;
              padding: 15px;
              border-radius: 6px;
              border-left: 4px solid #059669;
            }
            .warranty-section h4 {
              color: #10b981;
              font-size: 12px;
              margin-bottom: 8px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="company-info">
                <div class="company-logo">
                  <div class="logo-icon" style="background: #334155;">OD</div>
                  <div>
                    <h2 style="color: #334155;">OverDryv Auto Shop</h2>
                  </div>
                </div>
                <p><strong>123 Main Street</strong></p>
                <p>Anytown, ST 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@overdryv.com</p>
                <p>License #: ASE-12345</p>
              </div>
              <div class="invoice-details">
                <h3>INVOICE</h3>
                <p><span class="detail-label">Invoice #:</span> ${invoice.invoiceNumber}</p>
                <p><span class="detail-label">Work Order #:</span> ${invoice.workOrderNumber}</p>
                <p><span class="detail-label">Date:</span> ${new Date().toLocaleDateString()}</p>
                <p><span class="detail-label">Due Date:</span> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
              </div>
            </div>
            
            <!-- Customer Information -->
            <div class="customer-section">
              <div class="customer-info">
                <h3>Bill To:</h3>
                <p class="customer-name">${invoice.customerName}</p>
                <p>${invoice.customerEmail}</p>
                <p>${invoice.customerPhone}</p>
              </div>
              <div class="customer-info">
                <h3>Vehicle Information:</h3>
                <p class="customer-name">${invoice.vehicleInfo}</p>
                <p>Service Date: ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 35%;">Description</th>
                  <th class="text-center" style="width: 8%;">Qty</th>
                  <th class="text-right" style="width: 12%;">Cash Price</th>
                  <th class="text-right" style="width: 14%;">Cash Total</th>
                  <th class="text-right" style="width: 12%;" class="card-price">Card Price</th>
                  <th class="text-right" style="width: 14%;" class="card-price">Card Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => {
                  const cashTotal = item.quantity * item.unitPrice;
                  const cardUnitPrice = item.unitPrice * 1.035;
                  const cardTotal = cashTotal * 1.035;
                  return `
                    <tr>
                      <td><strong>${item.description}</strong></td>
                      <td class="text-center">${item.quantity}</td>
                      <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                      <td class="text-right"><strong>$${cashTotal.toFixed(2)}</strong></td>
                      <td class="text-right card-price">$${cardUnitPrice.toFixed(2)}</td>
                      <td class="text-right card-price"><strong>$${cardTotal.toFixed(2)}</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div class="totals-section">
              <div class="pricing-container">
                ${dualPricingSettings.enabled ? `
                  <div class="pricing-box cash-pricing">
                    <h4>Cash Pricing</h4>
                    <div class="pricing-row">
                      <span>Subtotal:</span>
                      <span><strong>$${invoice.subtotal.toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row">
                      <span>Tax (${invoice.taxRate}%):</span>
                      <span><strong>$${invoice.taxAmount.toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row total-row">
                      <span>CASH TOTAL:</span>
                      <span><strong>$${dualPricing.cash.toFixed(2)}</strong></span>
                    </div>
                  </div>
                  <div class="pricing-box card-pricing">
                    <h4>Card Pricing</h4>
                    <div class="pricing-row">
                      <span>Subtotal:</span>
                      <span class="card-price"><strong>$${(invoice.subtotal * (1 + dualPricingSettings.cardProcessingFee / 100)).toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row">
                      <span>Tax (${invoice.taxRate}%):</span>
                      <span class="card-price"><strong>$${(invoice.taxAmount * (1 + dualPricingSettings.cardProcessingFee / 100)).toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row total-row">
                      <span>CARD TOTAL:</span>
                      <span class="card-price"><strong>$${dualPricing.card.toFixed(2)}</strong></span>
                    </div>
                  </div>
                ` : `
                  <div class="pricing-box">
                    <div class="pricing-row">
                      <span>Subtotal:</span>
                      <span><strong>$${invoice.subtotal.toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row">
                      <span>Tax (${invoice.taxRate}%):</span>
                      <span><strong>$${invoice.taxAmount.toFixed(2)}</strong></span>
                    </div>
                    <div class="pricing-row total-row">
                      <span>TOTAL:</span>
                      <span><strong>$${invoice.total.toFixed(2)}</strong></span>
                    </div>
                  </div>
                `}
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-section">
              <div class="terms-section">
                <h4>Terms & Conditions:</h4>
                <ul class="terms-list">
                  <li>Payment is due within 30 days of invoice date</li>
                  <li>All work performed is guaranteed for 90 days or 3,000 miles, whichever comes first</li>
                  <li>Customer is responsible for any additional repairs discovered during service</li>
                  <li>Shop is not responsible for items left in vehicle</li>
                  <li>Late payments subject to 1.5% monthly service charge</li>
                </ul>
              </div>
              
              <div class="warranty-section">
                <h4>🛡️ Service Warranty</h4>
                <p>This service is backed by our comprehensive 90-day/3,000-mile warranty. If you experience any issues related to the work performed, please contact us immediately. Warranty covers parts and labor for the specific services listed above.</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #d1d5db;">
                <p><strong>Thank you for choosing OverDryv Auto Shop!</strong></p>
                <p>Questions? Call us at (555) 123-4567 or email info@overdryv.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };


  const handleViewPreview = () => {
    const invoiceHTML = generateInvoiceHTML().replace(
      '<script>',
      '<script>/* Remove auto-print for preview */'
    ).replace(
      'window.print();',
      '// Preview only - no auto print'
    );

    // Create a blob and open it - bypasses popup blockers!
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePrintPreview = () => {
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        @page {
            size: 8.5in 11in;
            margin: 0.5in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
        }
        
        .invoice {
            width: 100%;
            max-width: 7.5in;
        }
        
        /* Header */
        .header {
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .shop-info {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background-color: #0d9488;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .company-details {
            text-align: left;
        }
        
        .shop-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #0f766e;
        }
        
        .shop-details {
            font-size: 11px;
            line-height: 1.3;
        }
        
        .invoice-title {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
        }
        
        /* Invoice Info */
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        
        .customer-info, .invoice-details {
            width: 45%;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 5px;
            border-bottom: 1px solid #ccc;
        }
        
        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .items-table th,
        .items-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }
        
        .items-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        
        .items-table .qty,
        .items-table .price,
        .items-table .total {
            text-align: right;
            width: 12%;
        }
        
        .items-table .description {
            width: 52%;
        }
        
        /* Totals */
        .totals {
            width: 300px;
            margin-left: auto;
            border: 2px solid #059669;
            padding: 15px;
        }
        
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
        }
        
        .total-line.grand-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 2px solid #059669;
            padding-top: 8px;
            margin-top: 8px;
        }
        
        /* Payment Terms */
        .payment-terms {
            margin-top: 30px;
            font-size: 10px;
            border-top: 1px solid #ccc;
            padding-top: 15px;
        }
        
        .terms-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .signature-line {
            margin-top: 40px;
            border-bottom: 1px solid #000;
            width: 300px;
            padding-bottom: 5px;
        }
        
        @media print {
            body { 
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <!-- Header -->
        <div class="header">
            <div class="shop-info">
                <div class="logo">OD</div>
                <div class="company-details">
                    <div class="shop-name">OVERDRYV AUTO SHOP</div>
                    <div class="shop-details">
                        123 Main Street<br>
                        Anytown, ST 12345<br>
                        Phone: (555) 123-4567<br>
                        Email: info@overdryv.com<br>
                        ASE Certified • License #12345
                    </div>
                </div>
            </div>
            <div class="invoice-title">INVOICE</div>
        </div>

        <!-- Invoice Information -->
        <div class="invoice-info">
            <div class="customer-info">
                <div class="section-title">Bill To:</div>
                <div><strong>${invoice.customerName}</strong></div>
                <div>${invoice.customerEmail}</div>
                <div>${invoice.customerPhone}</div>
                <br>
                <div class="section-title">Vehicle:</div>
                <div><strong>${invoice.vehicleInfo}</strong></div>
                <div>Service Date: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="invoice-details">
                <div class="section-title">Invoice Details:</div>
                <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
                <div><strong>Work Order #:</strong> ${invoice.workOrderNumber}</div>
                <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
                <div><strong>Due Date:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</div>
            </div>
        </div>

        <!-- Service Items -->
        <table class="items-table">
            <thead>
                <tr>
                    <th class="description">SERVICE DESCRIPTION</th>
                    <th class="qty">QTY</th>
                    <th class="price">UNIT PRICE</th>
                    <th class="total">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                <tr>
                    <td><strong>${item.description}</strong></td>
                    <td style="text-align: right;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                    <td style="text-align: right;"><strong>$${item.total.toFixed(2)}</strong></td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Totals Section -->
        <div class="totals">
            <div class="total-line">
                <span>Subtotal:</span>
                <span>$${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-line">
                <span>Tax (${invoice.taxRate}%):</span>
                <span>$${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div class="total-line grand-total">
                <span>TOTAL DUE:</span>
                <span>$${invoice.total.toFixed(2)}</span>
            </div>
        </div>

        <!-- Payment Terms -->
        <div class="payment-terms">
            <div class="terms-title">TERMS & CONDITIONS:</div>
            <div>• Payment due within 30 days of invoice date</div>
            <div>• All work guaranteed for 90 days or 3,000 miles</div>
            <div>• Customer responsible for additional repairs discovered during service</div>
            <div>• Late payments subject to 1.5% monthly service charge</div>
            <div>• Shop not responsible for items left in vehicle</div>
            
            <div style="margin-top: 20px;">
                <strong>Customer Signature:</strong>
                <div class="signature-line"></div>
                <small>I authorize the above repair work to be done and agree to pay the amount shown.</small>
            </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 10px;">
            <strong>Thank you for your business!</strong><br>
            Questions? Call (555) 123-4567
        </div>
    </div>

    <script>
        // Auto-print when opened
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>`;

    // Create a blob and open it - bypasses popup blockers!
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Import jsPDF and html2canvas
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      // Create a temporary div with the invoice content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generateInvoiceHTML();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '8.5in';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert to canvas
      const canvas = await html2canvas.default(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 816, // 8.5 inches at 96 DPI
        height: 1056 // 11 inches at 96 DPI
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'letter');
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 612, 792); // Letter size in points
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Save PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try the print preview option instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveDraft = () => {
    const invoiceData = {
      ...invoice,
      status: 'draft',
      lastModified: new Date().toISOString()
    };
    
    // Save to localStorage for demo (in production, save to database)
    localStorage.setItem(`invoice_${workOrderId}`, JSON.stringify(invoiceData));
    setInvoiceStatus('draft');
    onInvoiceSaved?.(invoiceData);
    
    alert('Invoice draft saved successfully!');
  };

  const handleFinalizeInvoice = () => {
    if (invoiceStatus === 'finalized') {
      alert('This invoice has already been finalized. No further changes can be made.');
      return;
    }
    
    const finalizedInvoice = {
      ...invoice,
      status: 'finalized',
      finalizedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    localStorage.setItem(`invoice_${workOrderId}`, JSON.stringify(finalizedInvoice));
    setInvoiceStatus('finalized');
    onInvoiceSaved?.(finalizedInvoice);
    
    // Auto-close the work order when invoice is finalized
    if (workOrderData?.id) {
      // In production, this would update the work order status in the database
      const updatedWorkOrder = {
        ...workOrderData,
        status: 'completed',
        actual_completion: new Date().toISOString()
      };
      
      // Save updated work order status
      localStorage.setItem(`work_order_${workOrderData.id}`, JSON.stringify(updatedWorkOrder));
      
      console.log('Work order automatically closed:', updatedWorkOrder);
    }
    
    alert('Invoice finalized and work order completed! No further changes can be made to this invoice.');
  };

  const handleSendInvoice = () => {
    if (invoiceStatus !== 'finalized') {
      alert('Please finalize the invoice before sending.');
      return;
    }
    
    const sentInvoice = {
      ...invoice,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    
    localStorage.setItem(`invoice_${workOrderId}`, JSON.stringify(sentInvoice));
    setInvoiceStatus('sent');
    onInvoiceSaved?.(sentInvoice);
    
    alert(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerEmail}!`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {existingInvoice ? 'Edit Invoice' : 'Generate Invoice'}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                invoiceStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                invoiceStatus === 'finalized' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {invoiceStatus.toUpperCase()}
              </span>
              {existingInvoice && (
                <span className="text-sm text-gray-500">
                  Created: {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePrintPreview}
            className="text-gray-600 hover:text-gray-800 p-2"
            title="Print Preview"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button 
            onClick={handleViewPreview}
            className="text-gray-600 hover:text-gray-800 p-2"
            title="View Invoice"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="text-gray-600 hover:text-gray-800 p-2 disabled:opacity-50"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 p-2">
              ×
            </button>
          )}
        </div>
      </div>

      {invoiceStatus === 'finalized' && (
        <div className="bg-blue-50 border border-blue-200 p-4 mx-6">
          <p className="text-blue-800 text-sm font-medium">
            ⚠️ This invoice has been finalized. To make changes, you would need to create a credit memo or adjustment.
          </p>
        </div>
      )}

      <div id="invoice-content" className="p-6 space-y-6">
        {/* Invoice Header */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div>
              <p className="font-medium">{invoice.customerName}</p>
              <p>{invoice.customerEmail}</p>
              <p>{invoice.customerPhone}</p>
              <p className="text-sm text-gray-500">Vehicle: {invoice.vehicleInfo}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Invoice #: </span>
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Work Order #: </span>
                <span className="font-medium">{invoice.workOrderNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Date: </span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Qty</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Cash Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-green-700">Cash Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-700 bg-blue-50">Card Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-700 bg-blue-50">Card Total</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map(item => {
                const cashTotal = item.quantity * item.unitPrice;
                const cardUnitPrice = item.unitPrice * 1.035;
                const cardTotal = cashTotal * 1.035;
                
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className={`w-full border-0 focus:ring-0 focus:outline-none ${
                          invoiceStatus === 'finalized' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        disabled={invoiceStatus === 'finalized'}
                        placeholder="Service or part description"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className={`w-16 text-center border-0 focus:ring-0 focus:outline-none ${
                        invoiceStatus === 'finalized' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={invoiceStatus === 'finalized'}
                      min="0"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={`w-20 text-right border-0 focus:ring-0 focus:outline-none ${
                        invoiceStatus === 'finalized' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={invoiceStatus === 'finalized'}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-700">
                    ${item.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right bg-blue-50 font-medium text-blue-700">
                    ${(item.unitPrice * 1.035).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right bg-blue-50 font-medium text-blue-700">
                    ${(item.total * 1.035).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={invoiceStatus === 'finalized'}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={addItem}
              disabled={invoiceStatus === 'finalized'}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>
        </div>

        {/* Invoice Totals */}
        <div className="flex justify-end">
          <div className="w-80">
            {dualPricingSettings.enabled ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-right">
                  <h4 className="font-semibold text-gray-900">Cash Pricing</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Cash Total:</span>
                      <span>${dualPricing.cash.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <h4 className="font-semibold text-blue-900">Card Pricing</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-blue-600">${(invoice.subtotal * (1 + dualPricingSettings.cardProcessingFee / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium text-blue-600">${(invoice.taxAmount * (1 + dualPricingSettings.cardProcessingFee / 100)).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Card Total:</span>
                      <span className="text-blue-600">${dualPricing.card.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 no-print">
          <button 
            onClick={handleSaveDraft}
            disabled={invoiceStatus === 'finalized'}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={handleFinalizeInvoice}
            disabled={invoiceStatus === 'finalized'}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            Finalize Invoice
          </button>
          <button 
            onClick={handleSendInvoice}
            disabled={invoiceStatus !== 'finalized'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;