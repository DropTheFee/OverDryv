import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CreditCard, 
  DollarSign, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Camera,
  Smartphone,
  Wifi,
  Shield,
  Bell,
  Users,
  Palette,
  Upload,
  Download,
  FileText
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    shopName: 'OverDryv Auto Shop',
    address: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    phone: '(555) 123-4567',
    email: 'info@overdryv.com',
    website: 'www.overdryv.com',
    
    // Dual Pricing Settings
    dualPricingEnabled: true,
    cardProcessingFee: 3.5,
    dualPricingLabel: 'Card Processing Fee',
    
    // Payment Processing
    paymentProcessor: 'dejavoo',
    terminalModel: 'P3',
    merchantId: '',
    terminalId: '',
    apiKey: '',
    
    // Tax Settings
    taxRate: 8.25,
    taxLabel: 'Sales Tax',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    customerUpdates: true,
    lowInventoryAlerts: true,
    
    // Photo/Hardware Settings
    photoQuality: 'high',
    autoUpload: true,
    barcodeScanning: true,
    
    // Business Hours
    businessHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '16:00', closed: false },
      sunday: { open: '09:00', close: '15:00', closed: true },
    }
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('shopSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'payments', label: 'Payments & Dual Pricing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'hardware', label: 'Hardware & Photos', icon: Camera },
    { id: 'users', label: 'Users & Permissions', icon: Users },
    { id: 'data', label: 'Data Import/Export', icon: FileText },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSave = () => {
    // Save to localStorage for demo
    localStorage.setItem('shopSettings', JSON.stringify(settings));
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    successDiv.innerHTML = '✅ Settings saved successfully!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  };

  const handleImportData = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const text = await importFile.text();
      
      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Parse and validate the data
      if (importFile.name.endsWith('.csv')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Basic validation
        if (!headers.includes('email') && !headers.includes('make')) {
          throw new Error('Invalid CSV format. Must contain customer or vehicle data.');
        }

        // In production, this would process and save the data
        console.log('Import data:', { headers, rowCount: lines.length - 1 });
        
        alert(`Successfully imported ${lines.length - 1} records from ${importFile.name}!`);
      } else if (importFile.name.endsWith('.json')) {
        const data = JSON.parse(text);
        console.log('Import JSON data:', data);
        alert(`Successfully imported JSON data from ${importFile.name}!`);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

    } catch (error: any) {
      console.error('Import error:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      setImportFile(null);
      setShowImportModal(false);
    }
  };

  const handleExportData = () => {
    // Generate sample export data
    const exportData = {
      customers: [
        { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
        { id: 2, firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@email.com', phone: '(555) 234-5678' },
      ],
      vehicles: [
        { id: 1, customerId: 1, make: 'Toyota', model: 'Camry', year: 2022, vin: '1HGBH41JXMN109186' },
        { id: 2, customerId: 2, make: 'Honda', model: 'Civic', year: 2020, vin: '2HGFC2F59GH123456' },
      ],
      workOrders: JSON.parse(localStorage.getItem('workOrders') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overdryv-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) => setSettings({...settings, shopName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({...settings, website: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => setSettings({...settings, city: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={settings.state}
              onChange={(e) => setSettings({...settings, state: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={settings.taxRate}
              onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Label</label>
            <input
              type="text"
              value={settings.taxLabel}
              onChange={(e) => setSettings({...settings, taxLabel: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-blue-900">Dual Pricing System</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Automatically display both cash and card prices on all invoices. Compliant with card brand regulations.
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.dualPricingEnabled}
            onChange={(e) => setSettings({...settings, dualPricingEnabled: e.target.checked})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-gray-900">Enable Dual Pricing</span>
        </label>
      </div>

      {settings.dualPricingEnabled && (
        <div className="space-y-4 pl-6 border-l-2 border-blue-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Processing Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.cardProcessingFee}
                onChange={(e) => setSettings({...settings, cardProcessingFee: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Fee added for card payments</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Program Label</label>
            <input
              type="text"
              value={settings.dualPricingLabel}
              onChange={(e) => setSettings({...settings, dualPricingLabel: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">How this appears on invoices</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Processor</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processor</label>
            <select
              value={settings.paymentProcessor}
              onChange={(e) => setSettings({...settings, paymentProcessor: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dejavoo">Dejavoo (iPOSpays)</option>
              <option value="hyfin">HyFin</option>
              <option value="stripe">Stripe</option>
              <option value="square">Square</option>
            </select>
          </div>

          {settings.paymentProcessor === 'dejavoo' && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Dejavoo Terminal Settings</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terminal Model</label>
                  <select
                    value={settings.terminalModel}
                    onChange={(e) => setSettings({...settings, terminalModel: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="P1">P1 Terminal</option>
                    <option value="P3">P3 Terminal</option>
                    <option value="QD4">QD4 Terminal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
                  <input
                    type="text"
                    value={settings.merchantId}
                    onChange={(e) => setSettings({...settings, merchantId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your merchant ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terminal ID</label>
                  <input
                    type="text"
                    value={settings.terminalId}
                    onChange={(e) => setSettings({...settings, terminalId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Terminal ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="API Key"
                  />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Features Available:</span>
                </div>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Dual pricing compliance</li>
                  <li>• Barcode scanning for inventory</li>
                  <li>• Photo capture for documentation</li>
                  <li>• EMV chip and contactless payments</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHardwareSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo & Documentation</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo Quality</label>
            <select
              value={settings.photoQuality}
              onChange={(e) => setSettings({...settings, photoQuality: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low (Faster upload)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Best quality)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.autoUpload}
                onChange={(e) => setSettings({...settings, autoUpload: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-upload photos</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.barcodeScanning}
                onChange={(e) => setSettings({...settings, barcodeScanning: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable barcode scanning</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Smartphone className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Recommended Hardware Setup</h4>
        </div>
        <div className="text-blue-700 text-sm space-y-2">
          <p><strong>All-in-One Solution:</strong> Dejavoo P3 Terminal</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Payment processing with dual pricing</li>
            <li>Built-in camera for vehicle photos</li>
            <li>Barcode scanner for parts inventory</li>
            <li>Customer signature capture</li>
            <li>WiFi and cellular connectivity</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDataImportExport = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-blue-900">Data Migration & Backup</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Import existing customer and vehicle data from other systems, or export your data for backup purposes.
        </p>
      </div>

      {/* Import Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Customer Data</h4>
              <p className="text-sm text-gray-600 mb-3">Import customer information from CSV or JSON files</p>
              <button 
                onClick={() => setShowImportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Customers
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Vehicle Data</h4>
              <p className="text-sm text-gray-600 mb-3">Import vehicle information and service history</p>
              <button 
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Vehicles
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Supported Formats</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• CSV files with headers (customers.csv, vehicles.csv)</li>
              <li>• JSON files from other automotive software</li>
              <li>• Excel files (.xlsx) - converted to CSV format</li>
              <li>• QuickBooks customer exports</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={handleExportData}
            className="border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <Download className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export All Data</h4>
            <p className="text-sm text-gray-600">Download complete backup of customers, vehicles, and work orders</p>
          </button>
          <button 
            onClick={() => {
              const customers = [
                { firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
                { firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@email.com', phone: '(555) 234-5678' },
              ];
              const csv = 'firstName,lastName,email,phone\n' + customers.map(c => `${c.firstName},${c.lastName},${c.email},${c.phone}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'customers-export.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Customers</h4>
            <p className="text-sm text-gray-600">Download customer list as CSV for marketing or backup</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your shop settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'payments' && renderPaymentSettings()}
        {activeTab === 'hardware' && renderHardwareSettings()}
        {activeTab === 'data' && renderDataImportExport()}
        {activeTab === 'notifications' && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Notification settings coming soon...</p>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>User management coming soon...</p>
          </div>
        )}
        {activeTab === 'appearance' && (
          <div className="text-center py-8 text-gray-500">
            <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Appearance settings coming soon...</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Import Data</h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: CSV, JSON, Excel (.xlsx)</p>
              </div>

              {isImporting && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Importing...</span>
                    <span className="text-sm text-gray-500">{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Example</h4>
                <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
{`firstName,lastName,email,phone,make,model,year,vin
John,Smith,john@email.com,(555) 123-4567,Toyota,Camry,2022,1HGBH41JXMN109186
Sarah,Davis,sarah@email.com,(555) 234-5678,Honda,Civic,2020,2HGFC2F59GH123456`}
                </pre>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportData}
                  disabled={!importFile || isImporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;