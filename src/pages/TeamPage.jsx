import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  Mail,
  GraduationCap,
  Award,
  MapPin,
  Quote,
  UserCheck,
  User
} from 'lucide-react';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load team members from localStorage (in real app, this would be from database)
  useEffect(() => {
    const loadTeamMembers = () => {
      try {
        const savedMembers = localStorage.getItem('teamMembers');
        if (savedMembers) {
          const members = JSON.parse(savedMembers);
          // Filter only active members
          const activeMembers = members.filter(member => member.status === 'active');
          setTeamMembers(activeMembers);
        }
      } catch (error) {
        console.error('Error loading team members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  // Filter members by category
  const founders = teamMembers.filter(member => member.category === 'founder');
  const coreTeam = teamMembers.filter(member => member.category === 'core-team');
  const volunteers = teamMembers.filter(member => member.category === 'volunteer');

  const teamStats = [
    { value: founders.length + coreTeam.length, label: "Core Team Members", suffix: "" },
    { value: volunteers.length, label: "Active Volunteers", suffix: "+" },
    { value: 15, label: "Years of Experience", suffix: "+" },
    { value: 50, label: "Countries Represented", suffix: "+" }
  ];

  const SocialIcon = ({ platform, url }) => {
    const handleClick = () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };
    
    const getPlatformLabel = (platform) => {
      switch(platform) {
        case 'linkedin': return 'LinkedIn';
        case 'instagram': return 'Instagram';
        default: return 'Website';
      }
    };

    const renderIcon = () => {
      switch(platform) {
        case 'linkedin':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          );
        case 'instagram':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          );
        default:
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          );
      }
    };
    
    return (
      <button
        onClick={handleClick}
        className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group border border-gray-200 flex items-center justify-center"
        title={getPlatformLabel(platform)}
      >
        <div 
          className={`transition-colors duration-300 ${
            platform === 'linkedin' ? 'text-blue-700 group-hover:text-blue-800' :
            platform === 'instagram' ? 'text-pink-700 group-hover:text-pink-800' :
            'text-gray-700 group-hover:text-gray-800'
          }`}
        >
          {renderIcon()}
        </div>
      </button>
    );
  };

  return (
    <div className="overflow-hidden">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team members...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary-400/30 rounded-full animate-ping"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-secondary-500 rounded-full p-4 mr-4">
                <Users size={40} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold">
                Meet <span className="text-secondary-300">Our Team</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Dedicated individuals working together to transform lives through education, 
              care, and community support. Meet the passionate people behind our mission.
            </p>
            
            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {teamStats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold text-secondary-300 mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="text-primary-100 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Our Founders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Visionary leaders who started this journey with a dream to provide quality education 
              and care to every underprivileged child in Maharashtra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {founders.length > 0 ? founders.map((founder, index) => (
              <div 
                key={founder.id}
                className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-primary-600"
              >
                {/* Header with Image */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    {founder.image ? (
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg ring-4 ring-primary-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto shadow-lg ring-4 ring-primary-200">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-secondary-500 rounded-full p-2">
                      <Award size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-primary mb-2">{founder.name}</h3>
                  <p className="text-lg font-semibold text-secondary-600 mb-2">{founder.position}</p>
                  {founder.education && (
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                      <GraduationCap size={18} className="mr-2" />
                      <span className="font-medium">{founder.education}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {founder.description && (
                  <p className="text-gray-700 leading-relaxed mb-6 text-center">
                    {founder.description}
                  </p>
                )}

                {/* Social Links */}
                {(founder.linkedin || founder.instagram) && (
                  <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200">
                    {founder.linkedin && (
                      <SocialIcon platform="linkedin" url={founder.linkedin} />
                    )}
                    {founder.instagram && (
                      <SocialIcon platform="instagram" url={founder.instagram} />
                    )}
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-2 text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No founders added yet</h3>
                <p className="text-gray-400">Founders will appear here once they are added through the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Core Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experienced professionals driving our mission forward with expertise, 
              dedication, and unwavering commitment to child welfare and education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreTeam.length > 0 ? coreTeam.map((member, index) => (
              <div 
                key={member.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-primary-600"
              >
                {/* Member Image */}
                <div className="relative mb-6">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg ring-4 ring-primary-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-brand-primary mb-2 group-hover:text-secondary-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-2">{member.position}</p>
                  {member.education && (
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                      <GraduationCap size={16} className="mr-2" />
                      <span className="text-sm">{member.education}</span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No core team members added yet</h3>
                <p className="text-gray-400">Core team members will appear here once they are added through the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Volunteers Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Our Volunteers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from our amazing volunteers who dedicate their time, skills, and hearts 
              to make a difference in children's lives. Their stories inspire us every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteers.length > 0 ? volunteers.map((volunteer, index) => (
              <div 
                key={volunteer.id}
                className="bg-gradient-to-br from-white to-primary-25 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-600"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Quote Icon */}
                <div className="text-secondary-500 mb-4">
                  <Quote size={32} />
                </div>

                {/* Statement */}
                {volunteer.description ? (
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{volunteer.description}"
                  </p>
                ) : (
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Working with Dada Chi Shala has been an incredible experience. Contributing to the mission of transforming children's lives is truly rewarding."
                  </p>
                )}

                {/* Volunteer Info */}
                <div className="flex items-center">
                  {volunteer.image ? (
                    <img
                      src={volunteer.image}
                      alt={volunteer.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg ring-4 ring-primary-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 ring-2 ring-primary-200">
                      <User size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="font-bold text-brand-primary">{volunteer.name}</h4>
                    <p className="text-sm text-secondary-600 font-semibold">{volunteer.position}</p>
                    {volunteer.duration && (
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <span>{volunteer.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No volunteers added yet</h3>
                <p className="text-gray-400">Volunteer stories will appear here once they are added through the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </section>

        </>
      )}
    </div>
  );
};

export default TeamPage;
