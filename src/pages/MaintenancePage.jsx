import React, { memo } from 'react';
import { Heart, Mail, AlertCircle } from 'lucide-react';

const MaintenancePage = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center text-white">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/logos/logo.png" 
            alt="Dada Chi Shala" 
            className="h-20 mx-auto mb-4"
            loading="eager"
            width="80"
            height="80"
          />
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Dada Chi Shala</h1>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-400 bg-opacity-20 mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-300" aria-hidden="true" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">We're Under Maintenance</h2>
          <p className="text-lg text-primary-100 leading-relaxed">
            We're working hard to bring you a better experience. Our website will be back online shortly.
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Thank you for your patience and continued support!
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm mb-8">
          <p className="text-sm text-primary-100 mb-4">Need to reach us?</p>
          <a
            href="mailto:contact@dadachishala.org"
            className="inline-flex items-center space-x-2 text-yellow-300 hover:text-yellow-200 font-semibold transition-colors"
            aria-label="Email contact@dadachishala.org"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            <span>contact@dadachishala.org</span>
          </a>
        </div>

        {/* Footer Message */}
        <div className="text-primary-200 text-xs">
          <p>✨ We're committed to serving our community better ✨</p>
          <p className="mt-2 flex items-center justify-center space-x-1">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>Dada Chi Shala</span>
          </p>
        </div>
      </div>
    </div>
  );
});

MaintenancePage.displayName = 'MaintenancePage';

export default MaintenancePage;
