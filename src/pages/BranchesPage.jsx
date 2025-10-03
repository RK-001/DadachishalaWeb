import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Navigation, Users, Clock, Heart, UserPlus } from 'lucide-react';
import { getBranches } from '../services/databaseService';
import Card from '../components/Card';
import { formatTimings } from '../utils/helpers';

const BranchesPage = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [imageLoading, setImageLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const mapRef = useRef(null);
  const observerRef = useRef(null);
  const slideInterval = useRef(null);

  useEffect(() => {
    fetchBranches();
    setupScrollObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Auto-slider effect
  useEffect(() => {
    if (branches.length > 0) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % branches.length);
      }, 4000); // Change slide every 4 seconds

      return () => {
        if (slideInterval.current) {
          clearInterval(slideInterval.current);
        }
      };
    }
  }, [branches.length]);

  const fetchBranches = async () => {
    try {
      const branchData = await getBranches();
      setBranches(branchData);
      // Auto-select first branch on page load
      if (branchData.length > 0) {
        setSelectedBranch(branchData[0]);
      }
      // Preload all branch images for faster switching
      preloadBranchImages(branchData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const preloadBranchImages = (branchData) => {
    branchData.forEach((branch) => {
      if (branch.imageURL) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, branch.imageURL]));
        };
        img.src = branch.imageURL;
      }
    });
  };

  const setupScrollObserver = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );
  };

  const handleBranchSelect = (branch) => {
    // Only show loading if image isn't preloaded
    if (branch.imageURL && !preloadedImages.has(branch.imageURL)) {
      setImageLoading(true);
    }
    
    setSelectedBranch(branch);
    
    // Animate map pin highlight
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.style.transform = 'scale(1.02)';
      setTimeout(() => {
        mapElement.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const openGoogleMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  const handleVolunteerClick = () => {
    navigate('/volunteer');
  };

  const handleDonationClick = () => {
    navigate('/donation');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Image Slider */}
      <div className="relative overflow-hidden">
        {loading ? (
          <div className="h-96 bg-gradient-to-r from-white to-[#191947] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 shadow-lg"></div>
              <p className="mt-6 text-white text-lg font-medium animate-pulse">Loading branches...</p>
            </div>
          </div>
        ) : branches.length > 0 ? (
          <div className="relative h-96">
            {/* Branch Background Image */}
            {branches[currentSlide]?.imageURL ? (
              <img 
                src={branches[currentSlide].imageURL}
                alt={branches[currentSlide].branch_name}
                className="w-[100%] h-full object-cover object-top transition-all duration-1000 ease-in-out"
                key={currentSlide}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100"></div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#191947] to-[#191947] opacity-40"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container-custom section-padding">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-white">
                    {branches[currentSlide]?.branch_name || 'Our Branches'}
                  </h1>

                  {/* Branch Info */}
                  <div className="flex flex-wrap justify-center gap-6 mb-8">

                    {branches[currentSlide]?.school_timings && (
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Clock size={20} className="mr-2" />
                        <span className="text-sm font-medium">{formatTimings(branches[currentSlide].school_timings)}</span>
                      </div>
                    )}
                    
                    {branches[currentSlide]?.student_count !== undefined && (
                      <div className="flex items-center text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Users size={20} className="mr-2" />
                        <span className="text-sm font-medium">{branches[currentSlide].student_count} Students</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => openGoogleMaps(branches[currentSlide]?.location)}
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#191947] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Get Directions
                    </button>
                    <button 
                      onClick={handleVolunteerClick}
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#191947] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Volunteer With Us
                    </button>
                    <button 
                      onClick={handleDonationClick}
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#191947] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Support Our Cause
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {branches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-r from-white to-[#191947] flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-white">
                Our Branches
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Spreading hope and education across Maharashtra through our dedicated branch network
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Find Our Branches Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 shadow-lg"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-primary-300"></div>
              </div>
              <p className="mt-6 text-gray-700 text-lg font-medium animate-pulse">Loading branches...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Interactive Map Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-brand-primary mb-6 flex items-center">
                  <MapPin className="mr-2 text-secondary-500" size={24} />
                  Branch Details
                </h3>
                
                {/* Branch Image Container */}
                <div 
                  ref={mapRef}
                  className="relative h-96 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden transition-transform duration-200"
                >
                  {/* Branch Image Display */}
                  <div className="absolute inset-0 bg-gray-200 rounded-xl">
                    {/* Loading Overlay */}
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
                      </div>
                    )}
                    
                    {selectedBranch?.imageURL ? (
                      <img 
                        src={selectedBranch.imageURL}
                        alt={selectedBranch.branch_name}
                        className={`w-full h-full object-cover rounded-xl transition-all duration-500 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                        <div className="text-center">
                          <MapPin size={48} className="text-primary-600 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-brand-primary mb-2">
                            {selectedBranch?.branch_name || 'Loading...'}
                          </h4>
                          <p className="text-gray-600 text-sm">No image available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Branch Name Overlay */}
                    {selectedBranch && !imageLoading && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300">
                        <h4 className="text-white text-xl font-bold mb-1">
                          {selectedBranch.branch_name}
                        </h4>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Branch Info */}
                {selectedBranch && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl animate-fade-in">
                    <h4 className="text-lg font-bold text-brand-primary mb-2">
                      {selectedBranch.branch_name}
                    </h4>
                    <p className="text-gray-600 mb-3">{selectedBranch.description}</p>
                    
                    {/* Branch Details */}
                    <div className="space-y-2 mb-4">
                    
                      {/* School Timings */}
                      {selectedBranch.school_timings && (
                        <div className="flex items-center text-gray-600">
                          <Clock size={16} className="mr-2 text-secondary-500 flex-shrink-0" />
                          <span className="text-sm">
                            <span className="font-medium">School Timings: </span>
                            {formatTimings(selectedBranch.school_timings)}
                          </span>
                        </div>
                      )}
                      
                      {/* Student Count */}
                      {selectedBranch.student_count !== undefined && (
                        <div className="flex items-center text-gray-600">
                          <Users size={16} className="mr-2 text-secondary-500" />
                          <span className="text-sm">
                            <span className="font-medium">{selectedBranch.student_count}</span> Active Students
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => openGoogleMaps(selectedBranch.location)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Navigation size={16} className="mr-2" />
                      Get Directions
                    </button>
                  </div>
                )}
              </div>

              {/* Branch Cards List */}
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-brand-primary mb-6 flex items-center flex-shrink-0">
                  <Users className="mr-2 text-secondary-500" size={24} />
                  All Branches ({branches.length})
                </h3>
                
                {/* Horizontal Scrollable Container */}
                <div className="h-[700px] overflow-hidden">
                  <div className="h-full overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-gray-100">
                    {branches.map((branch, index) => (
                      <Card
                        key={branch.id}
                        data={branch}
                        type="branch"
                        index={index}
                        isSelected={selectedBranch?.id === branch.id}
                        onClick={() => handleBranchSelect(branch)}
                        className={`${
                          visibleCards.has(index) ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        ref={(el) => {
                          if (el && observerRef.current) {
                            el.dataset.index = index;
                            observerRef.current.observe(el);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default BranchesPage;
