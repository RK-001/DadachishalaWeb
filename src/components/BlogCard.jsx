import React from 'react';
import { Calendar, User, BookOpen, Clock } from 'lucide-react';

const BlogCard = ({ blog, onClick }) => {
  return (
    <article 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(blog)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.thumbnail || blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            blog.author_type === 'volunteer' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {blog.author_type === 'volunteer' ? 'Volunteer' : 'Student'}
          </span>
        </div>
        {blog.reading_time && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {blog.reading_time} min read
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(blog.created_at || blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span className="mx-2">•</span>
          <User className="w-4 h-4 mr-1" />
          <span className="font-medium">{blog.author}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt || blog.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary-600 font-medium">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>Read More</span>
          </div>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{blog.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;