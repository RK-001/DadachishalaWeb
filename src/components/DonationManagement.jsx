import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  Download, 
  Mail, 
  Calendar, 
  User, 
  Heart, 
  FileText,
  DollarSign,
  Clock,
  Filter,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  getDonations, 
  updateDonationStatus, 
  getDonationById 
} from '../services/databaseService';
import { generateDonationReceipt } from '../services/pdf';
import { emailService } from '../services/emailService';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, searchTerm, statusFilter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const donationsData = await getDonations();
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.phone?.includes(searchTerm) ||
        donation.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDonations(filtered);
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      setIsProcessing(true);
      await updateDonationStatus(donationId, newStatus);
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: newStatus }
            : donation
        )
      );

      // If approved, generate and send receipt
      if (newStatus === 'approved') {
        const donation = donations.find(d => d.id === donationId);
        if (donation) {
          await generateAndSendReceipt(donation);
        }
      }

      setIsModalOpen(false);
      setSelectedDonation(null);
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Error updating donation status');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAndSendReceipt = async (donation) => {
    try {
      // Generate PDF receipt
      const receiptData = {
        ...donation,
        receiptNumber: `DCS-${Date.now()}`,
        dateIssued: new Date().toLocaleDateString(),
        organizationName: 'Educare (Dada Chi Shala) Educational Trust',
        organizationAddress: 'Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar Pune 411048',
        organizationEmail: 'dadachishala07@gmail.com',
        organizationPhone: '7038953001/7020396723'
      };

      // Generate PDF for download
      const pdfBlob = generateDonationReceipt(receiptData);
      
      // Auto-download PDF for admin to manually send
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donation-receipt-${receiptData.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Send email notification without PDF attachment
      if (donation.email) {
        await emailService.sendDonationReceipt({
          email: donation.email,
          firstName: donation.firstName,
          lastName: donation.lastName,
          amount: donation.amount,
          category: donation.category,
          receiptNumber: receiptData.receiptNumber
        });
        
        alert(`✅ Receipt generated and downloaded!\n\n📧 Email notification sent to ${donation.email}\n\n📄 Please manually attach the downloaded PDF to complete the process.`);
      } else {
        alert(`✅ Receipt generated and downloaded!\n\n⚠️ No email provided - please send the PDF receipt manually.`);
      }

    } catch (error) {
      console.error('Error generating/sending receipt:', error);
      alert('❌ Error generating receipt. Please try again.');
    }
  };

  const openDonationModal = async (donationId) => {
    try {
      const donation = await getDonationById(donationId);
      setSelectedDonation(donation);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching donation details:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donation Management</h2>
          <p className="text-gray-600">Review and manage donation submissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total: {donations.length} donations
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or category..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.firstName} {donation.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{donation.amount?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.category}
                      </div>
                      <div className="text-sm text-gray-400">
                        {donation.frequency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.createdAt?.toDate ? 
                        donation.createdAt.toDate().toLocaleDateString() :
                        new Date(donation.createdAt).toLocaleDateString()
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {getStatusIcon(donation.status)}
                        <span className="ml-1 capitalize">{donation.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openDonationModal(donation.id)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No donations have been submitted yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Donation Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Donor Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Donor Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">
                        {selectedDonation.firstName} {selectedDonation.middleName} {selectedDonation.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedDonation.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedDonation.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900">{selectedDonation.address}</p>
                    </div>
                    {selectedDonation.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Notes</label>
                        <p className="text-gray-900">{selectedDonation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Donation Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Donation Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Amount</label>
                      <p className="text-gray-900 font-semibold text-lg">₹{selectedDonation.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900">{selectedDonation.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Frequency</label>
                      <p className="text-gray-900">{selectedDonation.frequency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDonation.status)}`}>
                        {getStatusIcon(selectedDonation.status)}
                        <span className="ml-1 capitalize">{selectedDonation.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                      <p className="text-gray-900">
                        {selectedDonation.createdAt?.toDate ? 
                          selectedDonation.createdAt.toDate().toLocaleDateString() :
                          new Date(selectedDonation.createdAt).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedDonation.screenshotURL && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Screenshot</h4>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <img 
                      src={selectedDonation.screenshotURL} 
                      alt="Payment Screenshot" 
                      className="max-w-full h-auto max-h-96 mx-auto rounded border"
                    />
                    <div className="mt-3 flex justify-center">
                      <a
                        href={selectedDonation.screenshotURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedDonation.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedDonation.id, 'rejected')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedDonation.id, 'approved')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Approve & Send Receipt
                  </button>
                </div>
              )}

              {/* Generate Receipt Button for Approved Donations */}
              {selectedDonation.status === 'approved' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => generateAndSendReceipt(selectedDonation)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download & Email Receipt
                  </button>
                </div>
              )}

              {/* Manual Receipt Generation for All Approved */}
              {selectedDonation.status === 'approved' && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      const receiptData = {
                        ...selectedDonation,
                        receiptNumber: `DCS-${Date.now()}`,
                        dateIssued: new Date().toLocaleDateString()
                      };
                      const pdfBlob = generateDonationReceipt(receiptData);
                      const url = URL.createObjectURL(pdfBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `donation-receipt-${receiptData.receiptNumber}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
