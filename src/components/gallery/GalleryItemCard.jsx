import React, { memo, useMemo } from 'react';
import { Edit, Trash2, Play } from 'lucide-react';

const GalleryItemCard = ({ item, type, onEdit, onDelete }) => {
  const imageUrl = useMemo(() => {
    if (type === 'photos') return item.image_url || item.src;
    if (type === 'awards') return item.image;
    if (type === 'news') return item.image;
    if (type === 'videos') return item.thumbnail;
    return '';
  }, [item, type]);

  const itemDate = useMemo(() => {
    if (type === 'awards') return item.year;
    if (type === 'news') return new Date(item.date).toLocaleDateString();
    if (type === 'videos') {
      const date = item.created_at?.toDate?.() || item.created_at;
      return new Date(date).toLocaleDateString();
    }
    const date = item.uploaded_at?.toDate?.() || item.uploaded_at;
    return new Date(date).toLocaleDateString();
  }, [item, type]);

  const metaInfo = useMemo(() => {
    if (type === 'awards') return item.organization;
    if (type === 'news') return item.source;
    if (type === 'photos') return item.category;
    if (type === 'videos') return item.duration;
    return '';
  }, [item, type]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {type === 'videos' && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Play className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            aria-label="Edit item"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description || item.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{metaInfo}</span>
          <span>{itemDate}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(GalleryItemCard);
