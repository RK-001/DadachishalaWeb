import { useState, useCallback, useMemo, memo } from 'react';
import { Plus, Search, Filter, Grid, List, ImageIcon, Trophy, Play, ExternalLink } from 'lucide-react';
import { 
  getGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem,
  getAwards, addAward, updateAward, deleteAward,
  getNewsArticles, addNewsArticle, updateNewsArticle, deleteNewsArticle,
  getVideos, addVideo, updateVideo, deleteVideo
} from '../services/cachedDatabaseService';
import { useNotification } from '../context/NotificationContext';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useCRUD } from '../hooks/useCRUD';
import LoadingSpinner from './common/LoadingSpinner';
import Button from './common/Button';
import GalleryItemCard from './gallery/GalleryItemCard';
import GalleryFormModal from './gallery/GalleryFormModal';

const TABS = [
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'videos', label: 'Videos', icon: Play },
  { id: 'news', label: 'News & Media', icon: ExternalLink },
];

const PHOTO_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'home-slider', label: 'Home Slider' },
  { value: 'activities', label: 'Activities' },
  { value: 'events', label: 'Events' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'community', label: 'Community Service' },
  { value: 'achievements', label: 'Achievements' }
];

const TAB_CONFIG = {
  photos: { collection: 'gallery', getData: getGalleryItems, addData: addGalleryItem, updateData: updateGalleryItem, deleteData: deleteGalleryItem, singular: 'Photo' },
  awards: { collection: 'awards', getData: getAwards, addData: addAward, updateData: updateAward, deleteData: deleteAward, singular: 'Award' },
  videos: { collection: 'videos', getData: getVideos, addData: addVideo, updateData: updateVideo, deleteData: deleteVideo, singular: 'Video' },
  news: { collection: 'news', getData: getNewsArticles, addData: addNewsArticle, updateData: updateNewsArticle, deleteData: deleteNewsArticle, singular: 'News Article' }
};

// Tab Button Component
const TabButton = memo(({ tab, isActive, count, onClick }) => {
  const Icon = tab.icon;
  return (
    <button onClick={() => onClick(tab.id)} className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
      isActive ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
    }`}>
      <Icon className="w-5 h-5" />
      <span>{tab.label}</span>
      <span className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-white bg-opacity-20' : 'bg-gray-200'}`}>{count}</span>
    </button>
  );
});
TabButton.displayName = 'TabButton';

// Empty State Component
const EmptyState = memo(({ activeTab, singular, onAddNew }) => {
  const Icon = TABS.find(tab => tab.id === activeTab)?.icon || ImageIcon;
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} yet</h3>
      <p className="text-gray-600 mb-4">Start building your {activeTab} collection by adding your first item.</p>
      <Button onClick={onAddNew} variant="primary"><Plus className="w-4 h-4 mr-2" />Add First {singular}</Button>
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

const GalleryManagement = () => {
  const [state, setState] = useState({ 
    activeTab: 'photos', showForm: false, editingItem: null, 
    searchTerm: '', filterCategory: 'all', viewMode: 'grid' 
  });
  const { showSuccess, showError } = useNotification();

  // Fetch data for all tabs to get counts
  const { data: photosData, loading: loadingPhotos } = useFirestoreCollection('gallery');
  const { data: awardsData, loading: loadingAwards } = useFirestoreCollection('awards');
  const { data: videosData, loading: loadingVideos } = useFirestoreCollection('videos');
  const { data: newsData, loading: loadingNews } = useFirestoreCollection('news');

  const allTabsData = { photos: photosData, awards: awardsData, videos: videosData, news: newsData };
  const allLoadingStates = { photos: loadingPhotos, awards: loadingAwards, videos: loadingVideos, news: loadingNews };
  
  const tabConfig = TAB_CONFIG[state.activeTab];
  const items = allTabsData[state.activeTab] || [];
  const loading = allLoadingStates[state.activeTab];
  
  const { create, update, remove } = useCRUD(tabConfig.collection, tabConfig.addData, tabConfig.updateData, tabConfig.deleteData);

  const filteredData = useMemo(() => {
    const { searchTerm, filterCategory, activeTab } = state;
    const search = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      const matchesSearch = !search || [item.title, item.description, item.organization, item.source].some(f => f?.toLowerCase().includes(search));
      const matchesCategory = activeTab !== 'photos' || filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, state.searchTerm, state.filterCategory, state.activeTab]);

  const handleFormSubmit = useCallback(async (formData) => {
    const { editingItem, activeTab } = state;
    try {
      const result = await (editingItem ? update(editingItem.id, formData) : create(formData));
      
      if (result.success) {
        showSuccess(`${tabConfig.singular} ${editingItem ? 'updated' : 'added'} successfully!`);
        setState(s => ({ ...s, showForm: false, editingItem: null }));
      } else {
        showError(result.error || `Error saving ${tabConfig.singular}. Please try again.`);
      }
    } catch (error) {
      console.error(`Error saving ${activeTab}:`, error);
      showError(`Error saving ${tabConfig.singular}. Please try again.`);
    }
  }, [state.editingItem, state.activeTab, create, update, showSuccess, showError, tabConfig.singular, tabConfig]);

  const handleDelete = useCallback(async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      try {
        await remove(item.id);
        showSuccess(`${tabConfig.singular} deleted successfully!`);
      } catch (error) {
        console.error(`Error deleting ${state.activeTab}:`, error);
        showError(`Error deleting ${tabConfig.singular}. Please try again.`);
      }
    }
  }, [remove, showSuccess, showError, state.activeTab, tabConfig.singular]);

  const handleTabChange = useCallback((tabId) => {
    setState(s => ({ ...s, activeTab: tabId, searchTerm: '', filterCategory: 'all' }));
  }, []);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  const { activeTab, showForm, editingItem, searchTerm, filterCategory, viewMode } = state;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
          <p className="text-gray-600 mt-1">Manage photos, awards, videos, and news content</p>
        </div>
        <Button onClick={() => updateState({ showForm: true, editingItem: null })} variant="primary">
          <Plus className="w-4 h-4 mr-2" />Add New {tabConfig.singular}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {TABS.map(tab => <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} count={allTabsData[tab.id]?.length || 0} onClick={handleTabChange} />)}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} maxLength={200}
                onChange={(e) => updateState({ searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            {activeTab === 'photos' && (
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select value={filterCategory} onChange={(e) => updateState({ filterCategory: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  {PHOTO_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => updateState({ viewMode: 'grid' })} className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => updateState({ viewMode: 'list' })} className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? <LoadingSpinner message={`Loading ${activeTab}...`} /> : filteredData.length === 0 ? (
        <EmptyState activeTab={activeTab} singular={tabConfig.singular} onAddNew={() => updateState({ showForm: true, editingItem: null })} />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredData.map(item => (
            <GalleryItemCard key={item.id} item={item} type={activeTab} 
              onEdit={(i) => updateState({ showForm: true, editingItem: i })} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && <GalleryFormModal type={activeTab} item={editingItem} onSubmit={handleFormSubmit} 
        onCancel={() => updateState({ showForm: false, editingItem: null })} />}
    </div>
  );
};

export default memo(GalleryManagement);
