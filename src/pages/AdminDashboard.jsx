import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Heart, Calendar, Image, BarChart3, MapPin, UserCheck, Star } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import EventManagement from '../components/EventManagement';
import GalleryManagement from '../components/GalleryManagement';
import VolunteerManagement from '../components/VolunteerManagement';
import BranchManagement from '../components/BranchManagement';
import TeamManagement from '../components/TeamManagement';
import StoriesTestimonialsManagement from '../components/StoriesTestimonialsManagement';
import { getEvents, getGalleryItems, getVolunteers } from '../services/databaseService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [statsLoading, setStatsLoading] = useState(true);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const tabs = [
    { id: 'team', label: 'Team', icon: UserCheck },
    { id: 'stories', label: 'Stories & Testimonials', icon: Star },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'branches', label: 'Branches', icon: MapPin },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamManagement />;
      case 'stories':
        return <StoriesTestimonialsManagement />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'branches':
        return <BranchManagement />;
      case 'donations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Donation Management</h2>
            <p className="text-gray-600">Donation management features will be implemented here.</p>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <EventManagement />
          </div>
        );
      case 'gallery':
        return <GalleryManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen flex-shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          
          <nav className="mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-x-hidden max-w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
