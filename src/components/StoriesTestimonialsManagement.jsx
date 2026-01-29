import { useState, useCallback, useMemo, memo } from 'react';
import { Plus, Search, Star, Quote } from 'lucide-react';
import {
  addSuccessStory, updateSuccessStory, deleteSuccessStory,
  addTestimonial, updateTestimonial, deleteTestimonial
} from '../services/cachedDatabaseService';
import { useNotification } from '../context/NotificationContext';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useCRUD } from '../hooks/useCRUD';
import { sanitizeString } from '../utils/validators';
import LoadingSpinner from './common/LoadingSpinner';
import Button from './common/Button';
import StoryTestimonialCard from './stories/StoryTestimonialCard';
import StoryTestimonialFormModal from './stories/StoryTestimonialFormModal';

const TABS = [
  { id: 'stories', label: 'Success Stories', icon: Star },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
];

const TAB_CONFIG = {
  stories: { collection: 'success_stories', addData: addSuccessStory, updateData: updateSuccessStory, deleteData: deleteSuccessStory, singular: 'Success Story', plural: 'Success Stories' },
  testimonials: { collection: 'testimonials', addData: addTestimonial, updateData: updateTestimonial, deleteData: deleteTestimonial, singular: 'Testimonial', plural: 'Testimonials' }
};

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

const EmptyState = memo(({ activeTab, singular, plural, onAddNew }) => {
  const Icon = activeTab === 'stories' ? Star : Quote;
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {plural} yet</h3>
      <p className="text-gray-600 mb-4">Start building your {plural.toLowerCase()} collection by adding your first item.</p>
      <Button onClick={onAddNew} variant="primary"><Plus className="w-4 h-4 mr-2" />Add First {singular}</Button>
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

const StoriesTestimonialsManagement = () => {
  const [state, setState] = useState({ activeTab: 'stories', showForm: false, editingItem: null, searchTerm: '' });
  const { showSuccess, showError } = useNotification();

  // Fetch data for both tabs
  const { data: storiesData, loading: loadingStories } = useFirestoreCollection('success_stories');
  const { data: testimonialsData, loading: loadingTestimonials } = useFirestoreCollection('testimonials');

  const allTabsData = { stories: storiesData, testimonials: testimonialsData };
  const allLoadingStates = { stories: loadingStories, testimonials: loadingTestimonials };

  const tabConfig = TAB_CONFIG[state.activeTab];
  const items = allTabsData[state.activeTab] || [];
  const loading = allLoadingStates[state.activeTab];

  const { create, update, remove } = useCRUD(tabConfig.collection, tabConfig.addData, tabConfig.updateData, tabConfig.deleteData);

  const filteredData = useMemo(() => {
    const search = sanitizeString(state.searchTerm).toLowerCase().trim();
    if (!search) return items;
    return items.filter(item => 
      [item.name, item.title, item.story, item.quote, item.achievement, item.role]
        .some(f => f?.toLowerCase().includes(search))
    );
  }, [items, state.searchTerm]);

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
  }, [state.editingItem, state.activeTab, create, update, showSuccess, showError, tabConfig.singular]);

  const handleDelete = useCallback(async (item) => {
    if (window.confirm(`Are you sure you want to delete "${sanitizeString(item.name || item.title)}"? This action cannot be undone.`)) {
      try {
        const result = await remove(item.id);
        if (result.success) {
          showSuccess(`${tabConfig.singular} deleted successfully!`);
        } else {
          showError(result.error || `Error deleting ${tabConfig.singular}. Please try again.`);
        }
      } catch (error) {
        console.error(`Error deleting ${state.activeTab}:`, error);
        showError(`Error deleting ${tabConfig.singular}. Please try again.`);
      }
    }
  }, [remove, showSuccess, showError, state.activeTab, tabConfig.singular]);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  const { activeTab, showForm, editingItem, searchTerm } = state;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stories & Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage success stories and testimonials</p>
        </div>
        <Button onClick={() => updateState({ showForm: true, editingItem: null })} variant="primary">
          <Plus className="w-4 h-4 mr-2" />Add New {tabConfig.singular}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {TABS.map(tab => (
            <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} 
              count={allTabsData[tab.id]?.length || 0} 
              onClick={(id) => updateState({ activeTab: id, searchTerm: '' })} />
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} maxLength={200}
            onChange={(e) => updateState({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
      </div>

      {/* Content */}
      {loading ? <LoadingSpinner message={`Loading ${activeTab}...`} /> : filteredData.length === 0 ? (
        <EmptyState activeTab={activeTab} singular={tabConfig.singular} plural={tabConfig.plural}
          onAddNew={() => updateState({ showForm: true, editingItem: null })} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(item => (
            <StoryTestimonialCard key={item.id} item={item} type={activeTab}
              onEdit={(i) => updateState({ showForm: true, editingItem: i })} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && <StoryTestimonialFormModal type={activeTab} item={editingItem} 
        onSubmit={handleFormSubmit} onCancel={() => updateState({ showForm: false, editingItem: null })} />}
    </div>
  );
};

export default memo(StoriesTestimonialsManagement);
