import { memo, useCallback, useMemo } from 'react';
import { Calendar, MapPin, Clock, Users, Edit2, Trash2, Eye } from 'lucide-react';

const STATUS_STYLES = {
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-gray-50 text-gray-700 border-gray-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  default: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const DetailItem = memo(({ icon: Icon, children, className = '' }) => (
  <div className={`flex items-center text-brand-primary/80 ${className}`}>
    <div className="bg-brand-primary/10 rounded-full p-1 mr-2">
      <Icon className="w-3 h-3 text-brand-primary" />
    </div>
    <span className="font-medium">{children}</span>
  </div>
));
DetailItem.displayName = 'DetailItem';

const EventCard = ({ event, onEdit, onDelete, onView, isAdmin = false }) => {
  // Memoized event data with fallbacks
  const eventData = useMemo(() => ({
    title: event?.title || event?.event_name || '',
    image: event?.image_url || event?.imageURL,
    description: event?.description,
    date: event?.event_date,
    time: event?.event_time,
    location: event?.location,
    status: event?.displayStatus || event?.status,
    category: event?.category,
    maxParticipants: event?.max_participants,
    mapLocation: event?.map_location,
    lat: event?.latitude,
    lng: event?.longitude
  }), [event]);

  const handleDirections = useCallback(() => {
    const { mapLocation, lat, lng } = eventData;
    if (!mapLocation && !lat) return;
    
    let url;
    if (mapLocation?.includes('iframe')) {
      const match = mapLocation.match(/src="([^"]*)"/);
      url = match?.[1];
    } else if (mapLocation) {
      url = mapLocation;
    } else if (lat && lng) {
      url = `https://maps.google.com?q=${lat},${lng}`;
    }
    
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, [eventData]);

  const handleAction = useCallback((action, handler) => (e) => {
    e?.stopPropagation();
    handler?.(event);
  }, [event]);

  if (!event) return null;

  const statusStyle = STATUS_STYLES[eventData.status] || STATUS_STYLES.default;
  const hasMapLink = eventData.mapLocation || (eventData.lat && eventData.lng);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative h-full flex flex-col border-2 border-transparent hover:border-primary-400">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-yellow-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-105" />
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out z-20 pointer-events-none" />
      
      {/* Event Image */}
      {eventData.image && (
        <div className="h-48 overflow-hidden relative flex-shrink-0">
          <img src={eventData.image} alt={eventData.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 via-primary-600/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-5 text-brand-primary relative z-10 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-primary-50/30 transition-all duration-500">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
          {eventData.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 group-hover:shadow-md ${statusStyle}`}>
              {capitalize(eventData.status)}
            </span>
          )}
          {isAdmin && eventData.category && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 border border-secondary-200">
              {capitalize(eventData.category)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-brand-primary mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300 flex-shrink-0">
          {eventData.title}
        </h3>

        {/* Description */}
        {eventData.description && (
          <p className="text-brand-primary/70 text-sm mb-3 line-clamp-2 leading-relaxed flex-shrink-0 group-hover:text-gray-700 transition-colors duration-300">
            {eventData.description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-3 mb-4 flex-1 text-xs">
          <DetailItem icon={Calendar}>{formatDate(eventData.date)}</DetailItem>
          {eventData.time && <DetailItem icon={Clock}>{formatTime(eventData.time)}</DetailItem>}
          
          {eventData.location && (
            <div className="flex items-start justify-between text-sm text-brand-primary/80 w-full">
              <div className="flex items-center flex-1 mr-2">
                <div className="bg-brand-primary/10 rounded-full p-1.5 mr-3 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                </div>
                <span className="truncate font-medium">{eventData.location}</span>
              </div>
              {hasMapLink && (
                <button type="button" onClick={handleDirections} className="text-xs bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1 rounded-full transition-all duration-300 flex-shrink-0 border border-brand-primary/20 hover:border-brand-primary/40" aria-label="Get directions">
                  Get Directions
                </button>
              )}
            </div>
          )}
          
          {eventData.maxParticipants && (
            <DetailItem icon={Users} className="text-sm">Max {eventData.maxParticipants} participants</DetailItem>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          {isAdmin ? (
            <div className="flex justify-between items-center pt-3 border-t border-brand-primary/20">
              <button type="button" onClick={handleAction('view', onView)} className="flex items-center text-brand-primary/70 hover:text-brand-primary transition-colors" aria-label="View event">
                <Eye className="w-4 h-4 mr-1" /><span className="text-sm">View</span>
              </button>
              <div className="flex space-x-2">
                <button type="button" onClick={handleAction('edit', onEdit)} className="flex items-center px-3 py-1.5 text-sm bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-lg transition-colors border border-brand-primary/20" aria-label="Edit event">
                  <Edit2 className="w-3 h-3 mr-1" />Edit
                </button>
                <button type="button" onClick={handleAction('delete', onDelete)} className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200" aria-label="Delete event">
                  <Trash2 className="w-3 h-3 mr-1" />Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button type="button" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-primary-300/50 relative overflow-hidden">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
