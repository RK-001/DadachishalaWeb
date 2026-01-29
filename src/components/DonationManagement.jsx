import { useState, useMemo, useCallback, memo } from 'react';
import { Eye, Check, X, User, Heart, FileText, ExternalLink, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { getDonations, updateDonationStatus } from '../services/cachedDatabaseService';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Modal, LoadingSpinner, Button } from './common';
import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/sanitization';

const STATUS_CONFIG = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
};

const formatDate = (timestamp) => timestamp?.toDate?.() ? timestamp.toDate().toLocaleDateString() : new Date(timestamp).toLocaleDateString();

// Reusable info field component
const InfoField = memo(({ label, value, className = '' }) => value ? (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className={`text-gray-900 ${className}`}>{sanitizeString(String(value))}</p>
  </div>
) : null);
InfoField.displayName = 'InfoField';

const StatusBadge = memo(({ status }) => {
  const { color, icon: Icon } = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-4 h-4" /><span className="ml-1 capitalize">{status}</span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const DonationDetailModal = memo(({ donation, isOpen, onClose, onStatusUpdate, onGenerateReceipt, isProcessing }) => {
  if (!donation) return null;

  const fullName = [donation.firstName, donation.middleName, donation.lastName].filter(Boolean).join(' ');
  const donorFields = [
    { label: 'Name', value: fullName },
    { label: 'Email', value: donation.email },
    { label: 'Phone', value: donation.phone },
    { label: 'Address', value: donation.address },
    { label: 'Notes', value: donation.notes }
  ];
  const donationFields = [
    { label: 'Amount', value: `₹${donation.amount?.toLocaleString()}`, className: 'font-semibold text-lg' },
    { label: 'Category', value: donation.category },
    { label: 'Frequency', value: donation.frequency },
    { label: 'Submitted Date', value: formatDate(donation.createdAt) }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donation Details" size="large">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Donor Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {donorFields.map(field => <InfoField key={field.label} {...field} />)}
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Donation Information</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {donationFields.map(field => <InfoField key={field.label} {...field} />)}
            <div><label className="text-sm font-medium text-gray-600">Status</label><StatusBadge status={donation.status} /></div>
          </div>
        </div>
      </div>

      {donation.screenshotURL && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Screenshot</h4>
          <div className="border rounded-lg p-4 bg-gray-50">
            <img src={donation.screenshotURL} alt="Payment Screenshot" className="max-w-full h-auto max-h-96 mx-auto rounded border" />
            <div className="mt-3 flex justify-center">
              <a href={donation.screenshotURL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-800">
                <ExternalLink className="w-4 h-4 mr-1" />View Full Size
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        {donation.status === 'pending' ? (
          <>
            <Button onClick={() => onStatusUpdate(donation.id, 'rejected')} disabled={isProcessing} variant="danger">
              <X className="w-4 h-4 mr-2" />Reject
            </Button>
            <Button onClick={() => onStatusUpdate(donation.id, 'approved')} disabled={isProcessing} variant="success">
              {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Check className="w-4 h-4 mr-2" />}
              Approve & Send Receipt
            </Button>
          </>
        ) : donation.status === 'approved' && (
          <Button onClick={() => onGenerateReceipt(donation)} variant="primary">
            <FileText className="w-4 h-4 mr-2" />Download & Email Receipt
          </Button>
        )}
      </div>
    </Modal>
  );
});
DonationDetailModal.displayName = 'DonationDetailModal';

// Donation Table Row Component
const DonationRow = memo(({ donation, onView }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{sanitizeString(`${donation.firstName || ''} ${donation.lastName || ''}`)}</div>
          <div className="text-sm text-gray-500">{sanitizeString(donation.email)}</div>
          <div className="text-sm text-gray-500">{donation.phone}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">₹{donation.amount?.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{donation.category}</div>
      <div className="text-sm text-gray-400">{donation.frequency}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(donation.createdAt)}</td>
    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={donation.status} /></td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button onClick={() => onView(donation.id)} className="text-primary-600 hover:text-primary-900 flex items-center space-x-1">
        <Eye className="w-4 h-4" /><span>View</span>
      </button>
    </td>
  </tr>
));
DonationRow.displayName = 'DonationRow';

// Empty State Component
const EmptyState = memo(({ hasFilters }) => (
  <div className="text-center py-12">
    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
    <p className="text-gray-500">{hasFilters ? 'Try adjusting your search or filter criteria' : 'No donations have been submitted yet'}</p>
  </div>
));
EmptyState.displayName = 'EmptyState';

const DonationManagement = () => {
  const { data: donations, loading } = useFirestoreCollection('donations', getDonations);
  const [state, setState] = useState({ searchTerm: '', statusFilter: 'all', selectedDonation: null, isModalOpen: false, isProcessing: false });

  const filteredDonations = useMemo(() => {
    const { searchTerm, statusFilter } = state;
    const search = searchTerm.toLowerCase().trim();
    return donations.filter(d => {
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesSearch = !search || [d.firstName, d.lastName, d.email, d.phone, d.category].some(f => f?.toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [donations, state.searchTerm, state.statusFilter]);

  const generateAndSendReceipt = useCallback(async (donation) => {
    setState(s => ({ ...s, isProcessing: true }));
    try {
      const donationData = {
        name: [donation.firstName, donation.lastName].filter(Boolean).join(' '),
        email: donation.email,
        phone: donation.phone || donation.phoneNumber,
        amount: donation.amount,
        paymentMethod: donation.paymentMethod || 'Online',
        paymentId: donation.transactionId || donation.paymentId,
        donationType: donation.category || donation.donationType,
        message: donation.message || '',
        panNumber: donation.panNumber || ''
      };

      const sendDonationReceipt = httpsCallable(functions, 'sendDonationReceipt');
      const result = await sendDonationReceipt({ donationId: donation.id, donationData });

      if (result.data.success) {
        alert(`✅ Receipt generated and sent successfully!\n\n📧 Email sent to ${donation.email}\n📄 Receipt URL: ${result.data.receiptUrl}`);
      } else throw new Error('Failed to generate receipt');
    } catch (error) {
      logger.error('Error generating/sending receipt:', error);
      alert('❌ Error generating receipt. Please try again.');
    } finally {
      setState(s => ({ ...s, isProcessing: false }));
    }
  }, []);

  const handleStatusUpdate = useCallback(async (donationId, newStatus) => {
    setState(s => ({ ...s, isProcessing: true }));
    try {
      await updateDonationStatus(donationId, newStatus);

      if (newStatus === 'approved') {
        const donation = donations.find(d => d.id === donationId);
        if (donation) await generateAndSendReceipt(donation);
      }

      setState(s => ({ ...s, isModalOpen: false, selectedDonation: null, isProcessing: false }));
    } catch (error) {
      logger.error('Error updating donation status:', error);
      alert('Error updating donation status');
      setState(s => ({ ...s, isProcessing: false }));
    }
  }, [donations, generateAndSendReceipt]);

  const openDonationModal = useCallback((donationId) => {
    const donation = donations.find(d => d.id === donationId);
    if (donation) {
      setState(s => ({ ...s, selectedDonation: donation, isModalOpen: true }));
    } else {
      logger.error('Donation not found in current list');
    }
  }, [donations]);

  const closeModal = useCallback(() => setState(s => ({ ...s, isModalOpen: false, selectedDonation: null })), []);
  const updateSearch = useCallback((e) => setState(s => ({ ...s, searchTerm: e.target.value })), []);
  const updateFilter = useCallback((e) => setState(s => ({ ...s, statusFilter: e.target.value })), []);

  if (loading) return <LoadingSpinner />;

  const { searchTerm, statusFilter, selectedDonation, isModalOpen, isProcessing } = state;
  const hasFilters = searchTerm || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donation Management</h2>
          <p className="text-gray-600">Review and manage donation submissions</p>
        </div>
        <div className="text-sm text-gray-500">Total: {donations.length} donations</div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, email, phone, or category..." value={searchTerm} onChange={updateSearch}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" maxLength={200} />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={updateFilter} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map(donation => <DonationRow key={donation.id} donation={donation} onView={openDonationModal} />)}
              </tbody>
            </table>
          </div>
        ) : <EmptyState hasFilters={hasFilters} />}
      </div>

      <DonationDetailModal donation={selectedDonation} isOpen={isModalOpen} onClose={closeModal}
        onStatusUpdate={handleStatusUpdate} onGenerateReceipt={generateAndSendReceipt} isProcessing={isProcessing} />
    </div>
  );
};

export default memo(DonationManagement);
