import React, { forwardRef } from 'react';
import { MapPin, Phone, Navigation, Users, Clock, Edit, Trash2 } from 'lucide-react';

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
    
    const formatTimings = (school_timings) => {
      if (!school_timings) return "Mon - Sat: 9:00 AM - 6:00 PM";
      
      const openDays = Object.entries(school_timings)
        .filter(([day, timing]) => timing.isOpen)
        .map(([day, timing]) => ({
          day: day.charAt(0).toUpperCase() + day.slice(1, 3),
          start: timing.start,
          end: timing.end
        }));
      
      if (openDays.length === 0) return "Closed";
      
      // Check if all open days have same timing
      const firstTiming = openDays[0];
      const allSameTiming = openDays.every(
        day => day.start === firstTiming.start && day.end === firstTiming.end
      );
      
      if (allSameTiming && openDays.length > 1) {
        const dayNames = openDays.map(d => d.day);
        const dayRange = dayNames.length === 6 && 
          dayNames.includes('Mon') && dayNames.includes('Sat') && 
          !dayNames.includes('Sun') ? 'Mon - Sat' : dayNames.join(', ');
        return `${dayRange}: ${firstTiming.start} - ${firstTiming.end}`;
      }
      
      return `${openDays.length} days open`;
    };

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
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-50 flex items-center justify-center">
              {branch.imageURL ? (
                <img
                  src={branch.imageURL}
                  alt={branch.branch_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MapPin size={24} className="text-primary-600" />
              )}
            </div>
          </div>

          {/* Branch Info */}
          <div className="flex-grow min-w-0">
            <h4 className="text-lg font-bold text-brand-primary mb-2 group-hover:text-secondary-600 transition-colors truncate">
              {branch.branch_name}
            </h4>
            <p className="text-gray-600 leading-relaxed mb-3 text-sm line-clamp-2">
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

              {/* Additional detailed info for management view */}
              {showDetailedInfo && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    ID: {branch.id}
                  </div>
                  {branch.createdAt && (
                    <div className="text-xs text-gray-500">
                      Created: {new Date(branch.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
                  title="Edit Branch"
                >
                  <Edit size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(branch.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition-colors"
                  title="Delete Branch"
                >
                  <Trash2 size={14} />
                </button>

                <button
                  onClick={(e) => openGoogleMaps(branch.location, e)}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-md transition-colors"
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
                  className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-md transition-colors"
                  title="Get Directions"
                >
                  <Navigation size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add visit branch functionality
                  }}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white p-1.5 rounded-md transition-colors"
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
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer flex-shrink-0 ${
        isSelected ? 'ring-2 ring-secondary-400 bg-gradient-to-r from-white to-secondary-50' : ''
      } ${className}`}
      onClick={onClick}
    >
      {renderContent()}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="bg-gradient-to-r from-secondary-500 to-primary-600 h-1 w-full animate-gradient-x"></div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
