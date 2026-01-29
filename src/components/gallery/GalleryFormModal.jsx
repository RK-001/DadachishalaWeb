import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, Upload, Youtube, Cloud, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { sanitizeString } from '../../utils/validators';

const GalleryFormModal = ({ type, item, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'education',
    year: new Date().getFullYear(),
    organization: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    youtube_url: '',
    duration: '',
    excerpt: '',
    link: ''
  });
  const [uploadMethod, setUploadMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        image: item.image || item.image_url || item.src || item.thumbnail || '',
        category: item.category || 'education',
        year: item.year || new Date().getFullYear(),
        organization: item.organization || '',
        source: item.source || '',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        youtube_url: item.youtube_url || '',
        duration: item.duration || '',
        excerpt: item.excerpt || '',
        link: item.link || ''
      });
      setPreviewUrl(item.image || item.image_url || item.src || item.thumbnail || '');
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

    const maxSizeKB = type === 'photos' ? 10240 : 500;
    const maxSizeBytes = maxSizeKB * 1024;
    
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${type === 'photos' ? '10MB' : '500KB'}`);
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
  }, [type]);

  const uploadFileToCloudinary = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const extractVideoId = useCallback((url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }, []);

  const generateThumbnail = useCallback(() => {
    if (type === 'videos' && formData.youtube_url) {
      const videoId = extractVideoId(formData.youtube_url);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setFormData(prev => ({ ...prev, image: thumbnailUrl }));
        setPreviewUrl(thumbnailUrl);
      }
    }
  }, [type, formData.youtube_url, extractVideoId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      let imageUrl = formData.image;

      if (uploadMethod === 'file' && selectedFile) {
        imageUrl = await uploadFileToCloudinary(selectedFile);
      }

      let submitData = {};
      
      if (type === 'photos') {
        submitData = {
          title: sanitizeString(formData.title),
          description: sanitizeString(formData.description),
          image_url: imageUrl,
          category: formData.category
        };
      } else if (type === 'awards') {
        submitData = {
          title: sanitizeString(formData.title),
          description: sanitizeString(formData.description),
          image: imageUrl,
          organization: sanitizeString(formData.organization),
          year: formData.year
        };
      } else if (type === 'news') {
        submitData = {
          title: sanitizeString(formData.title),
          excerpt: sanitizeString(formData.excerpt),
          image: imageUrl,
          source: sanitizeString(formData.source),
          date: formData.date,
          link: formData.link
        };
      } else if (type === 'videos') {
        submitData = {
          title: sanitizeString(formData.title),
          description: sanitizeString(formData.description),
          youtube_url: formData.youtube_url,
          thumbnail: formData.image,
          duration: formData.duration
        };
      }
      
      onSubmit(submitData);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [formData, uploadMethod, selectedFile, type, uploadFileToCloudinary, onSubmit]);

  const modalTitle = `${item ? 'Edit' : 'Add New'} ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}`;

  return (
    <Modal isOpen={true} size="large" onClose={onCancel} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter title"
          />
        </div>

        {/* Description/Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'news' ? 'Excerpt' : 'Description'} *
          </label>
          <textarea
            required
            rows={3}
            value={type === 'news' ? formData.excerpt : formData.description}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              [type === 'news' ? 'excerpt' : 'description']: e.target.value 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={`Enter ${type === 'news' ? 'excerpt' : 'description'}`}
          />
        </div>

        {/* Image/Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'videos' ? 'YouTube URL' : 'Image'} *
          </label>
          
          {(type === 'awards' || type === 'news' || type === 'photos') && (
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
          )}

          {type === 'videos' ? (
            <div className="flex space-x-2">
              <input
                type="url"
                required
                value={formData.youtube_url}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://youtube.com/watch?v=..."
              />
              <button
                type="button"
                onClick={generateThumbnail}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Generate thumbnail from YouTube URL"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          ) : uploadMethod === 'url' ? (
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

          {previewUrl && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Type-specific fields */}
        {type === 'photos' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="education">Education</option>
              <option value="activities">Activities</option>
              <option value="events">Events</option>
              <option value="home-slider">Home Slider</option>
              <option value="volunteers">Volunteers</option>
              <option value="community">Community Service</option>
              <option value="achievements">Achievements</option>
            </select>
          </div>
        )}

        {type === 'awards' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Award giving organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <input
                type="number"
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        )}

        {type === 'news' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="News source"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Article Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/article"
              />
            </div>
          </>
        )}

        {type === 'videos' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 5:32"
            />
          </div>
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

export default memo(GalleryFormModal);
