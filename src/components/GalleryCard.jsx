import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Calendar, Tag, Image as ImageIcon } from 'lucide-react';

const GalleryCard = ({ item, onEdit, onDelete, onView, isAdmin = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'events':
        return 'bg-blue-100 text-blue-800';
      case 'activities':
        return 'bg-green-100 text-green-800';
      case 'workshops':
        return 'bg-purple-100 text-purple-800';
      case 'community':
        return 'bg-orange-100 text-orange-800';
      case 'education':
        return 'bg-indigo-100 text-indigo-800';
      case 'health':
        return 'bg-red-100 text-red-800';
      case 'achievements':
        return 'bg-yellow-100 text-yellow-800';
      case 'team':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'events': 'Events',
      'activities': 'Activities',
      'workshops': 'Workshops',
      'community': 'Community Service',
      'education': 'Education Programs',
      'health': 'Health Camps',
      'achievements': 'Achievements',
      'team': 'Team & Volunteers'
    };
    return categoryMap[category] || category;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
            <img
              src={item.image_url}
              alt={item.alt_text || item.title}
              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
            <Tag className="w-3 h-3 inline mr-1" />
            {getCategoryLabel(item.category)}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        {isAdmin && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={() => onView(item)}
                className="p-2 bg-white text-gray-700 hover:bg-gray-100 rounded-full transition-colors shadow-md"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shadow-md"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-full transition-colors shadow-md"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-brand-primary mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {item.description}
        </p>

        {/* Caption */}
        {item.caption && (
          <p className="text-sm italic text-gray-500 mb-3 line-clamp-2">
            "{item.caption}"
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(item.uploaded_at)}</span>
          </div>
          
          {!isAdmin && (
            <button
              onClick={() => onView(item)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
