import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { validateImageFile, createImagePreview, cleanupImagePreview } from '../services/imageUploadService';

const ImageUpload = ({ onImageSelect, onImageRemove, currentImage = null, disabled = false, maxSizeKB = 10240 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    // Validate file with custom size limit
    const validation = validateImageFile(file, maxSizeKB);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setError('');
    
    // Clean up previous preview
    if (previewUrl && previewUrl !== currentImage) {
      cleanupImagePreview(previewUrl);
    }

    // Create new preview
    const newPreviewUrl = createImagePreview(file);
    setPreviewUrl(newPreviewUrl);
    setSelectedFile(file);
    
    // Notify parent component
    onImageSelect(file);
  }, [currentImage, previewUrl, onImageSelect, maxSizeKB]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    // Clean up preview
    if (previewUrl && previewUrl !== currentImage) {
      cleanupImagePreview(previewUrl);
    }
    
    setPreviewUrl(null);
    setSelectedFile(null);
    setError('');
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent component
    onImageRemove();
  }, [previewUrl, currentImage, onImageRemove]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!previewUrl ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={disabled ? undefined : openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
          />
          
          <div className="text-center">
            <Upload className={`mx-auto h-12 w-12 ${
              dragActive ? 'text-primary-500' : 'text-gray-400'
            }`} />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-primary-600 hover:text-primary-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>
          </div>
          
          {dragActive && (
            <div className="absolute inset-0 bg-primary-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <div className="text-primary-600 font-medium">Drop your image here</div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview */
        <div className="relative">
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={openFileDialog}
                  className="p-2 bg-white text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-colors"
                  title="Change Image"
                  disabled={disabled}
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-full shadow-md transition-colors"
                  title="Remove Image"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* File info */}
          {selectedFile && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span className="truncate">{selectedFile.name}</span>
                </div>
                <span className="text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Image Upload Guidelines</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Supported formats: JPEG, PNG, WebP, GIF</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Recommended resolution: At least 800x600px</li>
          <li>• Images will be automatically compressed if needed</li>
          <li>• Use high-quality images for best results</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
