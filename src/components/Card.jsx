import React, { forwardRef } from 'react';
import { MapPin, Phone, Navigation, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { formatTimings } from '../utils/helpers';

const Card = forwardRef(({ 
  data, 
  index, 
  type = 'branch', // 'branch', 'student', 'event', etc.
  isSelected = false, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  showDetailedInfo = false,
  className = "",
  style = {}
}, ref) => {

  // Branch-specific rendering logic
  const renderBranchCard = () => {
    const branch = data;
    
    const openGoogleMaps = (location, e) => {
      e?.stopPropagation();
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      window.open(url, '_blank');
    };

    return (
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Branch Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-50 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105">
              {branch.imageURL ? (
                <img
                  src={branch.imageURL}
                  alt={branch.branch_name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <MapPin size={24} className="text-primary-600 transition-all duration-300 hover:scale-110 hover:text-primary-700" />
              )}
            </div>
          </div>

          {/* Branch Info */}
          <div className="flex-grow min-w-0">
            <h4 className="text-lg font-bold text-brand-primary mb-2 group-hover:text-secondary-600 transition-all duration-300 truncate hover:text-primary-700 cursor-pointer">
              {branch.branch_name}
            </h4>
            <p className="text-gray-600 leading-relaxed mb-3 text-sm line-clamp-2 transition-colors duration-300 hover:text-gray-700">
              {branch.description}
            </p>
            
            <div className="space-y-1.5">
              <div className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-2 text-secondary-500 flex-shrink-0" />
                <span className="text-xs truncate">{branch.location}</span>
              </div>
              
              {/* School Timings */}
              <div className="flex items-center text-gray-600">
                <Clock size={14} className="mr-2 text-secondary-500 flex-shrink-0" />
                <span className="text-xs">
                  {formatTimings(branch.school_timings)}
                </span>
              </div>
              
              {/* Active Students */}
              <div className="flex items-center text-gray-600">
                <Users size={14} className="mr-2 text-secondary-500 flex-shrink-0" />
                <span className="text-xs">
                  {branch.student_count !== undefined 
                    ? `${branch.student_count} Active Students`
                    : `${45 + (index * 12)} Active Students`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex flex-col space-y-2">
            {showActions ? (
              /* Management Actions */
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(branch);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95"
                  title="Edit Branch"
                >
                  <Edit size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(branch.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95"
                  title="Delete Branch"
                >
                  <Trash2 size={14} />
                </button>

                <button
                  onClick={(e) => openGoogleMaps(branch.location, e)}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95"
                  title="Get Directions"
                >
                  <Navigation size={14} />
                </button>
              </>
            ) : (
              /* Public Actions */
              <>
                <button
                  onClick={(e) => openGoogleMaps(branch.location, e)}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95"
                  title="Get Directions"
                >
                  <Navigation size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add visit branch functionality
                  }}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95"
                  title="Contact Branch"
                >
                  <Phone size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Future: Add other card types here
  const renderContent = () => {
    switch (type) {
      case 'branch':
        return renderBranchCard();
      // case 'student':
      //   return renderStudentCard();
      // case 'event':
      //   return renderEventCard();
      default:
        return renderBranchCard();
    }
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex-shrink-0 animate-fade-in ${
        isSelected ? 'border-2 border-[#191947] shadow-2xl scale-[1.01]' : ''
      } ${className}`}
      onClick={onClick}
    >
      {renderContent()}


    </div>
  );
});

Card.displayName = 'Card';

export default Card;
