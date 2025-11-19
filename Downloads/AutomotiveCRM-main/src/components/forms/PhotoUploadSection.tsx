import React, { useState } from 'react';
import { Camera, Upload, X, Image } from 'lucide-react';

interface PhotoUploadSectionProps {
  onComplete: (data: any) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ onComplete }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...imageFiles].slice(0, 10)); // Limit to 10 photos
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(photos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Camera className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Document Current Condition</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Upload photos of any existing damage or areas of concern. This helps protect both you and our shop.
        </p>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop photos here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Upload up to 10 photos (JPG, PNG, HEIC)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Photo Preview Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Camera Capture for Mobile */}
        <div className="mt-4 md:hidden">
          <label className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 cursor-pointer hover:bg-gray-200 transition-colors">
            <Camera className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-gray-700">Take Photo</span>
            <input
              type="file"
              capture="environment"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => onComplete(photos)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Skip Photos
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors transform hover:scale-[1.02] shadow-lg"
        >
          Continue to Waiver
        </button>
      </div>
    </form>
  );
};

export default PhotoUploadSection;