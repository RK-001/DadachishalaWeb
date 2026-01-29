import React, { memo, useMemo } from 'react';
import { Edit2, Trash2, User, Crown, Briefcase, MessageCircle, GraduationCap, Calendar, Star } from 'lucide-react';

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

const TeamMemberCard = ({ member, onEdit, onDelete, onTestimonialToggle }) => {
  const categoryLabel = useMemo(() => 
    member.category.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    [member.category]
  );

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
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
              onClick={() => onEdit(member)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Edit member"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(member.category)}`}>
            {getCategoryIcon(member.category)}
            <span className="ml-1">{categoryLabel}</span>
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
                onClick={() => onTestimonialToggle(member.id)}
                className={`p-1 rounded-full transition-colors ${
                  member.isTestimonial 
                    ? 'text-yellow-600 hover:text-yellow-700 bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-600'
                }`}
                title={member.isTestimonial ? 'Remove from testimonials' : 'Add to testimonials'}
                aria-label="Toggle testimonial status"
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
                  className="text-blue-700 hover:text-blue-800 text-sm"
                >
                  LinkedIn
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-800 text-sm"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TeamMemberCard);
