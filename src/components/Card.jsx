import { forwardRef, memo, useCallback } from 'react';
import { MapPin, Phone, Navigation, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { formatTimings } from '../utils/helpers';

const ActionButton = memo(({ onClick, className, title, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${className} text-white p-1.5 rounded-md transition-all duration-300 transform hover:scale-110 hover:rotate-3 active:scale-95`}
    title={title}
    aria-label={title}
  >
    <Icon size={14} />
  </button>
));
ActionButton.displayName = 'ActionButton';

const InfoRow = memo(({ icon: Icon, children }) => (
  <div className="flex items-center text-gray-600">
    <Icon size={12} className="mr-1.5 sm:mr-2 text-secondary-500 flex-shrink-0" />
    <span className="text-[10px] sm:text-xs truncate">{children}</span>
  </div>
));
InfoRow.displayName = 'InfoRow';

const Card = forwardRef(({ 
  data, 
  index = 0, 
  type = 'branch',
  isSelected = false, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  className = "",
  style = {}
}, ref) => {
  const branch = data;

  const openGoogleMaps = useCallback((e) => {
    e?.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch?.location || '')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [branch?.location]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit?.(branch);
  }, [branch, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete?.(branch?.id);
  }, [branch?.id, onDelete]);

  const handleContact = useCallback((e) => {
    e.stopPropagation();
    // Contact functionality
  }, []);

  if (!branch) return null;

  return (
    <div
      ref={ref}
      style={style}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex-shrink-0 animate-fade-in w-full overflow-hidden sm:hover:scale-[1.02] sm:hover:-translate-y-1 ${isSelected ? 'border-2 border-[#191947] shadow-2xl sm:scale-[1.01]' : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Branch Image */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-primary-50 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105">
              {branch.imageURL ? (
                <img
                  src={branch.imageURL}
                  alt={branch.branch_name || 'Branch'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <MapPin size={24} className="text-primary-600" />
              )}
            </div>
          </div>

          {/* Branch Info */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h4 className="text-sm sm:text-lg font-bold text-brand-primary mb-1 sm:mb-2 group-hover:text-secondary-600 transition-colors duration-300 truncate">
              {branch.branch_name}
            </h4>
            <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm line-clamp-2">
              {branch.description}
            </p>
            
            <div className="space-y-1">
              <InfoRow icon={MapPin}>{branch.location}</InfoRow>
              <InfoRow icon={Clock}>{formatTimings(branch.school_timings)}</InfoRow>
              <InfoRow icon={Users}>
                {branch.student_count ?? (45 + index * 12)} Active Students
              </InfoRow>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex flex-col gap-1.5 sm:gap-2">
            {showActions ? (
              <>
                <ActionButton onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700" title="Edit Branch" icon={Edit} />
                <ActionButton onClick={handleDelete} className="bg-red-600 hover:bg-red-700" title="Delete Branch" icon={Trash2} />
                <ActionButton onClick={openGoogleMaps} className="bg-primary-600 hover:bg-primary-700" title="Get Directions" icon={Navigation} />
              </>
            ) : (
              <>
                <ActionButton onClick={openGoogleMaps} className="bg-primary-600 hover:bg-primary-700" title="Get Directions" icon={Navigation} />
                <ActionButton onClick={handleContact} className="bg-secondary-500 hover:bg-secondary-600" title="Contact Branch" icon={Phone} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default memo(Card);
