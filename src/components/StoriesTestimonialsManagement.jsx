import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Star,
  Quote,
  User,
  Award,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  ExternalLink,
  Cloud,
  Eye,
  Users
} from 'lucide-react';
import {
  addSuccessStory,
  getSuccessStories,
  updateSuccessStory,
  deleteSuccessStory,
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} from '../services/databaseService';

// Stories & Testimonials Management Component
const StoriesTestimonialsManagement = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Data states
  const [successStories, setSuccessStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const tabs = [
    { id: 'stories', label: 'Success Stories', icon: Star, count: successStories.length },
    { id: 'testimonials', label: 'Testimonials', icon: Quote, count: testimonials.length },
  ];

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab) {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'stories') {
        const storiesData = await getSuccessStories();
        setSuccessStories(storiesData);
      } else if (activeTab === 'testimonials') {
        const testimonialsData = await getTestimonials();
        setTestimonials(testimonialsData);
      }
    } catch (error) {
      console.error(`Error loading ${activeTab}:`, error);
      showNotification(`Error loading ${activeTab}. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    const itemType = activeTab === 'stories' ? 'Success Story' : 'Testimonial';
    if (window.confirm(`Are you sure you want to delete "${item.name || item.title}"? This action cannot be undone.`)) {
      try {
        if (activeTab === 'stories') {
          await deleteSuccessStory(item.id);
        } else {
          await deleteTestimonial(item.id);
        }
        
        showNotification(`${itemType} deleted successfully!`, 'success');
        await loadData(); // Reload data after deletion
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
        showNotification(`Error deleting ${itemType}. Please try again.`, 'error');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingItem) {
        // Update existing item
        if (activeTab === 'stories') {
          await updateSuccessStory(editingItem.id, formData);
        } else {
          await updateTestimonial(editingItem.id, formData);
        }
        showNotification(`${activeTab === 'stories' ? 'Success Story' : 'Testimonial'} updated successfully!`, 'success');
      } else {
        // Add new item
        if (activeTab === 'stories') {
          await addSuccessStory(formData);
        } else {
          await addTestimonial(formData);
        }
        showNotification(`${activeTab === 'stories' ? 'Success Story' : 'Testimonial'} added successfully!`, 'success');
      }
      
      setShowForm(false);
      setEditingItem(null);
      await loadData(); // Reload data after save
    } catch (error) {
      const itemType = activeTab === 'stories' ? 'Success Story' : 'Testimonial';
      console.error(`Error saving ${itemType}:`, error);
      showNotification(`Error saving ${itemType}. Please try again.`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const getFilteredData = () => {
    let data = activeTab === 'stories' ? successStories : testimonials;

    // Search filter
    if (searchTerm) {
      data = data.filter(item =>
        (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.story?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.quote?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.achievement?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.role?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return data;
  };

  const renderItemCard = (item) => {
    return (
      <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>
          {activeTab === 'stories' ? (
            <>
              <p className="text-primary-600 font-medium mb-2">{item.achievement}</p>
              <p className="text-gray-600 text-sm line-clamp-3">{item.story}</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 font-medium mb-2">{item.role}</p>
              <p className="text-gray-600 text-sm line-clamp-3 italic">"{item.quote}"</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stories & Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage success stories and testimonials</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New {activeTab === 'stories' ? 'Story' : 'Testimonial'}
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`flex items-center p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          )}
          <span className={`text-sm ${
            notification.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className={`ml-auto ${
              notification.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading {activeTab}...</span>
        </div>
      ) : getFilteredData().length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          {activeTab === 'stories' ? (
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          ) : (
            <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'stories' ? 'Success Stories' : 'Testimonials'} yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your {activeTab === 'stories' ? 'success stories' : 'testimonials'} collection by adding your first item.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First {activeTab === 'stories' ? 'Story' : 'Testimonial'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getFilteredData().map(renderItemCard)}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <StoryTestimonialFormModal
          type={activeTab}
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

// Form Modal Component
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

  // Update preview when image URL changes
  useEffect(() => {
    if (uploadMethod === 'url' && formData.image && formData.image.startsWith('http')) {
      setPreviewUrl(formData.image);
    }
  }, [formData.image, uploadMethod]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (500KB max for Stories & Testimonials)
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
    }
  };

  const uploadFile = async (file) => {
    // For demo purposes, convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      let imageUrl = formData.image;

      if (uploadMethod === 'file' && selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const submitData = { ...formData, image: imageUrl };
      onSubmit(submitData);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit' : 'Add New'} {type === 'stories' ? 'Success Story' : 'Testimonial'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  uploadMethod === 'url'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ExternalLink className="w-4 h-4 inline mr-2" />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  uploadMethod === 'file'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
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
                <div className="flex items-center justify-center w-full">
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
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Image preview */}
            {previewUrl && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
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
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoriesTestimonialsManagement;
