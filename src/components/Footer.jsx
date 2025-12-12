import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

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

const SocialButton = memo(({ href, label, Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
  >
    <Icon size={16} className="text-gray-400 hover:text-white" />
  </a>
));
SocialButton.displayName = 'SocialButton';

const NavLinkItem = memo(({ to, label }) => (
  <li>
    <Link to={to} aria-label={label} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
      {label}
    </Link>
  </li>
));
NavLinkItem.displayName = 'NavLinkItem';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-primary-900 text-white relative">
      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section with Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center">
                <img
                  src="/logos/logo.png"
                  alt="Dada Chi Shala Logo"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Educare(Dada Chi Shala)
                </h3>
                <p className="text-sm text-gray-400">Education Trust</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Providing free quality education to underprivileged children across Maharashtra.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map(s => <SocialButton key={s.href} href={s.href} label={s.label} Icon={s.Icon} />)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => <NavLinkItem key={l.to} to={l.to} label={l.label} />)}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Get Involved</h4>
            <div className="space-y-3">
              {INVOLVE_LINKS.map(({ to, label, Icon }) => (
                <Link key={to} to={to} aria-label={label} className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary-400" />
                <span className="text-gray-300 text-sm">Pune, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-400" />
                <span className="text-gray-300 text-sm">+91 7020396723</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-400" />
                <span className="text-gray-300 text-sm">dadachishala07@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Educare (Dada Chi Shala). All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
