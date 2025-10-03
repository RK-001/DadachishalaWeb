import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Navigation, ExternalLink } from 'lucide-react';

const EventDetails = ({ event, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleGetDirections = () => {
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
  };

  const renderMap = () => {
    if (event.map_location) {
      // If it's an embed code (iframe)
      if (event.map_location.includes('iframe')) {
        return (
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <div dangerouslySetInnerHTML={{ __html: event.map_location }} className="w-full h-full" />
          </div>
        );
      }
    }
    
    // If we have coordinates, show a Google Maps embed
    if (event.latitude && event.longitude) {
      const embedUrl = `https://maps.google.com/maps?q=${event.latitude},${event.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      return (
        <div className="w-full h-64 rounded-lg overflow-hidden border">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Event Location Map"
          ></iframe>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-brand-primary">Event Details</h2>
            {event.status && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Information */}
            <div className="space-y-6">
              {/* Event Image */}
              {event.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Event Title and Category */}
              <div>
                <h1 className="text-3xl font-bold text-brand-primary mb-2">
                  {event.title}
                </h1>
                {event.category && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{formatDate(event.event_date)}</p>
                  </div>
                </div>

                {event.event_time && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p>{formatTime(event.event_time)}</p>
                  </div>
                )}

                <div className="flex items-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="mb-2">{event.location}</p>
                    {(event.map_location || (event.latitude && event.longitude)) && (
                      <button
                        onClick={handleGetDirections}
                        className="inline-flex items-center text-sm bg-primary-600 text-white hover:bg-primary-700 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </button>
                    )}
                  </div>
                </div>

                {event.max_participants && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p>Maximum {event.max_participants} participants</p>
                  </div>
                )}
              </div>

              {/* Event Description */}
              <div>
                <h3 className="text-lg font-semibold text-brand-primary mb-3">About This Event</h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-primary mb-4">Location</h3>
                {renderMap()}
                {!event.map_location && !event.latitude && (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No map available</p>
                      <p className="text-sm">Location: {event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
