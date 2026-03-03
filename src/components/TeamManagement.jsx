import { useState, useCallback, useMemo, memo } from 'react';
import { Plus, Users, Crown, Briefcase, User, MessageCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './common/LoadingSpinner';
import Button from './common/Button';
import TeamMemberCard from './team/TeamMemberCard';
import TeamMemberFormModal from './team/TeamMemberFormModal';
import {
  useTeamMembers,
  useAddTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember
} from '../hooks/useFirebaseQueries';

const CATEGORIES = [
  { id: 'all', label: 'All Members', icon: Users },
  { id: 'founder', label: 'Founders', icon: Crown },
  { id: 'core-team', label: 'Core Team', icon: Briefcase },
  { id: 'volunteer', label: 'Volunteers', icon: User },
  { id: 'community-voice', label: 'Community Voice', icon: MessageCircle }
];

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
  const { data: teamMembers = [], isLoading } = useTeamMembers();
  const addMember = useAddTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
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
      deleteMember.mutate(id, {
        onSuccess: () => showSuccess('Team member deleted successfully!'),
        onError: () => showError('Failed to delete team member. Please try again.')
      });
    }
  }, [deleteMember, showSuccess, showError]);

  const handleTestimonialToggle = useCallback((id) => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;
    updateMember.mutate(
      { memberId: id, updateData: { isTestimonial: !member.isTestimonial } },
      {
        onSuccess: () => showSuccess('Testimonial status updated!'),
        onError: () => showError('Failed to update testimonial status.')
      }
    );
  }, [teamMembers, updateMember, showSuccess, showError]);

  const handleFormSubmit = useCallback(async (formData) => {
    const { editingMember } = state;
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ memberId: editingMember.id, updateData: formData });
        showSuccess('Team member updated successfully!');
      } else {
        await addMember.mutateAsync({ ...formData, order: teamMembers.length });
        showSuccess('Team member added successfully!');
      }
      setState(s => ({ ...s, showForm: false, editingMember: null }));
    } catch (error) {
      console.error('Error saving team member:', error);
      showError('Error saving team member. Please try again.');
    }
  }, [state.editingMember, teamMembers.length, addMember, updateMember, showSuccess, showError]);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  if (isLoading) return <LoadingSpinner />;

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
