import React from 'react';
import { Calendar, MapPin, Clock, Users, Edit2, Trash2, Eye } from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete, onView, isAdmin = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
    }
  };

  // Use both old and new field names for compatibility
  const eventTitle = event.title || event.event_name;
  const eventImage = event.image_url || event.imageURL;
  const eventDescription = event.description;
  const eventDate = event.event_date;
  const eventTime = event.event_time;
  const eventLocation = event.location;

  return (
    <div className="bg-white border-2 border-brand-primary rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-105 relative h-[400px] flex flex-col">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out"></div>
      
      {/* Event Image */}
      {eventImage && (
        <div className="h-48 overflow-hidden relative flex-shrink-0">
          <img
            src={eventImage}
            alt={eventTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent"></div>
        </div>
      )}
      
      {/* Content - Right side */}
      
      <div className="p-5 text-brand-primary relative z-10 flex-1 flex flex-col">
        {/* Status Badge - Always show */}
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
          {(event.displayStatus || event.status) && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(event.displayStatus || event.status)}`}>
              {(event.displayStatus || event.status).charAt(0).toUpperCase() + (event.displayStatus || event.status).slice(1)}
            </span>
          )}
          {/* Category Badge - Only show in admin mode */}
          {isAdmin && event.category && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 border border-secondary-200">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-bold text-brand-primary mb-2 line-clamp-2 group-hover:text-brand-primary/80 transition-colors duration-300 flex-shrink-0">
          {eventTitle}
        </h3>

        {/* Event Description */}
        {eventDescription && (
          <p className="text-brand-primary/70 text-sm mb-3 line-clamp-2 leading-relaxed flex-shrink-0">
            {eventDescription}
          </p>
        )}

        {/* Event Details */}
        <div className="flex flex-wrap gap-3 mb-4 flex-1 text-xs">
          <div className="flex items-center text-brand-primary/80">
            <div className="bg-brand-primary/10 rounded-full p-1 mr-2">
              <Calendar className="w-3 h-3 text-brand-primary" />
            </div>
            <span className="font-medium">{formatDate(eventDate)}</span>
          </div>
          
          {eventTime && (
            <div className="flex items-center text-brand-primary/80">
              <div className="bg-brand-primary/10 rounded-full p-1 mr-2">
                <Clock className="w-3 h-3 text-brand-primary" />
              </div>
              <span className="font-medium">{formatTime(eventTime)}</span>
            </div>
          )}
          
          {eventLocation && (
            <div className="flex items-start justify-between text-sm text-brand-primary/80">
              <div className="flex items-center flex-1 mr-2">
                <div className="bg-brand-primary/10 rounded-full p-1.5 mr-3 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                </div>
                <span className="truncate font-medium">{eventLocation}</span>
              </div>
              {(event.map_location || (event.latitude && event.longitude)) && (
                <button
                  onClick={() => {
                    if (event.map_location) {
                      // If it's a Google Maps embed, extract the URL
                      if (event.map_location.includes('iframe')) {
                        const srcMatch = event.map_location.match(/src="([^"]*)"/);
                        if (srcMatch) {
                          window.open(srcMatch[1], '_blank');
                        }
                      } else {
                        window.open(event.map_location, '_blank');
                      }
                    } else if (event.latitude && event.longitude) {
                      window.open(`https://maps.google.com?q=${event.latitude},${event.longitude}`, '_blank');
                    }
                  }}
                  className="text-xs bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1 rounded-full transition-all duration-300 flex-shrink-0 border border-brand-primary/20 hover:border-brand-primary/40"
                >
                  Get Directions
                </button>
              )}
            </div>
          )}
          
          {event.max_participants && (
            <div className="flex items-center text-sm text-brand-primary/80">
              <div className="bg-brand-primary/10 rounded-full p-1.5 mr-3">
                <Users className="w-3.5 h-3.5 text-brand-primary" />
              </div>
              <span className="font-medium">Max {event.max_participants} participants</span>
            </div>
          )}
        </div>

        {/* Action Buttons - Different for admin vs public */}
        <div className="flex-shrink-0">
          {isAdmin ? (
            <div className="flex justify-between items-center pt-3 border-t border-brand-primary/20">
              <button
                onClick={() => onView && onView(event)}
                className="flex items-center text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                <span className="text-sm">View</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit && onEdit(event)}
                  className="flex items-center px-3 py-1.5 text-sm bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-lg transition-colors border border-brand-primary/20"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={() => onDelete && onDelete(event)}
                  className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-semibold py-3 px-4 rounded-lg transition-all duration-300 border border-brand-primary/20 hover:border-brand-primary/30 hover:transform hover:scale-105">
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
