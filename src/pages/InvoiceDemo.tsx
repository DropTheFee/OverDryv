import React from 'react';
import { Printer, Download } from 'lucide-react';

const InvoiceDemo: React.FC = () => {
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Automotive Invoice</title>
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
                  background-color: #2563eb;
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
                  color: #2563eb;
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
                  border: 2px solid #000;
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
                  border-top: 2px solid #000;
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
                      <div><strong>John Smith</strong></div>
                      <div>john.smith@email.com</div>
                      <div>(555) 123-4567</div>
                      <br>
                      <div class="section-title">Vehicle:</div>
                      <div><strong>2022 Toyota Camry</strong></div>
                      <div>VIN: 1234567890</div>
                      <div>Mileage: 25,000</div>
                  </div>
                  
                  <div class="invoice-details">
                      <div class="section-title">Invoice Details:</div>
                      <div><strong>Invoice #:</strong> INV-12345</div>
                      <div><strong>Work Order #:</strong> WO-001</div>
                      <div><strong>Date:</strong> January 15, 2025</div>
                      <div><strong>Due Date:</strong> February 14, 2025</div>
                      <br>
                      <div class="section-title">Service Advisor:</div>
                      <div>Mike Johnson</div>
                      <div>Ext: 101</div>
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
                      <tr>
                          <td><strong>Oil Change Service</strong><br>
                              <small>Includes: 5W-30 synthetic oil, oil filter, fluid check</small>
                          </td>
                          <td style="text-align: right;">1</td>
                          <td style="text-align: right;">$45.99</td>
                          <td style="text-align: right;"><strong>$45.99</strong></td>
                      </tr>
                      <tr>
                          <td><strong>Brake Inspection</strong><br>
                              <small>Visual inspection of brake pads and rotors</small>
                          </td>
                          <td style="text-align: right;">1</td>
                          <td style="text-align: right;">$29.99</td>
                          <td style="text-align: right;"><strong>$29.99</strong></td>
                      </tr>
                      <tr>
                          <td><strong>Cabin Air Filter Replacement</strong><br>
                              <small>Premium HEPA filter installation</small>
                          </td>
                          <td style="text-align: right;">1</td>
                          <td style="text-align: right;">$35.00</td>
                          <td style="text-align: right;"><strong>$35.00</strong></td>
                      </tr>
                  </tbody>
              </table>

              <!-- Totals Section -->
              <div class="totals">
                  <div class="total-line">
                      <span>Subtotal:</span>
                      <span>$110.98</span>
                  </div>
                  <div class="total-line">
                      <span>Tax (8.25%):</span>
                      <span>$9.16</span>
                  </div>
                  <div class="total-line">
                      <span>Shop Supplies:</span>
                      <span>$3.00</span>
                  </div>
                  <div class="total-line grand-total">
                      <span>TOTAL DUE:</span>
                      <span>$123.14</span>
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
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=850,height=1100,scrollbars=yes');
    
    if (!printWindow) {
      alert('Please allow popups to print the invoice');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Invoice Demo</h1>
                <p className="text-blue-100">Professional automotive invoice template</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handlePrint}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                  OD
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">OVERDRYV AUTO SHOP</div>
                  <div className="text-sm text-gray-600">
                    123 Main Street<br/>
                    Anytown, ST 12345<br/>
                    Phone: (555) 123-4567<br/>
                    Email: info@overdryv.com<br/>
                    ASE Certified • License #12345
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">INVOICE</div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <div className="font-bold text-sm uppercase border-b border-gray-300 mb-2">Bill To:</div>
                <div className="font-bold">John Smith</div>
                <div>john.smith@email.com</div>
                <div>(555) 123-4567</div>
                <br/>
                <div className="font-bold text-sm uppercase border-b border-gray-300 mb-2">Vehicle:</div>
                <div className="font-bold">2022 Toyota Camry</div>
                <div>VIN: 1234567890</div>
                <div>Mileage: 25,000</div>
              </div>
              
              <div>
                <div className="font-bold text-sm uppercase border-b border-gray-300 mb-2">Invoice Details:</div>
                <div><strong>Invoice #:</strong> INV-12345</div>
                <div><strong>Work Order #:</strong> WO-001</div>
                <div><strong>Date:</strong> January 15, 2025</div>
                <div><strong>Due Date:</strong> February 14, 2025</div>
                <br/>
                <div className="font-bold text-sm uppercase border-b border-gray-300 mb-2">Service Advisor:</div>
                <div>Mike Johnson</div>
                <div>Ext: 101</div>
              </div>
            </div>

            {/* Service Items Table */}
            <table className="w-full border-collapse border border-black mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-3 text-left font-bold">SERVICE DESCRIPTION</th>
                  <th className="border border-black p-3 text-center font-bold w-16">QTY</th>
                  <th className="border border-black p-3 text-right font-bold w-24">UNIT PRICE</th>
                  <th className="border border-black p-3 text-right font-bold w-24">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-3">
                    <strong>Oil Change Service</strong><br/>
                    <small className="text-gray-600">Includes: 5W-30 synthetic oil, oil filter, fluid check</small>
                  </td>
                  <td className="border border-black p-3 text-center">1</td>
                  <td className="border border-black p-3 text-right">$45.99</td>
                  <td className="border border-black p-3 text-right font-bold">$45.99</td>
                </tr>
                <tr>
                  <td className="border border-black p-3">
                    <strong>Brake Inspection</strong><br/>
                    <small className="text-gray-600">Visual inspection of brake pads and rotors</small>
                  </td>
                  <td className="border border-black p-3 text-center">1</td>
                  <td className="border border-black p-3 text-right">$29.99</td>
                  <td className="border border-black p-3 text-right font-bold">$29.99</td>
                </tr>
                <tr>
                  <td className="border border-black p-3">
                    <strong>Cabin Air Filter Replacement</strong><br/>
                    <small className="text-gray-600">Premium HEPA filter installation</small>
                  </td>
                  <td className="border border-black p-3 text-center">1</td>
                  <td className="border border-black p-3 text-right">$35.00</td>
                  <td className="border border-black p-3 text-right font-bold">$35.00</td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-80 border-2 border-black p-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>$110.98</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax (8.25%):</span>
                  <span>$9.16</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shop Supplies:</span>
                  <span>$3.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t-2 border-black pt-2 mt-2">
                  <span>TOTAL DUE:</span>
                  <span>$123.14</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="border-t border-gray-300 pt-4 text-sm">
              <div className="font-bold mb-3">TERMS & CONDITIONS:</div>
              <div className="space-y-1 text-xs">
                <div>• Payment due within 30 days of invoice date</div>
                <div>• All work guaranteed for 90 days or 3,000 miles</div>
                <div>• Customer responsible for additional repairs discovered during service</div>
                <div>• Late payments subject to 1.5% monthly service charge</div>
                <div>• Shop not responsible for items left in vehicle</div>
              </div>
              
              <div className="mt-6">
                <strong>Customer Signature:</strong>
                <div className="border-b border-black w-80 mt-2 pb-1"></div>
                <small className="text-xs text-gray-600">I authorize the above repair work to be done and agree to pay the amount shown.</small>
              </div>
            </div>

            <div className="text-center mt-8 text-sm">
              <strong>Thank you for your business!</strong><br/>
              Questions? Call (555) 123-4567
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDemo;