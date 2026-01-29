import { memo, useCallback } from 'react';
import { Calendar, MapPin, Clock, Users, Edit2, Trash2, Eye } from 'lucide-react';
import { sanitizeString, sanitizeUrl } from '../utils/sanitization';

const STATUS_STYLES = {
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-gray-50 text-gray-700 border-gray-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
};

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
const formatTime = (timeString) => timeString ? new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
const capitalize = (str) => str?.charAt(0).toUpperCase() + str.slice(1) || '';

const DetailItem = memo(({ icon: Icon, children }) => (
  <div className="flex items-center text-brand-primary/80">
    <div className="bg-brand-primary/10 rounded-full p-1 mr-2">
      <Icon className="w-3 h-3 text-brand-primary" />
    </div>
    <span className="font-medium">{children}</span>
  </div>
));
DetailItem.displayName = 'DetailItem';

const ActionButton = memo(({ onClick, icon: Icon, variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border-brand-primary/20',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
    view: 'text-brand-primary/70 hover:text-brand-primary'
  };
  return (
    <button type="button" onClick={onClick} className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors border ${variants[variant]}`} {...props}>
      <Icon className="w-3 h-3 mr-1" />{children}
    </button>
  );
});
ActionButton.displayName = 'ActionButton';

const EventCard = ({ event, onEdit, onDelete, onView, isAdmin = false }) => {
  if (!event) return null;

  const title = sanitizeString(event?.title || event?.event_name || '');
  const image = event?.image_url || event?.imageURL;
  const description = sanitizeString(event?.description || '');
  const location = sanitizeString(event?.location || '');
  const status = event?.displayStatus || event?.status;
  const category = event?.category;
  const mapLocation = event?.map_location;
  const hasMapLink = mapLocation || (event?.latitude && event?.longitude);

  const handleDirections = useCallback(() => {
    if (!hasMapLink) return;
    
    let url;
    if (mapLocation?.includes('iframe')) {
      const match = mapLocation.match(/src="([^"]*)"/);
      url = match?.[1];
    } else if (mapLocation) {
      url = mapLocation;
    } else if (event?.latitude && event?.longitude) {
      url = `https://maps.google.com?q=${event.latitude},${event.longitude}`;
    }
    
    const sanitizedUrl = sanitizeUrl(url);
    if (sanitizedUrl) window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
  }, [hasMapLink, mapLocation, event?.latitude, event?.longitude]);

  const statusStyle = STATUS_STYLES[status] || 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col border hover:border-primary-400">
      {image && (
        <div className="h-48 overflow-hidden flex-shrink-0">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
          {status && <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>{capitalize(status)}</span>}
          {isAdmin && category && <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 border-secondary-200">{capitalize(category)}</span>}
        </div>

        <h3 className="text-lg font-bold text-brand-primary mb-2 line-clamp-2">{title}</h3>
        {description && <p className="text-brand-primary/70 text-sm mb-3 line-clamp-2 leading-relaxed">{description}</p>}

        <div className="flex flex-wrap gap-3 mb-4 flex-1 text-xs">
          <DetailItem icon={Calendar}>{formatDate(event?.event_date)}</DetailItem>
          {event?.event_time && <DetailItem icon={Clock}>{formatTime(event.event_time)}</DetailItem>}
          
          {location && (
            <div className="flex items-center justify-between text-sm text-brand-primary/80 w-full">
              <div className="flex items-center flex-1 mr-2">
                <div className="bg-brand-primary/10 rounded-full p-1.5 mr-3">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                </div>
                <span className="truncate font-medium">{location}</span>
              </div>
              {hasMapLink && (
                <button type="button" onClick={handleDirections} className="text-xs bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1 rounded-full transition-colors border border-brand-primary/20" aria-label="Get directions">
                  Get Directions
                </button>
              )}
            </div>
          )}
          
          {event?.max_participants && <DetailItem icon={Users}>Max {event.max_participants} participants</DetailItem>}
        </div>

        <div className="flex-shrink-0">
          {isAdmin ? (
            <div className="flex justify-between items-center pt-3 border-t border-brand-primary/20">
              <ActionButton onClick={() => onView?.(event)} icon={Eye} variant="view" aria-label="View event">View</ActionButton>
              <div className="flex space-x-2">
                <ActionButton onClick={() => onEdit?.(event)} icon={Edit2} variant="primary" aria-label="Edit event">Edit</ActionButton>
                <ActionButton onClick={() => onDelete?.(event)} icon={Trash2} variant="danger" aria-label="Delete event">Delete</ActionButton>
              </div>
            </div>
          ) : (
            <button type="button" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
              Learn More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);
