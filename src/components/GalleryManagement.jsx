import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Image as ImageIcon, 
  Trophy, 
  Play, 
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Award,
  Upload,
  Youtube,
  FileImage,
  Cloud
} from 'lucide-react';
import { 
  getGalleryItems, 
  addGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem,
  getAwards,
  addAward,
  updateAward,
  deleteAward,
  getNewsArticles,
  addNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo
} from '../services/databaseService';

const GalleryManagement = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Data states
  const [photos, setPhotos] = useState([]);
  const [awards, setAwards] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);

  const tabs = [
    { id: 'photos', label: 'Photos', icon: ImageIcon, count: photos.length },
    { id: 'awards', label: 'Awards', icon: Trophy, count: awards.length },
    { id: 'videos', label: 'Videos', icon: Play, count: videos.length },
    { id: 'news', label: 'News & Media', icon: ExternalLink, count: news.length },
  ];

  const photoCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'education', label: 'Education' },
    { value: 'home-slider', label: 'Home Slider' },
    { value: 'activities', label: 'Activities' },
    { value: 'events', label: 'Events' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'community', label: 'Community Service' },
    { value: 'achievements', label: 'Achievements' }
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
      
      if (activeTab === 'photos') {
        const photosData = await getGalleryItems();
        setPhotos(photosData);
      } else if (activeTab === 'awards') {
        const awardsData = await getAwards();
        setAwards(awardsData);
      } else if (activeTab === 'news') {
        const newsData = await getNewsArticles();
        setNews(newsData);
      } else if (activeTab === 'videos') {
        const videosData = await getVideos();
        setVideos(videosData);
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
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      try {
        if (activeTab === 'photos') {
          await deleteGalleryItem(item.id);
        } else if (activeTab === 'awards') {
          await deleteAward(item.id);
        } else if (activeTab === 'news') {
          await deleteNewsArticle(item.id);
        } else if (activeTab === 'videos') {
          await deleteVideo(item.id);
        }
        
        showNotification(`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)} deleted successfully!`, 'success');
        await loadData();
      } catch (error) {
        console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
        showNotification(`Error deleting ${activeTab.slice(0, -1)}. Please try again.`, 'error');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingItem) {
        // Update existing item
        if (activeTab === 'photos') {
          await updateGalleryItem(editingItem.id, formData);
        } else if (activeTab === 'awards') {
          await updateAward(editingItem.id, formData);
        } else if (activeTab === 'news') {
          await updateNewsArticle(editingItem.id, formData);
        } else if (activeTab === 'videos') {
          await updateVideo(editingItem.id, formData);
        }
        showNotification(`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)} updated successfully!`, 'success');
      } else {
        // Add new item
        if (activeTab === 'photos') {
          await addGalleryItem(formData);
        } else if (activeTab === 'awards') {
          await addAward(formData);
        } else if (activeTab === 'news') {
          await addNewsArticle(formData);
        } else if (activeTab === 'videos') {
          await addVideo(formData);
        }
        showNotification(`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)} added successfully!`, 'success');
      }
      
      setShowForm(false);
      setEditingItem(null);
      await loadData();
    } catch (error) {
      console.error(`Error saving ${activeTab.slice(0, -1)}:`, error);
      showNotification(`Error saving ${activeTab.slice(0, -1)}. Please try again.`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'photos') data = photos;
    else if (activeTab === 'awards') data = awards;
    else if (activeTab === 'news') data = news;
    else if (activeTab === 'videos') data = videos;

    // Search filter
    if (searchTerm) {
      data = data.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter for photos
    if (activeTab === 'photos' && filterCategory !== 'all') {
      data = data.filter(item => item.category === filterCategory);
    }

    return data;
  };

  const renderItemCard = (item) => {
    const getItemImage = () => {
      if (activeTab === 'photos') return item.image_url || item.src;
      if (activeTab === 'awards') return item.image;
      if (activeTab === 'news') return item.image;
      if (activeTab === 'videos') return item.thumbnail;
      return '';
    };

    const getItemDate = () => {
      if (activeTab === 'awards') return item.year;
      if (activeTab === 'news') return new Date(item.date).toLocaleDateString();
      if (activeTab === 'videos') return new Date(item.created_at?.toDate?.() || item.created_at).toLocaleDateString();
      return new Date(item.uploaded_at?.toDate?.() || item.uploaded_at).toLocaleDateString();
    };

    return (
      <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={getItemImage()} 
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {activeTab === 'videos' && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-3">
                <Play className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description || item.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {activeTab === 'awards' && item.organization}
              {activeTab === 'news' && item.source}
              {activeTab === 'photos' && item.category}
              {activeTab === 'videos' && item.duration}
            </span>
            <span>{getItemDate()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
          <p className="text-gray-600 mt-1">Manage photos, awards, videos, and news content</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter (for photos only) */}
            {activeTab === 'photos' && (
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {photoCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
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
          {activeTab === 'photos' && <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          {activeTab === 'awards' && <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          {activeTab === 'videos' && <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          {activeTab === 'news' && <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your {activeTab} collection by adding your first item.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </button>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
          {getFilteredData().map(renderItemCard)}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <GalleryFormModal
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
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
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

  // Update preview when image URL changes (for URL input method)
  useEffect(() => {
    if (uploadMethod === 'url' && formData.image && formData.image.startsWith('http')) {
      setPreviewUrl(formData.image);
    }
  }, [formData.image, uploadMethod]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Different size limits based on active tab
      // Photos: 10MB limit (for add new photo functionality)
      // Awards, Videos, News: 500KB limit
      const isPhotosTab = type === 'photos';
      const maxSizeKB = isPhotosTab ? 10240 : 500; // 10MB for photos, 500KB for others
      const maxSizeBytes = maxSizeKB * 1024;
      
      if (file.size > maxSizeBytes) {
        const sizeLabel = isPhotosTab ? '10MB' : '500KB';
        alert(`File size must be less than ${sizeLabel}`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        // Also update the form data image field for immediate preview
        setFormData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFileToCloudinary = async (file) => {
    // For demo purposes, we'll convert to base64
    // In production, you should use a proper image hosting service like Cloudinary, Firebase Storage, etc.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    /* 
    // Uncomment and configure this for production use with Cloudinary:
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your-upload-preset'); // Set this up in Cloudinary
    formData.append('cloud_name', 'your-cloud-name'); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
    */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      let imageUrl = formData.image;

      // Handle file upload if a file was selected
      if (uploadMethod === 'file' && selectedFile) {
        imageUrl = await uploadFileToCloudinary(selectedFile);
      }

      let submitData = { ...formData, image: imageUrl };
      
      // Prepare data based on type
      if (type === 'photos') {
        submitData = {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          category: formData.category
        };
      } else if (type === 'awards') {
        submitData = {
          title: formData.title,
          description: formData.description,
          image: imageUrl,
          organization: formData.organization,
          year: formData.year
        };
      } else if (type === 'news') {
        submitData = {
          title: formData.title,
          excerpt: formData.excerpt,
          image: imageUrl,
          source: formData.source,
          date: formData.date,
          link: formData.link
        };
      } else if (type === 'videos') {
        submitData = {
          title: formData.title,
          description: formData.description,
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
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const generateThumbnail = () => {
    if (type === 'videos' && formData.youtube_url) {
      const videoId = extractVideoId(formData.youtube_url);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setFormData(prev => ({ ...prev, image: thumbnailUrl }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit' : 'Add New'} {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            
            {/* Upload method toggle for awards and news */}
            {(type === 'awards' || type === 'news' || type === 'photos') && (
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

          {/* Thumbnail for videos */}
          {type === 'videos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Auto-generated from YouTube URL"
              />
            </div>
          )}

          {/* Category (for photos) */}
          {type === 'photos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
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

          {/* Organization (for awards) */}
          {type === 'awards' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Award giving organization"
              />
            </div>
          )}

          {/* Year (for awards) */}
          {type === 'awards' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
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
          )}

          {/* Source and Date (for news) */}
          {type === 'news' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}

          {/* Link (for news) */}
          {type === 'news' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Link
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/article"
              />
            </div>
          )}

          {/* Duration (for videos) */}
          {type === 'videos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
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

export default GalleryManagement;
