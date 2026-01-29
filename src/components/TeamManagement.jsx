import { useState, useCallback, useMemo, memo } from 'react';
import { Plus, Users, Crown, Briefcase, User, MessageCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { sanitizeString } from '../utils/validators';
import LoadingSpinner from './common/LoadingSpinner';
import Button from './common/Button';
import TeamMemberCard from './team/TeamMemberCard';
import TeamMemberFormModal from './team/TeamMemberFormModal';

const CATEGORIES = [
  { id: 'all', label: 'All Members', icon: Users },
  { id: 'founder', label: 'Founders', icon: Crown },
  { id: 'core-team', label: 'Core Team', icon: Briefcase },
  { id: 'volunteer', label: 'Volunteers', icon: User },
  { id: 'community-voice', label: 'Community Voice', icon: MessageCircle }
];

const useLocalStorage = (key, initialValue) => {
  const [data, setData] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setData(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [data, setValue];
};

const CategoryButton = memo(({ category, isActive, count, onClick }) => {
  const Icon = category.icon;
  return (
    <button onClick={() => onClick(category.id)} className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
      isActive ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
    }`}>
      <Icon className="w-4 h-4 mr-2" />
      {category.label}
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
        {count}
      </span>
    </button>
  );
});
CategoryButton.displayName = 'CategoryButton';

const EmptyState = memo(({ onAddNew }) => (
  <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
    <p className="text-gray-600 mb-4">Add your first team member to get started.</p>
    <Button onClick={onAddNew} variant="primary"><Plus className="w-4 h-4 mr-2" />Add First Team Member</Button>
  </div>
));
EmptyState.displayName = 'EmptyState';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useLocalStorage('teamMembers', []);
  const [state, setState] = useState({ showForm: false, editingMember: null, activeCategory: 'all' });
  const { showSuccess, showError } = useNotification();

  const filteredMembers = useMemo(() => 
    state.activeCategory === 'all' ? teamMembers : teamMembers.filter(m => m.category === state.activeCategory),
    [teamMembers, state.activeCategory]
  );

  const categoriesWithCounts = useMemo(() => 
    CATEGORIES.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? teamMembers.length : teamMembers.filter(m => m.category === cat.id).length
    })), [teamMembers]
  );

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      showSuccess('Team member deleted successfully!');
    }
  }, [teamMembers, setTeamMembers, showSuccess]);

  const handleTestimonialToggle = useCallback((id) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, isTestimonial: !m.isTestimonial } : m));
    showSuccess('Testimonial status updated!');
  }, [teamMembers, setTeamMembers, showSuccess]);

  const handleFormSubmit = useCallback(async (formData) => {
    const { editingMember } = state;
    try {
      const memberData = {
        ...formData,
        id: editingMember ? editingMember.id : Date.now(),
        createdAt: editingMember ? editingMember.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedMembers = editingMember 
        ? teamMembers.map(m => m.id === editingMember.id ? memberData : m)
        : [...teamMembers, memberData];

      setTeamMembers(updatedMembers);
      showSuccess(`Team member ${editingMember ? 'updated' : 'added'} successfully!`);
      setState(s => ({ ...s, showForm: false, editingMember: null }));
    } catch (error) {
      console.error('Error saving team member:', error);
      showError('Error saving team member. Please try again.');
    }
  }, [state.editingMember, teamMembers, setTeamMembers, showSuccess, showError]);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  const { showForm, editingMember, activeCategory } = state;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
          <p className="text-gray-600">Manage team members, founders, and volunteers</p>
        </div>
        <Button onClick={() => updateState({ showForm: true, editingMember: null })} variant="primary">
          <Plus className="w-4 h-4 mr-2" />Add Team Member
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categoriesWithCounts.map(cat => (
          <CategoryButton key={cat.id} category={cat} isActive={activeCategory === cat.id} 
            count={cat.count} onClick={(id) => updateState({ activeCategory: id })} />
        ))}
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <EmptyState onAddNew={() => updateState({ showForm: true, editingMember: null })} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <TeamMemberCard key={member.id} member={member}
              onEdit={(m) => updateState({ showForm: true, editingMember: m })}
              onDelete={handleDelete} onTestimonialToggle={handleTestimonialToggle} />
          ))}
        </div>
      )}

      {showForm && <TeamMemberFormModal member={editingMember} onSubmit={handleFormSubmit}
        onCancel={() => updateState({ showForm: false, editingMember: null })} />}
    </div>
  );
};

export default memo(TeamManagement);
