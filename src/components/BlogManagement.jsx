import { useState, useMemo, useCallback, memo } from 'react';
import { PenTool, Plus, Edit, Trash2, Search, Filter, Calendar, User, BookOpen, X } from 'lucide-react';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '../services/cachedDatabaseService';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { useCRUD } from '../hooks/useCRUD';
import { Modal, LoadingSpinner, FormInput, Button } from './common';
import { sanitizeString, sanitizeUrl } from '../utils/sanitization';
import { useNotification } from '../context/NotificationContext';

const INITIAL_FORM_STATE = {
  title: '', content: '', excerpt: '', author: '', author_type: 'volunteer',
  tags: [], image: '', thumbnail: '', reading_time: 5, featured: false
};

const BlogForm = memo(({ formData, setFormData, onSubmit, onCancel, isEditing }) => {
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, [setFormData]);

  const handleAddTag = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const sanitized = sanitizeString(e.target.value.trim());
      if (sanitized && !formData.tags.includes(sanitized)) {
        updateField('tags', [...formData.tags, sanitized]);
        e.target.value = '';
      }
    }
  }, [formData.tags, updateField]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  }, [formData.tags, updateField]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Title" required value={formData.title} className="md:col-span-2"
          onChange={(e) => updateField('title', sanitizeString(e.target.value))} placeholder="Blog title" />

        <FormInput label="Author" required value={formData.author}
          onChange={(e) => updateField('author', sanitizeString(e.target.value))} placeholder="Author name" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author Type *</label>
          <select value={formData.author_type} onChange={(e) => updateField('author_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="volunteer">Volunteer</option>
            <option value="student">Student</option>
          </select>
        </div>

        <FormInput label="Reading Time (minutes)" type="number" min="1" max="60" value={formData.reading_time}
          onChange={(e) => updateField('reading_time', Math.max(1, Math.min(60, parseInt(e.target.value) || 5)))} />

        <label className="flex items-center">
          <input type="checkbox" checked={formData.featured} onChange={(e) => updateField('featured', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="text-sm font-medium text-gray-700">Featured Blog</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
        <textarea required rows={3} value={formData.excerpt} onChange={(e) => updateField('excerpt', sanitizeString(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Brief description" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
        <textarea required rows={8} value={formData.content} onChange={(e) => updateField('content', sanitizeString(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Full blog content" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-primary-600 hover:text-primary-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input type="text" placeholder="Add tags (press Enter)" onKeyPress={handleAddTag}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
      </div>

      <FormInput label="Featured Image URL" type="url" value={formData.image}
        onChange={(e) => updateField('image', sanitizeUrl(e.target.value))} placeholder="https://example.com/image.jpg" />

      <FormInput label="Thumbnail URL" type="url" value={formData.thumbnail}
        onChange={(e) => updateField('thumbnail', sanitizeUrl(e.target.value))} placeholder="https://example.com/thumbnail.jpg" />

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">{isEditing ? 'Update Blog' : 'Create Blog'}</Button>
      </div>
    </form>
  );
});

BlogForm.displayName = 'BlogForm';

const BlogManagement = () => {
  const { data: blogs = [], loading, refetch } = useFirestoreCollection('blogs', getBlogs);
  const { create, update, remove } = useCRUD('blogs', addBlog, updateBlog, deleteBlog, refetch);
  const { showSuccess, showError } = useNotification();
  
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setEditingBlog(null);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim()),
        reading_time: Math.max(1, Math.min(60, parseInt(formData.reading_time) || 5))
      };

      const result = editingBlog 
        ? await update(editingBlog.id, blogData)
        : await create(blogData);

      if (result.success) {
        showSuccess(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        setShowModal(false);
        resetForm();
      } else {
        showError(result.error || 'Failed to save blog');
      }
    } catch (error) {
      showError(error.message || 'An error occurred');
    }
  }, [formData, editingBlog, create, update, resetForm, showSuccess, showError]);

  const handleEdit = useCallback((blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '', content: blog.content || '', excerpt: blog.excerpt || '',
      author: blog.author || '', author_type: blog.author_type || 'volunteer',
      tags: blog.tags || [], image: blog.image || '', thumbnail: blog.thumbnail || '',
      reading_time: blog.reading_time || 5, featured: blog.featured || false
    });
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const result = await remove(blogId);
      if (result.success) {
        showSuccess('Blog deleted successfully');
      } else {
        showError(result.error || 'Failed to delete blog');
      }
    }
  }, [remove, showSuccess, showError]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm && filterType === 'all') return blogs;
    
    return blogs.filter(blog => {
      const matchesSearch = !searchTerm || 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || blog.author_type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [blogs, searchTerm, filterType]);

  const openModal = useCallback(() => {
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetForm();
  }, [resetForm]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-primary-600" />
            Blog Management
          </h2>
          <p className="text-gray-600 mt-1">Manage volunteer and student stories</p>
        </div>
        <Button onClick={openModal} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="all">All Types</option>
            <option value="volunteer">Volunteer Stories</option>
            <option value="student">Student Stories</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filter.' : 'Get started by adding your first blog.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {blog.thumbnail && <img src={blog.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{blog.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.author_type === 'volunteer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {blog.author_type === 'volunteer' ? 'Volunteer' : 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {blog.created_at ? new Date(blog.created_at.toDate()).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(blog)} className="text-primary-600 hover:text-primary-900 p-1" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900 p-1" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={editingBlog ? 'Edit Blog' : 'Add New Blog'} size="large">
        <BlogForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onCancel={closeModal} isEditing={!!editingBlog} />
      </Modal>
    </div>
  );
};

export default memo(BlogManagement);