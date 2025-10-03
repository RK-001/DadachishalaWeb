import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin, Save, X, Upload, Image } from 'lucide-react';
import { getBranches, addBranch, updateBranch, deleteBranch } from '../services/databaseService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import Card from './Card';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    branch_name: '',
    description: '',
    location: '',
    imageURL: '',
    student_count: 0,
    school_timings: {
      monday: { start: '09:00', end: '17:00', isOpen: true },
      tuesday: { start: '09:00', end: '17:00', isOpen: true },
      wednesday: { start: '09:00', end: '17:00', isOpen: true },
      thursday: { start: '09:00', end: '17:00', isOpen: true },
      friday: { start: '09:00', end: '17:00', isOpen: true },
      saturday: { start: '09:00', end: '17:00', isOpen: true },
      sunday: { start: '09:00', end: '17:00', isOpen: false }
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const branchesData = await getBranches();
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimingChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      school_timings: {
        ...prev.school_timings,
        [day]: {
          ...prev.school_timings[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      setUploading(true);
      const imageRef = ref(storage, `branches/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageURL = formData.imageURL;
      
      // Upload new image if selected
      if (imageFile) {
        imageURL = await uploadImage();
      }

      const branchData = {
        ...formData,
        imageURL
      };

      if (editingBranch) {
        await updateBranch(editingBranch.id, branchData);
      } else {
        await addBranch(branchData);
      }

      await fetchBranches();
      resetForm();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error saving branch. Please try again.');
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      description: branch.description,
      location: branch.location,
      imageURL: branch.imageURL || '',
      student_count: branch.student_count || 0,
      school_timings: branch.school_timings || {
        monday: { start: '09:00', end: '17:00', isOpen: true },
        tuesday: { start: '09:00', end: '17:00', isOpen: true },
        wednesday: { start: '09:00', end: '17:00', isOpen: true },
        thursday: { start: '09:00', end: '17:00', isOpen: true },
        friday: { start: '09:00', end: '17:00', isOpen: true },
        saturday: { start: '09:00', end: '17:00', isOpen: true },
        sunday: { start: '09:00', end: '17:00', isOpen: false }
      }
    });
    setImagePreview(branch.imageURL || '');
    setShowForm(true);
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranch(branchId);
        await fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
        alert('Error deleting branch. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      branch_name: '',
      description: '',
      location: '',
      imageURL: '',
      student_count: 0,
      school_timings: {
        monday: { start: '09:00', end: '17:00', isOpen: true },
        tuesday: { start: '09:00', end: '17:00', isOpen: true },
        wednesday: { start: '09:00', end: '17:00', isOpen: true },
        thursday: { start: '09:00', end: '17:00', isOpen: true },
        friday: { start: '09:00', end: '17:00', isOpen: true },
        saturday: { start: '09:00', end: '17:00', isOpen: true },
        sunday: { start: '09:00', end: '17:00', isOpen: false }
      }
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBranch(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#191947]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#191947]">Branch Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-[#191947] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-[#0d0d2e] transition-colors"
        >
          <Plus size={20} />
          Add New Branch
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-[#191947] text-white p-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {editingBranch ? <Edit size={20} /> : <Plus size={20} />}
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191947] focus:border-transparent transition-colors"
                    placeholder="Enter branch name"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191947] focus:border-transparent transition-colors"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191947] focus:border-transparent transition-colors resize-none"
                  placeholder="Enter branch description"
                />
              </div>

              {/* Student Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Count
                </label>
                <input
                  type="number"
                  name="student_count"
                  value={formData.student_count}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191947] focus:border-transparent transition-colors"
                  placeholder="Enter number of students"
                />
              </div>

              {/* School Timings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  School Timings
                </label>
                <div className="space-y-3">
                  {Object.entries(formData.school_timings).map(([day, timing]) => (
                    <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="min-w-[100px]">
                        <span className="font-medium text-gray-700 capitalize">{day}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={timing.isOpen}
                          onChange={(e) => handleTimingChange(day, 'isOpen', e.target.checked)}
                          className="rounded border-gray-300 text-[#191947] focus:ring-[#191947]"
                        />
                        <span className="text-sm text-gray-600">Open</span>
                      </div>
                      
                      {timing.isOpen && (
                        <>
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Start:</label>
                            <input
                              type="time"
                              value={timing.start}
                              onChange={(e) => handleTimingChange(day, 'start', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#191947] focus:border-transparent"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">End:</label>
                            <input
                              type="time"
                              value={timing.end}
                              onChange={(e) => handleTimingChange(day, 'end', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#191947] focus:border-transparent"
                            />
                          </div>
                        </>
                      )}
                      
                      {!timing.isOpen && (
                        <span className="text-sm text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Image
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="branch-image"
                  />
                  <label
                    htmlFor="branch-image"
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#191947] transition-colors"
                  >
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-gray-700">Choose branch image</span>
                  </label>
                  
                  {imagePreview && (
                    <div className="relative w-48 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className="bg-[#191947] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-[#0d0d2e] transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  {uploading ? 'Saving...' : editingBranch ? 'Update Branch' : 'Add Branch'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              data={branch}
              type="branch"
              index={index}
              showActions={true}
              showDetailedInfo={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {branches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No branches found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first branch</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-[#191947] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-[#0d0d2e] transition-colors mx-auto"
          >
            <Plus size={20} />
            Add First Branch
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
