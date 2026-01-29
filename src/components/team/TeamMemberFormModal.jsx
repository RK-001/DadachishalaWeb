import React, { useState, useEffect, useCallback, memo } from 'react';
import { Upload, Save } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { sanitizeString, sanitizeEmail } from '../../utils/validators';

const TeamMemberFormModal = ({ member, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    category: 'founder',
    education: '',
    description: '',
    image: '',
    duration: '',
    phone: '',
    email: '',
    linkedin: '',
    instagram: '',
    status: 'active',
    isTestimonial: false
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeKB = 500;
    const maxSizeBytes = maxSizeKB * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSizeKB}KB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, image: e.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      name: sanitizeString(formData.name),
      position: sanitizeString(formData.position),
      education: sanitizeString(formData.education),
      description: sanitizeString(formData.description),
      email: formData.email ? sanitizeEmail(formData.email) : '',
      duration: sanitizeString(formData.duration)
    };
    
    onSubmit(submitData);
  }, [formData, onSubmit]);

  const modalTitle = member ? 'Edit Team Member' : 'Add New Team Member';
  const isCommunityVoice = formData.category === 'community-voice';

  return (
    <Modal isOpen={true} size="large" onClose={onCancel} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isCommunityVoice ? 'Role (e.g., Parent, Community Member) *' : 'Position *'}
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              placeholder={isCommunityVoice ? 'e.g., Parent, Community Member' : 'e.g., Program Director'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="founder">Founder</option>
              <option value="core-team">Core Team</option>
              <option value="volunteer">Volunteer</option>
              <option value="community-voice">Community Voice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isCommunityVoice ? 'Quote/Testimonial' : 'Education'}
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder={isCommunityVoice ? 'Brief testimonial...' : 'e.g., MBA, Ph.D'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (for volunteers)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 2 years"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isCommunityVoice ? 'Full Testimonial' : 'Description'}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder={isCommunityVoice ? 'Complete testimonial...' : 'Brief description...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md px-4 py-2 flex items-center transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Testimonial Feature for Volunteers */}
        {formData.category === 'volunteer' && (
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isTestimonial"
                checked={formData.isTestimonial}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Feature as Testimonial</span>
                <p className="text-xs text-gray-500">Display this volunteer's story on the volunteer page</p>
              </div>
            </label>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {member ? 'Update Member' : 'Add Member'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default memo(TeamMemberFormModal);
