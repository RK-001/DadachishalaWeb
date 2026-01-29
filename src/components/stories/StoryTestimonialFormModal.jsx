import React, { useState, useEffect, useCallback, memo } from 'react';
import { Upload, Cloud, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { sanitizeString } from '../../utils/validators';

const StoryTestimonialFormModal = ({ type, item, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    story: '',
    achievement: '',
    quote: '',
    role: ''
  });
  const [uploadMethod, setUploadMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        image: item.image || '',
        story: item.story || '',
        achievement: item.achievement || '',
        quote: item.quote || '',
        role: item.role || ''
      });
      setPreviewUrl(item.image || '');
    }
  }, [item]);

  useEffect(() => {
    if (uploadMethod === 'url' && formData.image && formData.image.startsWith('http')) {
      setPreviewUrl(formData.image);
    }
  }, [formData.image, uploadMethod]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeKB = 500;
    const maxSizeBytes = maxSizeKB * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSizeKB}KB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setFormData(prev => ({ ...prev, image: e.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      let imageUrl = formData.image;

      if (uploadMethod === 'file' && selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const submitData = {
        name: sanitizeString(formData.name),
        image: imageUrl,
        ...(type === 'stories' ? {
          achievement: sanitizeString(formData.achievement),
          story: sanitizeString(formData.story)
        } : {
          role: sanitizeString(formData.role),
          quote: sanitizeString(formData.quote)
        })
      };
      
      onSubmit(submitData);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [formData, uploadMethod, selectedFile, type, uploadFile, onSubmit]);

  const modalTitle = `${item ? 'Edit' : 'Add New'} ${type === 'stories' ? 'Success Story' : 'Testimonial'}`;

  return (
    <Modal isOpen={true} size="large" onClose={onCancel} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter name"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image *
          </label>
          
          {/* Upload method toggle */}
          <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'url' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ExternalLink className="w-4 h-4 inline mr-2" />
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'file' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Cloud className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
          </div>

          {uploadMethod === 'url' ? (
            <input
              type="url"
              required={uploadMethod === 'url'}
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          ) : (
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required={uploadMethod === 'file' && !item}
                />
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
              )}
            </div>
          )}

          {/* Image preview */}
          {previewUrl && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Success Story Fields */}
        {type === 'stories' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement *
              </label>
              <input
                type="text"
                required
                value={formData.achievement}
                onChange={(e) => setFormData(prev => ({ ...prev, achievement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Software Engineer at Tech Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story *
              </label>
              <textarea
                required
                rows={4}
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell their inspiring journey..."
              />
            </div>
          </>
        )}

        {/* Testimonial Fields */}
        {type === 'testimonials' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Parent, Donor, Volunteer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote *
              </label>
              <textarea
                required
                rows={4}
                value={formData.quote}
                onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter their testimonial quote..."
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isLoading || uploading}
          >
            {isLoading || uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {item ? 'Update' : 'Save'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default memo(StoryTestimonialFormModal);
