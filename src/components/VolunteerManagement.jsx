import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Send,
  Search,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';
import { getVolunteers, updateVolunteerStatus } from '../services/databaseService';
import { emailService } from '../services/emailService';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailType, setEmailType] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const volunteersData = await getVolunteers();
      
      // Process data to ensure proper formatting and flatten nested structure
      const processedVolunteers = volunteersData.map(volunteer => ({
        ...volunteer,
        // Flatten personal_info
        fullName: volunteer.personal_info?.full_name || '',
        email: volunteer.personal_info?.email || '',
        phone: volunteer.personal_info?.phone || '',
        age: volunteer.personal_info?.age || '',
        occupation: volunteer.personal_info?.occupation || '',
        
        // Flatten address
        address: volunteer.address?.address || '',
        city: volunteer.address?.city || '',
        state: volunteer.address?.state || '',
        pincode: volunteer.address?.pincode || '',
        
        // Flatten skills and interests
        skills: volunteer.skills_and_interests?.skills || [],
        interests: volunteer.skills_and_interests?.other_interests || '',
        preferredBranches: volunteer.skills_and_interests?.preferred_branches || [],
        
        // Flatten availability
        availability: volunteer.availability?.when_available || '',
        timeCommitment: volunteer.availability?.time_commitment || '',
        
        // Flatten experience and motivation
        previousExperience: volunteer.experience_and_motivation?.previous_experience || '',
        whyVolunteer: volunteer.experience_and_motivation?.why_volunteer || '',
        
        // Flatten references and emergency
        references: volunteer.references_and_emergency?.references || '',
        emergencyContact: volunteer.references_and_emergency?.emergency_contact_name || '',
        emergencyPhone: volunteer.references_and_emergency?.emergency_contact_phone || '',
        
        // Map status field
        status: volunteer.application_status || 'pending',
        
        // Handle timestamps
        created_at: volunteer.submitted_at ? new Date(volunteer.submitted_at) : new Date(),
        updated_at: volunteer.updated_at || volunteer.submitted_at ? new Date(volunteer.submitted_at) : new Date()
      }));
      
      setVolunteers(processedVolunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setVolunteers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (volunteerId, newStatus) => {
    try {
      await updateVolunteerStatus(volunteerId, newStatus);
      
      // Update local state
      setVolunteers(volunteers.map(volunteer => 
        volunteer.id === volunteerId 
          ? { ...volunteer, status: newStatus, updated_at: new Date() }
          : volunteer
      ));

      // Send appropriate email based on status
      const volunteer = volunteers.find(v => v.id === volunteerId);
      if (volunteer) {
        handleEmailAction(volunteer, newStatus);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const handleEmailAction = (volunteer, action) => {
    // Get email template from email service
    const emailTemplate = emailService.getEmailTemplate(action, volunteer);
    
    setEmailSubject(emailTemplate.subject);
    setEmailMessage(emailTemplate.message);
    setEmailType(action);
    setSelectedVolunteer(volunteer);
    setShowEmailModal(true);
  };

  const sendEmail = async () => {
    setSendingEmail(true);
    try {
      const result = await emailService.sendVolunteerEmail(
        selectedVolunteer.email,
        emailType,
        selectedVolunteer,
        emailMessage
      );
      
      if (result.success) {
        alert(`Email sent successfully! ${result.fallback ? '(Using fallback mode)' : ''}`);
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailMessage('');
        setSelectedVolunteer(null);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending_info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'pending_info': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
                         volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.phone?.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  const statusCounts = volunteers.reduce((acc, volunteer) => {
    const status = volunteer.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading volunteers...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Volunteer Management</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending ({statusCounts.pending || 0})</option>
            <option value="approved">Approved ({statusCounts.approved || 0})</option>
            <option value="pending_info">Pending Info ({statusCounts.pending_info || 0})</option>
            <option value="rejected">Rejected ({statusCounts.rejected || 0})</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-800">{statusCounts.pending || 0}</div>
              <p className="text-yellow-600">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-800">{statusCounts.approved || 0}</div>
              <p className="text-green-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-800">{statusCounts.pending_info || 0}</div>
              <p className="text-blue-600">Pending Info</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-800">{statusCounts.rejected || 0}</div>
              <p className="text-red-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto max-w-full" style={{scrollbarWidth: 'thin'}}>
          <table className="w-full divide-y divide-gray-200" style={{minWidth: '800px'}}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '200px'}}>
                  Volunteer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '160px'}}>
                  Contact
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '140px'}}>
                  Branches
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px'}}>
                  Skills
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '100px'}}>
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '180px'}}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {volunteer.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {volunteer.age ? `${volunteer.age} years` : ''} • {volunteer.occupation || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{volunteer.email}</div>
                    <div className="text-sm text-gray-500">{volunteer.phone}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm text-gray-900">
                      {volunteer.preferredBranches?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {volunteer.preferredBranches.map((branch, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                              <MapPin size={10} className="mr-1" />
                              {branch.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">No preference</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm text-gray-900">
                      {volunteer.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {skill.length > 8 ? skill.substring(0, 8) + '...' : skill}
                            </span>
                          ))}
                          {volunteer.skills.length > 2 && (
                            <span className="text-xs text-gray-500">+{volunteer.skills.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">No skills</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.status || 'pending')}`}>
                      {getStatusIcon(volunteer.status || 'pending')}
                      <span className="ml-1 capitalize">{(volunteer.status || 'pending').replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </button>
                      {volunteer.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(volunteer.id, 'approved')}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleEmailAction(volunteer, 'pending_info')}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Mail size={14} className="mr-1" />
                        Email
                      </button>
                      {volunteer.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(volunteer.id, 'rejected')}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No volunteer applications have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && !showEmailModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Volunteer Details</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedVolunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedVolunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Age</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.age || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Address</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedVolunteer.address}<br />
                        {selectedVolunteer.city}, {selectedVolunteer.state} - {selectedVolunteer.pincode}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Occupation</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.occupation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Skills and Preferences */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Skills & Preferences</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Skills</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedVolunteer.skills?.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Preferred Branches</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedVolunteer.preferredBranches?.map((branch, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            <MapPin size={14} className="mr-1" />
                            {branch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Other Interests</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.interests || 'None provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Availability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Availability</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedVolunteer.availability}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Time Commitment</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.timeCommitment}</p>
                    </div>
                  </div>
                </div>

                {/* Experience and Motivation */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Experience & Motivation</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Previous Experience</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.previousExperience || 'No previous experience mentioned'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Why Volunteer</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.whyVolunteer}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVolunteer.emergencyPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleEmailAction(selectedVolunteer, 'pending_info')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedVolunteer.id, 'rejected')}
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedVolunteer.id, 'approved')}
                    className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Send Email</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To:</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVolunteer?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message:</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={12}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={sendingEmail}
                  className={`px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 inline-flex items-center ${sendingEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default VolunteerManagement;
