import { useState, useMemo, useCallback, memo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../services/cachedDatabaseService';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useCRUD } from '../hooks/useCRUD';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner, Button } from './common';
import EventCard from './EventCard';
import EventForm from './EventForm';
import EventDetails from './EventDetails';
import { logger } from '../utils/logger';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'community', label: 'Community Service' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'awareness', label: 'Awareness Campaign' },
  { value: 'workshop', label: 'Workshop' }
];

const FilterSelect = memo(({ value, onChange, options, icon: Icon, placeholder }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
    <select value={value} onChange={onChange} className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none`}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
));
FilterSelect.displayName = 'FilterSelect';

const EventManagement = () => {
  const { data: events, loading } = useFirestoreCollection('events', getEvents);
  const { create, update, remove } = useCRUD('events', addEvent, updateEvent, deleteEvent);
  const { showSuccess, showError } = useNotification();
  
  const [state, setState] = useState({ 
    showForm: false, editingEvent: null, viewingEvent: null,
    searchTerm: '', filterStatus: 'all', filterCategory: 'all' 
  });

  const filteredEvents = useMemo(() => {
    const { searchTerm, filterStatus, filterCategory } = state;
    const search = searchTerm.toLowerCase().trim();
    return events.filter(e => {
      const matchesSearch = !search || [e.title, e.description, e.location].some(f => f?.toLowerCase().includes(search));
      const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [events, state.searchTerm, state.filterStatus, state.filterCategory]);

  const handleFormSubmit = useCallback(async (eventData) => {
    const { editingEvent } = state;
    try {
      await (editingEvent ? update(editingEvent.id, eventData) : create(eventData));
      showSuccess(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
      setState(s => ({ ...s, showForm: false, editingEvent: null }));
    } catch (error) {
      logger.error('Error saving event:', error);
      showError('Error saving event. Please try again.');
    }
  }, [state.editingEvent, create, update, showSuccess, showError]);

  const handleDelete = useCallback(async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await remove(event.id);
        showSuccess('Event deleted successfully!');
      } catch (error) {
        logger.error('Error deleting event:', error);
        showError('Error deleting event. Please try again.');
      }
    }
  }, [remove, showSuccess, showError]);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  if (loading) return <LoadingSpinner />;

  const { showForm, editingEvent, viewingEvent, searchTerm, filterStatus, filterCategory } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
          <p className="text-gray-600 mt-1">Manage your organization's events</p>
        </div>
        <Button onClick={() => updateState({ showForm: true, editingEvent: null })} variant="primary">
          <Plus className="w-4 h-4 mr-2" />Add New Event
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search events..." value={searchTerm} maxLength={200}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <FilterSelect value={filterStatus} onChange={(e) => updateState({ filterStatus: e.target.value })} 
            options={STATUS_OPTIONS} icon={Filter} />
          <FilterSelect value={filterCategory} onChange={(e) => updateState({ filterCategory: e.target.value })} 
            options={CATEGORY_OPTIONS} />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No events found</div>
          <p className="text-gray-600">
            {events.length === 0 ? "You haven't created any events yet. Click 'Add New Event' to get started." 
              : "No events match your search criteria. Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} isAdmin onEdit={(e) => updateState({ showForm: true, editingEvent: e })}
              onDelete={handleDelete} onView={(e) => updateState({ viewingEvent: e })} />
          ))}
        </div>
      )}

      {showForm && <EventForm event={editingEvent} onSubmit={handleFormSubmit} 
        onCancel={() => updateState({ showForm: false, editingEvent: null })} />}
      {viewingEvent && <EventDetails event={viewingEvent} onClose={() => updateState({ viewingEvent: null })} />}
    </div>
  );
};

export default memo(EventManagement);
