import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload,
  User,
  Users,
  Crown,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  MessageCircle,
  Star
} from 'lucide-react';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    category: 'founder', // founder, core-team, volunteer, community-voice
    education: '',
    description: '',
    image: '',
    duration: '',
    phone: '',
    email: '',
    linkedin: '',
    instagram: '',
    status: 'active', // active, inactive
    isTestimonial: false // New field for testimonial flag
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Members', icon: Users },
    { id: 'founder', label: 'Founders', icon: Crown },
    { id: 'core-team', label: 'Core Team', icon: Briefcase },
    { id: 'volunteer', label: 'Volunteers', icon: User },
    { id: 'community-voice', label: 'Community Voice', icon: MessageCircle }
  ];

  // Load team members from localStorage (in real app, this would be from database)
  useEffect(() => {
    const savedMembers = localStorage.getItem('teamMembers');
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    }
  }, []);

  // Save team members to localStorage
  const saveToStorage = (members) => {
    localStorage.setItem('teamMembers', JSON.stringify(members));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (500KB max for team member photos)
      const maxSizeKB = 500;
      const maxSizeBytes = maxSizeKB * 1024;
      if (file.size > maxSizeBytes) {
        alert(`File size must be less than ${maxSizeKB}KB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setEditingMember(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const memberData = {
      ...formData,
      id: editingMember ? editingMember.id : Date.now(),
      createdAt: editingMember ? editingMember.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedMembers;
    if (editingMember) {
      updatedMembers = teamMembers.map(member => 
        member.id === editingMember.id ? memberData : member
      );
    } else {
      updatedMembers = [...teamMembers, memberData];
    }

    setTeamMembers(updatedMembers);
    saveToStorage(updatedMembers);
    
    setTimeout(() => {
      setLoading(false);
      resetForm();
    }, 500);
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      saveToStorage(updatedMembers);
    }
  };

  const handleTestimonialToggle = (id) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, isTestimonial: !member.isTestimonial } : member
    );
    setTeamMembers(updatedMembers);
    saveToStorage(updatedMembers);
  };

  const filteredMembers = activeCategory === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'founder': return <Crown className="w-4 h-4" />;
      case 'core-team': return <Briefcase className="w-4 h-4" />;
      case 'volunteer': return <User className="w-4 h-4" />;
      case 'community-voice': return <MessageCircle className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'founder': return 'bg-purple-100 text-purple-800';
      case 'core-team': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'community-voice': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
          <p className="text-gray-600">Manage team members, founders, and volunteers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const count = category.id === 'all' 
            ? teamMembers.length 
            : teamMembers.filter(m => m.category === category.id).length;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Member Image */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{member.name}</h3>
                    <p className="text-primary-600 font-medium">{member.position}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(member.category)}`}>
                  {getCategoryIcon(member.category)}
                  <span className="ml-1 capitalize">{member.category.replace('-', ' ')}</span>
                </span>
                
                {/* Testimonial Badge & Toggle for Volunteers */}
                {member.category === 'volunteer' && (
                  <div className="flex items-center space-x-2">
                    {member.isTestimonial && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    <button
                      onClick={() => handleTestimonialToggle(member.id)}
                      className={`p-1 rounded-full transition-colors ${
                        member.isTestimonial 
                          ? 'text-yellow-600 hover:text-yellow-700 bg-yellow-50' 
                          : 'text-gray-400 hover:text-yellow-600'
                      }`}
                      title={member.isTestimonial ? 'Remove from testimonials' : 'Add to testimonials'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Member Details */}
              <div className="space-y-2 text-sm text-gray-600">
                {member.education && (
                  <div className="flex items-center">
                    {member.category === 'community-voice' ? (
                      <MessageCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <GraduationCap className="w-4 h-4 mr-2" />
                    )}
                    <span>{member.education}</span>
                  </div>
                )}
                {member.duration && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{member.duration}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(member.linkedin || member.instagram) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-800"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-700 hover:text-pink-800"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No team members found</h3>
          <p className="text-gray-400">Add your first team member to get started.</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    {formData.category === 'community-voice' ? 'Role (e.g., Parent, Community Member, Supporter) *' : 'Position *'}
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    placeholder={formData.category === 'community-voice' ? 'e.g., Parent, Community Member, Supporter' : 'e.g., Program Director, Teacher'}
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
                    {formData.category === 'community-voice' ? 'Quote/Testimonial' : 'Education'}
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder={formData.category === 'community-voice' ? 'Brief testimonial or quote...' : 'e.g., MBA, Ph.D in Education'}
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
                  {formData.category === 'community-voice' ? 'Full Testimonial' : 'Description'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={formData.category === 'community-voice' ? 'Complete testimonial or feedback...' : 'Brief description about the member...'}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, isTestimonial: e.target.checked }))}
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
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
