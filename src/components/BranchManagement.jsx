import { useState, useCallback, useId, memo } from 'react';
import { Plus, Save, X, MapPin } from 'lucide-react';
import { getBranches, addBranch, updateBranch, deleteBranch } from '../services/cachedDatabaseService';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useCRUD } from '../hooks/useCRUD';
import { LoadingSpinner, Button, Modal } from './common';
import { sanitizeObject } from '../utils/sanitization';
import { logger } from '../utils/logger';
import { uploadImage, validateImageFile } from '../services/imageUploadService';
import Card from './Card';
import ImageUpload from './ImageUpload';

// Constants moved outside component to prevent recreation
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_TIMING = { start: '09:00', end: '17:00', isOpen: true };
const DEFAULT_TIMINGS = Object.fromEntries(
  DAYS.map(day => [day, { ...DEFAULT_TIMING, isOpen: day !== 'sunday' }])
);
const INITIAL_FORM_STATE = {
  branch_name: '', description: '', location: '', imageURL: '',
  student_count: 0, school_timings: DEFAULT_TIMINGS
};
const INPUT_CLASS = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191947] focus:border-transparent";
const TIME_INPUT_CLASS = "px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#191947]";

// Timing Row - optimized with useId pattern
const TimingRow = memo(({ day, timing, onChange, id }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
    <span className="min-w-[100px] font-medium text-gray-700 capitalize">{day}</span>
    <label htmlFor={`${id}-open`} className="flex items-center gap-2">
      <input id={`${id}-open`} type="checkbox" checked={timing.isOpen}
        onChange={(e) => onChange(day, 'isOpen', e.target.checked)}
        className="rounded border-gray-300 text-[#191947] focus:ring-[#191947]" />
      <span className="text-sm text-gray-600">Open</span>
    </label>
    {timing.isOpen ? (
      <>
        <label htmlFor={`${id}-start`} className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Start:</span>
          <input id={`${id}-start`} type="time" value={timing.start}
            onChange={(e) => onChange(day, 'start', e.target.value)} className={TIME_INPUT_CLASS} />
        </label>
        <label htmlFor={`${id}-end`} className="flex items-center gap-2">
          <span className="text-sm text-gray-600">End:</span>
          <input id={`${id}-end`} type="time" value={timing.end}
            onChange={(e) => onChange(day, 'end', e.target.value)} className={TIME_INPUT_CLASS} />
        </label>
      </>
    ) : <span className="text-sm text-gray-500 italic">Closed</span>}
  </div>
));
TimingRow.displayName = 'TimingRow';

// Empty State Component
const EmptyState = memo(({ onAdd }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <MapPin size={32} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-600 mb-2">No branches found</h3>
    <p className="text-gray-500 mb-6">Get started by adding your first branch</p>
    <Button onClick={onAdd} variant="primary"><Plus size={20} className="mr-2" />Add First Branch</Button>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Form Field Component - reduces repetition
const FormField = memo(({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required && ' *'}</label>
    {children}
  </div>
));
FormField.displayName = 'FormField';

const BranchManagement = () => {
  const formId = useId();
  const { data: branches, loading, refetch } = useFirestoreCollection('branches', getBranches);
  const { create, update, remove } = useCRUD('branches', addBranch, updateBranch, deleteBranch, refetch);
  
  const [state, setState] = useState({ showForm: false, editing: null, uploading: false });
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Math.max(0, Math.min(10000, parseInt(value) || 0)) : value
    }));
  }, []);

  const handleTimingChange = useCallback((day, field, value) => {
    setFormData(prev => ({
      ...prev,
      school_timings: { ...prev.school_timings, [day]: { ...prev.school_timings[day], [field]: value } }
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setImageFile(null);
    setState({ showForm: false, editing: null, uploading: false });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { branch_name, location, description } = formData;
    
    if (![branch_name, location, description].every(f => f?.trim())) {
      alert('Please fill in all required fields');
      return;
    }

    setState(s => ({ ...s, uploading: true }));
    try {
      let imageURL = formData.imageURL;
      if (imageFile) {
        const validation = validateImageFile(imageFile);
        if (!validation.isValid) {
          alert(validation.errors.join(', '));
          setState(s => ({ ...s, uploading: false }));
          return;
        }
        imageURL = await uploadImage(imageFile, 'branches');
      }

      // Sanitize all string fields before saving (security)
      const branchData = sanitizeObject({
        ...formData,
        imageURL,
        student_count: Number(formData.student_count)
      });

      await (state.editing ? update(state.editing.id, branchData) : create(branchData));
      resetForm();
    } catch (error) {
      logger.error('Error saving branch:', error);
      alert('Error saving branch. Please try again.');
      setState(s => ({ ...s, uploading: false }));
    }
  }, [formData, imageFile, state.editing, update, create, resetForm]);

  const handleEdit = useCallback((branch) => {
    setState({ showForm: true, editing: branch, uploading: false });
    setFormData({
      ...branch,
      student_count: branch.student_count || 0,
      school_timings: branch.school_timings || DEFAULT_TIMINGS
    });
  }, []);

  const handleDelete = useCallback(async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) await remove(branchId);
  }, [remove]);

  const openForm = useCallback(() => setState(s => ({ ...s, showForm: true })), []);

  if (loading) return <LoadingSpinner />;

  const { showForm, editing, uploading } = state;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#191947]">Branch Management</h2>
        <Button onClick={openForm} variant="primary"><Plus className="w-4 h-4 mr-2" />Add New Branch</Button>
      </div>

      <Modal isOpen={showForm} onClose={resetForm} title={editing ? 'Edit Branch' : 'Add New Branch'} size="large">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Branch Name" required>
              <input type="text" name="branch_name" value={formData.branch_name}
                onChange={handleInputChange} required className={INPUT_CLASS}
                placeholder="Enter branch name" maxLength={100} autoComplete="organization" />
            </FormField>
            <FormField label="Location" required>
              <input type="text" name="location" value={formData.location}
                onChange={handleInputChange} required className={INPUT_CLASS}
                placeholder="Enter location" maxLength={200} autoComplete="address-level2" />
            </FormField>
          </div>

          <FormField label="Description" required>
            <textarea name="description" value={formData.description}
              onChange={handleInputChange} required rows={4} className={INPUT_CLASS}
              placeholder="Enter branch description" maxLength={500} />
          </FormField>

          <FormField label="Student Count">
            <input type="number" name="student_count" value={formData.student_count}
              onChange={handleInputChange} min="0" max="10000" className={INPUT_CLASS}
              placeholder="Enter number of students" inputMode="numeric" />
          </FormField>

          <FormField label="School Timings">
            <div className="space-y-3">
              {DAYS.map(day => (
                <TimingRow key={day} day={day} timing={formData.school_timings[day]}
                  onChange={handleTimingChange} id={`${formId}-${day}`} />
              ))}
            </div>
          </FormField>

          <FormField label="Branch Image">
            <ImageUpload onImageSelect={setImageFile} onImageRemove={() => setImageFile(null)}
              currentImage={formData.imageURL} disabled={uploading} />
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={uploading} variant="primary">
              <Save size={20} className="mr-2" />
              {uploading ? 'Saving...' : editing ? 'Update Branch' : 'Add Branch'}
            </Button>
            <Button type="button" onClick={resetForm} variant="secondary">
              <X size={20} className="mr-2" />Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {branches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <Card key={branch.id} data={branch} type="branch" index={index}
              showActions showDetailedInfo={false} onEdit={handleEdit}
              onDelete={handleDelete} className="h-full" />
          ))}
        </div>
      ) : <EmptyState onAdd={openForm} />}
    </div>
  );
};

export default memo(BranchManagement);
