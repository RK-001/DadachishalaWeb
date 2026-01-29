import React, { memo } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const StoryTestimonialCard = ({ item, type, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>
        {type === 'stories' ? (
          <>
            <p className="text-primary-600 font-medium mb-2">{item.achievement}</p>
            <p className="text-gray-600 text-sm line-clamp-3">{item.story}</p>
          </>
        ) : (
          <>
            <p className="text-gray-600 font-medium mb-2">{item.role}</p>
            <p className="text-gray-600 text-sm line-clamp-3 italic">"{item.quote}"</p>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(StoryTestimonialCard);
