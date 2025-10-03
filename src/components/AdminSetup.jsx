import React, { useState } from 'react';
import { Shield, User, Mail, Lock, Check, X } from 'lucide-react';
import { setupDefaultAdmin, createAdminUser } from '../utils/adminSetup';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [customAdmin, setCustomAdmin] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleDefaultSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await setupDefaultAdmin();
      setSuccess(true);
      console.log('✅ Default admin created:', result);
    } catch (error) {
      setError(error.message);
      console.error('❌ Setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSetup = async () => {
    if (!customAdmin.email || !customAdmin.password || !customAdmin.name) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await createAdminUser(
        customAdmin.email, 
        customAdmin.password,
        { name: customAdmin.name }
      );
      setSuccess(true);
      console.log('✅ Custom admin created:', result);
    } catch (error) {
      setError(error.message);
      console.error('❌ Setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin User Created!</h2>
          <p className="text-gray-600 mb-6">
            Your admin user has been successfully created. You can now login using the credentials.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Login Credentials:</h3>
            <p className="text-sm text-blue-800">
              <strong>Email:</strong> {customAdmin.email || 'admin@dadachishala.org'}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Password:</strong> (The password you just set)
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Setup</h1>
          <p className="text-gray-600 mt-2">Create your first admin user</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
            <X className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Default Admin Option */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup</h3>
            <p className="text-sm text-gray-600 mb-4">
              Creates default admin with email: admin@dadachishala.org
            </p>
            <button
              onClick={handleDefaultSetup}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Default Admin'}
            </button>
          </div>

          <div className="text-center text-gray-500">OR</div>

          {/* Custom Admin Option */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Custom Admin</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={customAdmin.name}
                    onChange={(e) => setCustomAdmin({...customAdmin, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter admin name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={customAdmin.email}
                    onChange={(e) => setCustomAdmin({...customAdmin, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="admin@dadachishala.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={customAdmin.password}
                    onChange={(e) => setCustomAdmin({...customAdmin, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter secure password"
                  />
                </div>
              </div>

              <button
                onClick={handleCustomSetup}
                disabled={loading}
                className="w-full bg-secondary-600 text-white py-2 px-4 rounded-lg hover:bg-secondary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Custom Admin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
