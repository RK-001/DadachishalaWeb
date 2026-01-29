import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { sanitizeUrl } from '../utils/sanitization';

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/dadachishala/', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.twitter.com/', label: 'Twitter', Icon: Twitter },
  { href: 'https://www.instagram.com/dadachishala/?hl=en', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.youtube.com/dadachishalastreetschool', label: 'YouTube', Icon: Youtube }
];

const QUICK_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/programs', label: 'Our Programs' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/events', label: 'Events' },
  { to: '/success-stories', label: 'Success Stories' }
];

const INVOLVE_LINKS = [
  { to: '/donate', label: 'Make a Donation', Icon: Heart },
  { to: '/volunteer', label: 'Become a Volunteer', Icon: Users }
];

const CONTACT_INFO = [
  { icon: MapPin, text: 'Pune, Maharashtra' },
  { icon: Phone, text: '+91 7020396723' },
  { icon: Mail, text: 'dadachishala07@gmail.com', breakAll: true }
];

const FOOTER_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/contact', label: 'Contact' }
];

const SocialButton = memo(({ href, label, Icon }) => {
  const sanitizedUrl = sanitizeUrl(href);
  return sanitizedUrl ? (
    <a href={sanitizedUrl} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
      <Icon size={16} className="text-gray-400 hover:text-white" />
    </a>
  ) : null;
});
SocialButton.displayName = 'SocialButton';

const ContactItem = memo(({ icon: Icon, text, breakAll }) => (
  <div className="flex items-start space-x-2">
    <Icon size={14} className={`text-primary-400 flex-shrink-0 sm:w-4 sm:h-4 ${breakAll ? 'mt-0.5' : ''}`} />
    <span className={`text-gray-300 text-xs sm:text-sm ${breakAll ? 'break-all' : ''}`}>{text}</span>
  </div>
));
ContactItem.displayName = 'ContactItem';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-primary-900 text-white">
      <div className="container-custom">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg flex-shrink-0">
                <img src="/logos/logo.png" alt="Dada Chi Shala Logo" loading="lazy" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-heading font-bold text-white truncate">Educare(Dada Chi Shala)</h4>
                <p className="text-sm text-gray-400">Education Trust</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Providing free quality education to underprivileged children across Maharashtra.
            </p>
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map(s => <SocialButton key={s.href} {...s} />)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Get Involved</h4>
            <div className="space-y-3">
              {INVOLVE_LINKS.map(({ to, label, Icon }) => (
                <Link key={to} to={to} className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-3">
              {CONTACT_INFO.map((info, i) => <ContactItem key={i} {...info} />)}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2025 Educare (Dada Chi Shala). All rights reserved.</p>
            <div className="flex gap-4">
              {FOOTER_LINKS.map(l => (
                <Link key={l.to} to={l.to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
