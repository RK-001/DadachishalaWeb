import { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Users, Calendar, Image, Info, MapPin, UserCheck } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Info },
  { path: '/donate', label: 'Donate', icon: Heart },
  { path: '/about', label: 'About', icon: Info },
  { path: '/branches', label: 'Branches', icon: MapPin },
  { path: '/team', label: 'Team', icon: UserCheck },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/volunteer', label: 'Volunteer', icon: Users },

];

const NavLink = memo(({ path, label, icon: Icon, isActive, onClick, isMobile }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center ${isMobile ? 'space-x-3 px-3 py-2' : 'space-x-1 px-2 py-1'} rounded-lg transition-all duration-200 ${
      isActive ? 'bg-primary-600 text-white shadow-md' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
    }`}
  >
    <Icon size={isMobile ? 18 : 14} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
));

NavLink.displayName = 'NavLink';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 min-w-0">
            <img src="/logos/logo.png" alt="Dada Chi Shala Logo" className="h-10 md:h-14 w-auto object-contain flex-shrink-0" loading="eager" />
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-heading font-bold text-primary-800 truncate">Educare(DadaChiShala)</h1>
              <p className="text-[10px] md:text-xs text-neutral-600 truncate">Education Trust</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.path} {...item} isActive={pathname === item.path} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {NAV_ITEMS.map(item => (
                <NavLink key={item.path} {...item} isActive={pathname === item.path} onClick={closeMenu} isMobile />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);
