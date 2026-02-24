import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = memo(() => {
  return (
    <>
      <SEO
        title="Page Not Found - Dada Chi Shala"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-8xl font-heading font-bold text-primary-600 mb-4">404</div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full btn-primary py-3 text-lg inline-flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full btn-outline py-3 text-lg inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Looking for something specific? Try these links:</p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/donate', label: 'Donate' },
                { to: '/volunteer', label: 'Volunteer' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-primary-600 hover:text-primary-800 hover:underline font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
