import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

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
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Dada Chi Shala
                </h3>
                <p className="text-sm text-gray-400">Educare Education Trust</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Providing free quality education to underprivileged children across Maharashtra.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/dadachishala/" className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://www.instagram.com/dadachishala/?hl=en" className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://www.youtube.com/dadachishalastreetschool" className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={16} className="text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Get Involved</h4>
            <div className="space-y-3">
              <Link 
                to="/donate" 
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors text-sm"
              >
                <Heart size={16} />
                <span>Make a Donation</span>
              </Link>
              <Link 
                to="/volunteer" 
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors text-sm"
              >
                <Users size={16} />
                <span>Become a Volunteer</span>
              </Link>
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
              © 2025 Dada Chi Shala. All rights reserved.
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

export default Footer;
