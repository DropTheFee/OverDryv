import React, { useState, useEffect } from 'react';
import { X, FileText, Car, DollarSign, Calendar, Eye, Download } from 'lucide-react';

interface CustomerHistoryModalProps {
  customerId: string;
  onClose: () => void;
}

interface WorkOrderHistory {
  id: string;
  workOrderNumber: string;
  date: string;
  vehicle: string;
  serviceType: string;
  status: string;
  amount: number;
  invoiceNumber?: string;
  technician: string;
  description: string;
}

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ customerId, onClose }) => {
  const [history, setHistory] = useState<WorkOrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    fetchCustomerHistory();
  }, [customerId]);

  const fetchCustomerHistory = async () => {
    // Mock data - in production, fetch from API
    const mockHistory: WorkOrderHistory[] = [
      {
        id: '1',
        workOrderNumber: 'WO-098',
        date: '2024-12-10',
        vehicle: '2022 Toyota Camry',
        serviceType: 'Brake Pad Replacement',
        status: 'completed',
        amount: 285.50,
        invoiceNumber: 'INV-098',
        technician: 'Sarah Davis',
        description: 'Replaced front brake pads and rotors. Brake fluid flush performed.'
      },
      {
        id: '2',
        workOrderNumber: 'WO-087',
        date: '2024-09-15',
        vehicle: '2022 Toyota Camry',
        serviceType: 'Oil Change & Filter',
        status: 'completed',
        amount: 45.99,
        invoiceNumber: 'INV-087',
        technician: 'Mike Johnson',
        description: 'Regular maintenance oil change with synthetic 5W-30 oil and new filter.'
      },
      {
        id: '3',
        workOrderNumber: 'WO-074',
        date: '2024-06-20',
        vehicle: '2019 Honda CR-V',
        serviceType: 'Annual Inspection',
        status: 'completed',
        amount: 89.99,
        invoiceNumber: 'INV-074',
        technician: 'Tom Wilson',
        description: 'Complete vehicle inspection including emissions test. All systems passed.'
      },
      {
        id: '4',
        workOrderNumber: 'WO-061',
        date: '2024-03-12',
        vehicle: '2022 Toyota Camry',
        serviceType: 'Tire Rotation & Balance',
        status: 'completed',
        amount: 65.00,
        invoiceNumber: 'INV-061',
        technician: 'Sarah Davis',
        description: 'Rotated all four tires and performed wheel balancing.'
      },
      {
        id: '5',
        workOrderNumber: 'WO-045',
        date: '2023-12-08',
        vehicle: '2019 Honda CR-V',
        serviceType: 'Engine Diagnostics',
        status: 'completed',
        amount: 150.00,
        invoiceNumber: 'INV-045',
        technician: 'Mike Johnson',
        description: 'Diagnosed check engine light. Replaced faulty oxygen sensor.'
      }
    ];

    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 500);
  };

  const handleViewInvoice = (record: WorkOrderHistory) => {
    if (!record.invoiceNumber) {
      alert('No invoice available for this work order.');
      return;
    }

    // Generate invoice HTML for viewing
    const invoiceHTML = generateInvoiceHTML(record);
    
    // Create a blob and open it
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadInvoice = (record: WorkOrderHistory) => {
    if (!record.invoiceNumber) {
      alert('No invoice available for this work order.');
      return;
    }

    // Generate PDF and download it
    generateAndDownloadPDF(record);
  };

  const generateAndDownloadPDF = async (record: WorkOrderHistory) => {
    try {
      // Import jsPDF and html2canvas
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      // Create a temporary div with the invoice content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generateInvoiceHTML(record);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '8.5in';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      document.body.appendChild(tempDiv);
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      
      // Download PDF
      pdf.save(`Invoice-${record.invoiceNumber}-${record.workOrderNumber}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again or contact support.');
    }
  };

  const generateInvoiceHTML = (record: WorkOrderHistory) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${record.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              line-height: 1.4; 
              color: #000; 
              background: white;
              padding: 20px;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #334155;
            }
            .logo {
              width: 50px;
              height: 50px;
              background: #334155;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 20px;
            }
            .company-info {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .company-details h1 {
              font-size: 24px;
              color: #334155;
              margin-bottom: 5px;
            }
            .company-details p {
              font-size: 11px;
              color: #475569;
              margin: 2px 0;
            }
            .invoice-title {
              text-align: right;
              font-size: 28px;
              font-weight: bold;
              color: #334155;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .section-title {
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 8px;
              color: #334155;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
            }
            .service-item {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .service-item h3 {
              color: #334155;
              font-size: 16px;
              margin-bottom: 8px;
            }
            .service-item p {
              color: #64748b;
              font-size: 12px;
              margin-bottom: 4px;
            }
            .total-section {
              background: #334155;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
            }
            .total-section h2 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-info">
                <div class="logo">OD</div>
                <div class="company-details">
                  <h1>OverDryv Auto Shop</h1>
                  <p>123 Main Street</p>
                  <p>Anytown, ST 12345</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: info@overdryv.com</p>
                </div>
              </div>
              <div class="invoice-title">INVOICE</div>
            </div>
            
            <div class="invoice-info">
              <div>
                <div class="section-title">Invoice Details:</div>
                <p><strong>Invoice #:</strong> ${record.invoiceNumber}</p>
                <p><strong>Work Order #:</strong> ${record.workOrderNumber}</p>
                <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Vehicle:</strong> ${record.vehicle}</p>
              </div>
              <div>
                <div class="section-title">Technician:</div>
                <p>${record.technician}</p>
              </div>
            </div>
            
            <div class="service-item">
              <h3>${record.serviceType}</h3>
              <p>${record.description}</p>
              <p><strong>Status:</strong> ${record.status.toUpperCase()}</p>
            </div>
            
            <div class="total-section">
              <h2>Total Amount</h2>
              <div style="font-size: 32px; font-weight: bold;">$${record.amount.toFixed(2)}</div>
            </div>
            
            <div class="footer">
              <p><strong>Thank you for choosing OverDryv Auto Shop!</strong></p>
              <p>Questions? Call us at (555) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generatePrintableInvoiceHTML = (record: WorkOrderHistory) => {
    const baseHTML = generateInvoiceHTML(record);
    
    // Add auto-print script
    return baseHTML.replace(
      '</body>',
      `
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>`
    );
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'in_progress': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const years = ['all', ...new Set(history.map(h => new Date(h.date).getFullYear().toString()))];
  const filteredHistory = selectedYear === 'all' 
    ? history 
    : history.filter(h => new Date(h.date).getFullYear().toString() === selectedYear);

  const totalSpent = filteredHistory.reduce((sum, h) => sum + h.amount, 0);
  const totalServices = filteredHistory.length;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
              <p className="text-gray-600">Complete record of all services and invoices</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              {years.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalServices}</div>
              <div className="text-gray-600">Total Services</div>
              <div className="text-sm text-gray-500">
                {selectedYear === 'all' ? 'All time' : `in ${selectedYear}`}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
              <div className="text-gray-600">Total Spent</div>
              <div className="text-sm text-gray-500">
                {selectedYear === 'all' ? 'All time' : `in ${selectedYear}`}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${totalServices > 0 ? (totalSpent / totalServices).toFixed(2) : '0.00'}
              </div>
              <div className="text-gray-600">Average Service</div>
              <div className="text-sm text-gray-500">Per visit</div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="p-6">
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date / Work Order</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle / Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Technician</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">{record.workOrderNumber}</div>
                          {record.invoiceNumber && (
                            <div className="text-xs text-blue-600">{record.invoiceNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.serviceType}</div>
                          <div className="text-sm text-gray-600">{record.vehicle}</div>
                          <div className="text-xs text-gray-500 mt-1">{record.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {record.technician}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        ${record.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {record.invoiceNumber ? (
                            <>
                              <button 
                                onClick={() => handleViewInvoice(record)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDownloadInvoice(record)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Download/Print Invoice"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">No Invoice</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Service History</h3>
              <p className="text-gray-500">
                {selectedYear === 'all' 
                  ? 'This customer has no service history yet.' 
                  : `No services found for ${selectedYear}.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryModal;