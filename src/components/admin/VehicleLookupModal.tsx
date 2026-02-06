import React, { useState, useEffect } from 'react';
import { X, Car, Search, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../contexts/TenantContext';

interface VehicleLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  onVehicleSelect: (vehicle: any) => void;
}

interface NHTSAMake {
  MakeId: number;
  MakeName: string;
}

interface NHTSAModel {
  Make_Name: string;
  Model_Name: string;
}

// Cache makes list at module level so it persists across component remounts
let cachedMakes: NHTSAMake[] | null = null;

const VehicleLookupModal: React.FC<VehicleLookupModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onVehicleSelect,
}) => {
  const { organizationId } = useTenant();
  const [loading, setLoading] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [lookupMethod, setLookupMethod] = useState<'vin' | 'manual'>('vin');
  const [makesLoading, setMakesLoading] = useState(false);
  const [makesFailed, setMakesFailed] = useState(false);
  
  // VIN Decode
  const [vin, setVin] = useState('');
  
  // Manual Selection
  const [years, setYears] = useState<number[]>([]);
  const [makes, setMakes] = useState<NHTSAMake[]>([]);
  const [models, setModels] = useState<NHTSAModel[]>([]);
  
  // Form Data
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    vin: '',
    color: '',
    mileage: '',
    license_plate: '',
  });

  useEffect(() => {
    // Generate years from current year down to 1990
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= 1990; year--) {
      yearList.push(year);
    }
    setYears(yearList);
  }, []);

  useEffect(() => {
    if (formData.year && lookupMethod === 'manual') {
      fetchMakes();
    }
  }, [formData.year, lookupMethod]);

  useEffect(() => {
    if (formData.year && formData.make && lookupMethod === 'manual') {
      fetchModels();
    }
  }, [formData.year, formData.make, lookupMethod]);

  const fetchMakes = async () => {
    // Use cached makes if available
    if (cachedMakes && cachedMakes.length > 0) {
      console.log('[VehicleLookup] Using cached makes:', cachedMakes.length, 'makes');
      setMakes(cachedMakes);
      setMakesFailed(false);
      return;
    }

    setMakesLoading(true);
    setMakesFailed(false);
    
    try {
      console.log('[VehicleLookup] Fetching makes from NHTSA API...');
      
      // Fetch from both passenger car and truck endpoints
      const [passengerResponse, truckResponse] = await Promise.all([
        fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/passenger%20car?format=json'),
        fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/truck?format=json')
      ]);

      const passengerData = await passengerResponse.json();
      const truckData = await truckResponse.json();

      console.log('[VehicleLookup] Passenger car makes response:', passengerData);
      console.log('[VehicleLookup] Truck makes response:', truckData);

      const passengerMakes: NHTSAMake[] = passengerData.Results || [];
      const truckMakes: NHTSAMake[] = truckData.Results || [];

      console.log('[VehicleLookup] Passenger makes count:', passengerMakes.length);
      console.log('[VehicleLookup] Truck makes count:', truckMakes.length);

      // Merge both arrays
      const allMakes = [...passengerMakes, ...truckMakes];

      // Deduplicate by MakeId
      const uniqueMakesMap = new Map<number, NHTSAMake>();
      allMakes.forEach(make => {
        if (!uniqueMakesMap.has(make.MakeId)) {
          uniqueMakesMap.set(make.MakeId, make);
        }
      });

      // Convert to array and sort alphabetically by MakeName
      const uniqueMakes = Array.from(uniqueMakesMap.values()).sort((a, b) => 
        a.MakeName.localeCompare(b.MakeName)
      );

      console.log('[VehicleLookup] Total unique makes after deduplication:', uniqueMakes.length);
      console.log('[VehicleLookup] First 10 makes:', uniqueMakes.slice(0, 10).map(m => m.MakeName));

      // Cache the results
      cachedMakes = uniqueMakes;
      setMakes(uniqueMakes);
      setMakesFailed(false);
    } catch (error) {
      console.error('[VehicleLookup] Error fetching makes:', error);
      setMakes([]);
      setMakesFailed(true);
    } finally {
      setMakesLoading(false);
    }
  };

  const fetchModels = async () => {
    if (!formData.make || !formData.year) return;
    
    try {
      console.log(`[VehicleLookup] Fetching models for ${formData.make} ${formData.year}...`);
      
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(formData.make)}/modelyear/${formData.year}?format=json`
      );
      const data = await response.json();
      
      console.log('[VehicleLookup] Models response:', data);
      console.log('[VehicleLookup] Models count:', data.Results?.length || 0);
      
      setModels(data.Results || []);
    } catch (error) {
      console.error('[VehicleLookup] Error fetching models:', error);
      setModels([]);
    }
  };

  const handleDecodeVin = async () => {
    if (!vin || vin.length < 17) {
      alert('Please enter a valid 17-character VIN');
      return;
    }

    setVinDecoding(true);
    try {
      console.log(`[VehicleLookup] Decoding VIN: ${vin}`);
      
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
      );
      const data = await response.json();
      
      console.log('[VehicleLookup] VIN decode response:', data);
      
      const result = data.Results?.[0];
      
      if (result && result.Make && result.Model && result.ModelYear) {
        console.log('[VehicleLookup] VIN decoded successfully:', {
          year: result.ModelYear,
          make: result.Make,
          model: result.Model
        });
        
        setFormData({
          ...formData,
          year: result.ModelYear,
          make: result.Make,
          model: result.Model,
          vin: vin,
        });
        alert('VIN decoded successfully! Please fill in the remaining details.');
      } else {
        console.warn('[VehicleLookup] VIN decode incomplete:', result);
        alert('Could not decode VIN. Please enter vehicle details manually.');
      }
    } catch (error) {
      console.error('[VehicleLookup] Error decoding VIN:', error);
      alert('Failed to decode VIN. Please try again or enter details manually.');
    } finally {
      setVinDecoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) {
      alert('Organization not found. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          customer_id: customerId,
          organization_id: organizationId,
          year: parseInt(formData.year),
          make: formData.make,
          model: formData.model,
          vin: formData.vin || null,
          color: formData.color || null,
          mileage: formData.mileage ? parseInt(formData.mileage) : null,
          license_plate: formData.license_plate || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating vehicle:', error);
        alert('Failed to create vehicle. Please try again.');
        return;
      }

      onVehicleSelect(data);
      resetForm();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Failed to create vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      year: '',
      make: '',
      model: '',
      vin: '',
      color: '',
      mileage: '',
      license_plate: '',
    });
    setVin('');
    setModels([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lookup Method Toggle */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setLookupMethod('vin')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                lookupMethod === 'vin'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Decode VIN
            </button>
            <button
              type="button"
              onClick={() => setLookupMethod('manual')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                lookupMethod === 'manual'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* VIN Decode Section */}
          {lookupMethod === 'vin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Identification Number (VIN)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="Enter 17-character VIN"
                    maxLength={17}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleDecodeVin}
                    disabled={vinDecoding || vin.length < 17}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {vinDecoding ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Decoding...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Decode
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the VIN and click Decode to auto-fill vehicle details
                </p>
              </div>
            </div>
          )}

          {/* Manual Entry Section */}
          {lookupMethod === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value, make: '', model: '' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {formData.year && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  
                  {makesLoading && (
                    <div className="flex items-center justify-center py-3 text-gray-500">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading makes...
                    </div>
                  )}
                  
                  {!makesLoading && makesFailed && (
                    <div>
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                          Could not load makes from NHTSA. Please enter manually.
                        </p>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value, model: '' })}
                        placeholder="Enter vehicle make (e.g., Toyota, Ford, Honda)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  
                  {!makesLoading && !makesFailed && (
                    <select
                      required
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value, model: '' })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select make</option>
                      {makes.map(make => (
                        <option key={make.MakeId} value={make.MakeName}>
                          {make.MakeName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {formData.year && formData.make && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <select
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select model</option>
                    {models.map((model, index) => (
                      <option key={`${model.Model_Name}-${index}`} value={model.Model_Name}>
                        {model.Model_Name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Common Fields (shown after VIN decode or manual selection) */}
          {((lookupMethod === 'vin' && formData.year && formData.make && formData.model) ||
            (lookupMethod === 'manual' && formData.year && formData.make && formData.model)) && (
            <>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Additional Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                      placeholder="Optional"
                      maxLength={17}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., Black, White, Silver"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      placeholder="Current mileage"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                    <input
                      type="text"
                      value={formData.license_plate}
                      onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                      placeholder="e.g., ABC1234"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Vehicle Summary</h4>
                <p className="text-green-800">
                  {formData.year} {formData.make} {formData.model}
                  {formData.color && ` - ${formData.color}`}
                  {formData.license_plate && ` (${formData.license_plate})`}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.year || !formData.make || !formData.model}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Vehicle...
                </>
              ) : (
                'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleLookupModal;