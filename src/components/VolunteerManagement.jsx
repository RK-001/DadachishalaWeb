import { useState, useMemo, useCallback, memo } from 'react';
import { Users, Mail, CheckCircle, XCircle, Clock, Eye, Search, User } from 'lucide-react';
import { updateVolunteerStatus } from '../services/cachedDatabaseService';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useNotification } from '../context/NotificationContext';
import { sanitizeString } from '../utils/validators';
import { Modal, LoadingSpinner, Button } from './common';
import { emailService } from '../services/emailService';
import { logger } from '../utils/logger';

const StatusBadge = memo(({ status }) => {
  const config = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
  };
  const { color, icon: Icon, label } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4 mr-1" />{label}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatCard = memo(({ label, value, color }) => (
  <div className={`${color} rounded-lg p-4`}>
    <p className="text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
));
StatCard.displayName = 'StatCard';

const InfoRow = memo(({ label, value }) => (
  <div><span className="font-medium">{label}:</span> {value || 'N/A'}</div>
));
InfoRow.displayName = 'InfoRow';

const VolunteerDetailModal = memo(({ volunteer, isOpen, onClose, onStatusUpdate, onSendEmail }) => {
  if (!volunteer) return null;

  const personal = volunteer.personal_info || {};
  const skills = volunteer.skills_and_interests || {};
  const availability = volunteer.availability || {};
  const experience = volunteer.experience_and_motivation || {};
  const emergency = volunteer.references_and_emergency || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Volunteer Application Details" size="large">
      <div className="space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <InfoRow label="Name" value={personal.full_name} />
            <InfoRow label="Email" value={personal.email} />
            <InfoRow label="Phone" value={personal.phone} />
            <InfoRow label="Age" value={personal.age} />
            <InfoRow label="Occupation" value={personal.occupation} />
            <div><span className="font-medium">Status:</span> <StatusBadge status={volunteer.application_status || volunteer.status} /></div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Interests</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <InfoRow label="Skills" value={skills.skills?.join(', ')} />
            <InfoRow label="Interests" value={skills.other_interests} />
            <InfoRow label="Preferred Branches" value={skills.preferred_branches?.join(', ')} />
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <InfoRow label="When Available" value={availability.when_available} />
            <InfoRow label="Time Commitment" value={availability.time_commitment} />
          </div>
        </div>

        {/* Experience & Motivation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience & Motivation</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><span className="font-medium">Previous Experience:</span> <p className="mt-1">{experience.previous_experience || 'N/A'}</p></div>
            <div><span className="font-medium">Why Volunteer:</span> <p className="mt-1">{experience.why_volunteer || 'N/A'}</p></div>
          </div>
        </div>

        {/* Emergency Contact & References */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact & References</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <InfoRow label="Emergency Contact Name" value={emergency.emergency_contact_name} />
            <InfoRow label="Emergency Contact Phone" value={emergency.emergency_contact_phone} />
            <InfoRow label="References" value={emergency.references} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={() => onSendEmail(volunteer)} variant="secondary">
            <Mail className="w-4 h-4 mr-2" />Send Email
          </Button>
          {(volunteer.application_status === 'pending' || volunteer.status === 'pending') && (
            <>
              <Button onClick={() => onStatusUpdate(volunteer.id, 'rejected')} variant="danger">
                <XCircle className="w-4 h-4 mr-2" />Reject
              </Button>
              <Button onClick={() => onStatusUpdate(volunteer.id, 'approved')} variant="success">
                <CheckCircle className="w-4 h-4 mr-2" />Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
});
VolunteerDetailModal.displayName = 'VolunteerDetailModal';

const EmailModal = memo(({ isOpen, onClose, emailData, onChange, onSend, sending }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Send Email">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
        <input type="text" value={emailData.volunteer?.email || ''} disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
        <input type="text" value={emailData.subject} maxLength={200}
          onChange={(e) => onChange({ ...emailData, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
        <textarea rows={6} value={emailData.message} maxLength={2000}
          onChange={(e) => onChange({ ...emailData, message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="flex justify-end space-x-3">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button onClick={onSend} disabled={sending} variant="primary">
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </div>
  </Modal>
));
EmailModal.displayName = 'EmailModal';

const VolunteerManagement = () => {
  const { data: volunteers, loading } = useFirestoreCollection('volunteers');
  const { showSuccess, showError } = useNotification();
  
  const [state, setState] = useState({
    selectedVolunteer: null,
    statusFilter: 'all',
    searchTerm: '',
    showEmailModal: false,
    emailData: { subject: '', message: '', volunteer: null },
    sendingEmail: false
  });

  const filteredVolunteers = useMemo(() => {
    const search = sanitizeString(state.searchTerm).toLowerCase();
    return volunteers.filter(v => {
      const status = v.application_status || v.status;
      const matchesStatus = state.statusFilter === 'all' || status === state.statusFilter;
      const matchesSearch = !search || 
        v.personal_info?.full_name?.toLowerCase().includes(search) ||
        v.personal_info?.email?.toLowerCase().includes(search) ||
        v.personal_info?.phone?.includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [volunteers, state.statusFilter, state.searchTerm]);

  const stats = useMemo(() => ({
    total: volunteers.length,
    pending: volunteers.filter(v => (v.application_status || v.status) === 'pending').length,
    approved: volunteers.filter(v => (v.application_status || v.status) === 'approved').length,
    rejected: volunteers.filter(v => (v.application_status || v.status) === 'rejected').length
  }), [volunteers]);

  const handleStatusUpdate = useCallback(async (volunteerId, newStatus) => {
    try {
      await updateVolunteerStatus(volunteerId, newStatus);
      showSuccess(`Volunteer ${newStatus}!`);
      setState(s => ({ ...s, selectedVolunteer: null }));
      
      // Send status email in background (don't block or show errors if email fails)
      if (newStatus === 'approved' || newStatus === 'rejected') {
        const volunteer = volunteers.find(v => v.id === volunteerId);
        if (volunteer) {
          const email = volunteer.personal_info?.email || volunteer.email;
          const name = volunteer.personal_info?.full_name || volunteer.fullName;
          const branches = volunteer.skills_and_interests?.preferred_branches || [];
          emailService.sendVolunteerEmail(email, newStatus, {
            fullName: name,
            preferredBranches: branches
          }).catch(err => {
            logger.error('Email notification failed (status was updated successfully):', err);
          });
        }
      }
    } catch (error) {
      logger.error('Error updating volunteer status:', error);
      showError('Failed to update status');
    }
  }, [volunteers, showSuccess, showError]);

  const handleSendEmail = useCallback((volunteer) => {
    setState(s => ({
      ...s,
      emailData: { subject: '', message: '', volunteer },
      selectedVolunteer: null,
      showEmailModal: true
    }));
  }, []);

  const handleSendCustomEmail = useCallback(async () => {
    const { emailData } = state;
    if (!emailData.subject || !emailData.message || !emailData.volunteer) return;
    
    try {
      setState(s => ({ ...s, sendingEmail: true }));
      const volunteerEmail = emailData.volunteer.personal_info?.email || emailData.volunteer.email;
      await emailService.sendCustomEmail(
        volunteerEmail,
        sanitizeString(emailData.subject),
        sanitizeString(emailData.message)
      );
      showSuccess('Email sent successfully!');
      setState(s => ({ ...s, showEmailModal: false, emailData: { subject: '', message: '', volunteer: null }, sendingEmail: false }));
    } catch (error) {
      logger.error('Error sending email:', error);
      showError('Failed to send email');
      setState(s => ({ ...s, sendingEmail: false }));
    }
  }, [state.emailData, showSuccess, showError]);

  const updateState = useCallback((updates) => setState(s => ({ ...s, ...updates })), []);

  if (loading) return <LoadingSpinner />;

  const { selectedVolunteer, statusFilter, searchTerm, showEmailModal, emailData, sendingEmail } = state;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
          <Users className="w-6 h-6 mr-2 text-primary-600" />Volunteer Management
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="bg-blue-100 text-blue-800" />
          <StatCard label="Pending" value={stats.pending} color="bg-yellow-100 text-yellow-800" />
          <StatCard label="Approved" value={stats.approved} color="bg-green-100 text-green-800" />
          <StatCard label="Rejected" value={stats.rejected} color="bg-red-100 text-red-800" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search volunteers..." value={searchTerm} maxLength={100}
              onChange={(e) => updateState({ searchTerm: e.target.value })}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <select value={statusFilter} onChange={(e) => updateState({ statusFilter: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredVolunteers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVolunteers.map((volunteer) => {
                  const personal = volunteer.personal_info || {};
                  const skills = volunteer.skills_and_interests || {};
                  return (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{personal.full_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{personal.occupation || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>{personal.email || 'N/A'}</div>
                        <div className="text-gray-500">{personal.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {skills.skills?.slice(0, 2).join(', ') || 'N/A'}
                        {skills.skills?.length > 2 && ' +more'}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={volunteer.application_status || volunteer.status} /></td>
                      <td className="px-6 py-4">
                        <Button onClick={() => updateState({ selectedVolunteer: volunteer })} variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <VolunteerDetailModal volunteer={selectedVolunteer} isOpen={!!selectedVolunteer}
        onClose={() => updateState({ selectedVolunteer: null })} onStatusUpdate={handleStatusUpdate} onSendEmail={handleSendEmail} />

      <EmailModal isOpen={showEmailModal} onClose={() => updateState({ showEmailModal: false })}
        emailData={emailData} onChange={(data) => updateState({ emailData: data })} 
        onSend={handleSendCustomEmail} sending={sendingEmail} />
    </div>
  );
};

export default memo(VolunteerManagement);
