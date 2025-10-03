import React, { useState, useEffect } from 'react';
import { X, FileText, Tag, Save, Upload, AlertCircle, Image } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { uploadImage } from '../services/imageUploadService';

const GalleryForm = ({ item = null, onSubmit, onCancel, isLoading = false, category = 'photos' }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'events'
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determine max file size based on category
  // Photos: 10MB limit (for add new photo functionality)
  // Other categories: 500KB limit
  const maxSizeKB = category === 'photos' ? 10240 : 500;

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        category: item.category || 'events'
      });
      // For editing, set the existing image URL as preview
      setImagePreview(item.image_url || null);
    }
  }, [item]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const categories = [
    { value: 'home-slider', label: 'Home Page Slider' },
    { value: 'events', label: 'Events' },
    { value: 'activities', label: 'Activities' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'community', label: 'Community Service' },
    { value: 'education', label: 'Education Programs' },
    { value: 'health', label: 'Health Camps' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'team', label: 'Team & Volunteers' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Image title is required';
    }
    
    // For new items, require image selection
    if (!item && !selectedImage) {
      newErrors.image = 'Please select an image to upload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      let imageUrl = item?.image_url; // Use existing URL for edits

      // Upload new image if selected
      if (selectedImage) {
        setUploadProgress(0);
        imageUrl = await uploadImage(selectedImage, formData.category);
      }

      // Prepare final form data
      const finalFormData = {
        ...formData,
        image_url: imageUrl
      };

      // Submit to parent component
      await onSubmit(finalFormData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to save gallery item' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
    
    // Clear any previous image error
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    // Clean up preview URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Image Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Image Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter image title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Image *
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  error={errors.image}
                  maxSizeKB={maxSizeKB}
                />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              
              {imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    onError={handleImageError}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">{formData.title || 'Image Title'}</h4>
                    <p className="text-xs text-gray-500">Category: {categories.find(c => c.value === formData.category)?.label}</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select an image to see preview
                  </p>
                </div>
              )}

              {/* Upload Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Image Upload Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use high-quality images (at least 800x600px)</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Keep file size under 5MB for faster loading</li>
                  <li>• Use descriptive titles and alt text</li>
                  <li>• Consider using image hosting services like Imgur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {item ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {item ? 'Update Image' : 'Add Image'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryForm;
