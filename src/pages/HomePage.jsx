import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Award, Calendar, ArrowRight, ChevronRight, ChevronLeft, Star, Quote, GraduationCap, Home, Shield, Utensils, Play, Eye, Sparkles, Target, Globe } from 'lucide-react';
import EventCard from '../components/EventCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { getEvents, getGalleryItems, getSuccessStories, getTestimonials, getAwards } from '../services/databaseService';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    fetchUpcomingEvents();
    fetchSliderImages();
    fetchStoriesAndTestimonials();
    fetchAwards();
  }, []);

  // Function to fetch stories and testimonials from database
  const fetchStoriesAndTestimonials = async () => {
    try {
      const [storiesData, testimonialsData] = await Promise.all([
        getSuccessStories(),
        getTestimonials()
      ]);
      
      setSuccessStories(storiesData || []);
      setTestimonials(testimonialsData || []);
    } catch (error) {
      console.error('Error fetching stories and testimonials:', error);
      // Fallback to empty arrays
      setSuccessStories([]);
      setTestimonials([]);
    }
  };

  // Function to fetch awards from database
  const fetchAwards = async () => {
    try {
      const awardsData = await getAwards();
      // Process awards data to add icons (same as GalleryPage)
      const processedAwards = (awardsData || []).map(award => ({
        ...award,
        icon: getAwardIcon(award.title)
      }));
      setAwards(processedAwards);
    } catch (error) {
      console.error('Error fetching awards:', error);
      // Fallback to empty array
      setAwards([]);
    }
  };

  // Function to determine award icon based on title (same as GalleryPage)
  const getAwardIcon = (title) => {
    if (title.toLowerCase().includes('best') || title.toLowerCase().includes('top')) {
      return <Star className="w-8 h-8" />;
    } else if (title.toLowerCase().includes('excellence') || title.toLowerCase().includes('outstanding')) {
      return <Award className="w-8 h-8" />;
    } else {
      return <Award className="w-8 h-8" />;
    }
  };

  // Auto-rotate hero slides only when images are loaded
  useEffect(() => {
    if (!imagesLoaded || sliderImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length, imagesLoaded]);

  const fetchUpcomingEvents = async () => {
    try {
      const events = await getEvents(); // Get all events
      
      // Sort events by date and add dynamic status based on current date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      const eventsWithStatus = events.map(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        
        let dynamicStatus = 'upcoming';
        
        if (eventDate < today) {
          dynamicStatus = 'completed';
        } else if (eventDate.getTime() === today.getTime()) {
          dynamicStatus = 'ongoing';
        }
        
        // Use the stored status if it exists, otherwise use dynamic status
        return {
          ...event,
          displayStatus: event.status || dynamicStatus
        };
      });
      
      // Sort by date (newest first for better display)
      eventsWithStatus.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
      
      setUpcomingEvents(eventsWithStatus);
    } catch (error) {
      console.error('Error fetching events:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSliderImages = async () => {
    try {
      setSliderLoading(true);
      console.log('Fetching slider images from Firebase...');
      const images = await getGalleryItems('home-slider', 5); // Get up to 5 slider images
      console.log('Fetched slider images:', images);
      
      if (images.length > 0) {
        setSliderImages(images);
        console.log(`Found ${images.length} slider images`);
        
        // Preload images for better performance
        preloadImages(images);
      } else {
        console.log('No slider images found with category "home-slider"');
        setSliderImages([]);
        setImagesLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching slider images:', error);
      setSliderImages([]);
      setImagesLoaded(true);
    } finally {
      setSliderLoading(false);
    }
  };

  // Preload images for better performance
  const preloadImages = (images) => {
    const imagePromises = images.map((image, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(index));
          resolve(index);
        };
        img.onerror = () => {
          console.error(`Failed to preload image ${index}:`, image.image_url);
          resolve(index); // Resolve anyway to not block other images
        };
        // Add image optimization parameters
        const optimizedUrl = image.image_url.includes('firebasestorage.googleapis.com') 
          ? `${image.image_url}&w=1920&h=1080&fit=crop&auto=format,compress&q=80`
          : image.image_url;
        img.src = optimizedUrl;
      });
    });

    Promise.all(imagePromises).then(() => {
      console.log('All slider images preloaded');
      setImagesLoaded(true);
    }).catch((error) => {
      console.error('Error preloading images:', error);
      setImagesLoaded(true);
    });
  };

  const impactStats = [
    { value: 1.7, label: 'Students Taught', suffix: 'K+' },
    { value: 10, label: 'Branches in Pune', suffix: '' },
    { value: 12, label: 'Slum Areas Covered', suffix: '' },
    { value: 257, label: 'Children Deaddicted', suffix: '' },
    { value: 450, label: 'Current Students', suffix: '+' },
    { value: 524, label: 'Students in Schools', suffix: '' },
    { value: 100, label: 'Campaigns', suffix: '+' },
    { value: 250, label: 'Volunteers', suffix: '' }
  ];

  const programmes = [
    {
      title: "Education & Skill Building",
      description: "Comprehensive education programs including formal schooling, skill development, and vocational training for sustainable futures.",
      icon: <GraduationCap className="w-8 h-8 text-primary-600" />,
      link: "/programs/education"
    },
    {
      title: "Healthcare & Nutrition",
      description: "Regular health check-ups, nutritious meals, and medical care to ensure physical and mental well-being of every child.",
      icon: <Utensils className="w-8 h-8 text-primary-600" />,
      link: "/programs/healthcare"
    },
    {
      title: "Protection & Rehabilitation",
      description: "Comprehensive protection services and rehabilitation programs to help children reintegrate with families and society.",
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      link: "/programs/protection"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen bg-primary-600 overflow-hidden">
        {sliderLoading ? (
          <>
            {/* Backup Image Background during loading */}
            <div className="absolute inset-0">
              <img
                src="/images/backupImage.jpg"
                alt="Loading Background"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Primary-600 Overlay with 80% opacity */}
            <div className="absolute inset-0 bg-primary-600/80"></div>
          </>
        ) : sliderImages.length > 0 ? (
          <>
            {/* Dynamic Background Images */}
            <div className="absolute inset-0">
              {sliderImages.map((slide, index) => {
                const isCurrentSlide = index === currentSlide;
                const isImageLoaded = loadedImages.has(index);
                
                return (
                  <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      isCurrentSlide && imagesLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image_url}
                      alt={slide.title || `Background ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      onLoad={() => {
                        setLoadedImages(prev => new Set([...prev, index]));
                        if (index === 0 && !imagesLoaded) {
                          setImagesLoaded(true);
                        }
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Primary-600 Overlay with 80% opacity */}
            <div className="absolute inset-0 bg-primary-600/80"></div>
          </>
        ) : null}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-white space-y-8 pl-6 md:pl-8 lg:pl-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-white/10  rounded-full px-4 py-2 text-sm font-medium opacity-90">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Transforming Lives Since 2010</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                    Empowering
                    <span className="block text-yellow-300">Every Child's</span>
                    <span className="block">Future</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl">
                    {sliderImages.length > 0 && sliderImages[currentSlide]?.description 
                      ? sliderImages[currentSlide].description 
                      : "Providing holistic support to underprivileged children through education, healthcare, and community development across Maharashtra."
                    }
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/donate" 
                    className="group bg-white text-primary-600 hover:bg-yellow-300 hover:text-primary-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center"
                  >
                    <Heart className="mr-3 w-5 h-5 group-hover:animate-pulse" />
                    Donate Now
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link 
                    to="/volunteer" 
                    className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                  >
                    <Users className="mr-3 w-5 h-5" />
                    Join Our Mission
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">500+</div>
                    <div className="text-sm text-gray-200">Children Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">15+</div>
                    <div className="text-sm text-gray-200">Years of Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">10+</div>
                    <div className="text-sm text-gray-200">Programs Running</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm opacity-75">Discover More</span>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        {sliderImages.length > 1 && imagesLoaded && (
          <>
            <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300 transition-colors z-20 bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300 transition-colors z-20 bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </section>

      {/* Impact Statistics - Modern Design */}
      <section className="py-20 bg-gradient-to-r from-white to-gray-50 border-t border-primary-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-600 mb-6">
              Transforming Lives Every Day
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The growth of Organisation stands as a testament to the power 
            of community-driven efforts and the profound impact that 
            dedicated education can have on transforming lives.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl font-bold text-white">
                      <AnimatedCounter 
                        end={stat.value} 
                        duration={2000} 
                        suffix={stat.suffix}
                        startOnView={true}
                      />
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{stat.label}</h3>
                <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span>Learn More About Our Impact</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Programs Section - Redesigned */}
      <section className="py-20 bg-primary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              <span>Our Programs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Empowering Through Education
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Through our child-centric programs, we provide essential resources to ensure children have access to their basic rights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmes.map((programme, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100"
              >
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {programme.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary-600" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary-600 mb-4 group-hover:text-primary-700 transition-colors">
                  {programme.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {programme.description}
                </p>

                <Link 
                  to={programme.link} 
                  className="inline-flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Decorative bottom line */}
                <div className="mt-6 h-1 bg-gradient-to-r from-primary-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link 
              to="/programs" 
              className="inline-flex items-center space-x-3 bg-white text-primary-600 hover:text-primary-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore All Programs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Enhanced with Animations */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Calendar size={40} className="text-secondary-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-fade-in">
                  Events & Activities
                </h2>
              </div>
              <p className="text-xl text-gray-700 animate-slide-up">
                Join us in our activities and help make a difference
              </p>
            </div>
            <Link 
              to="/events" 
              className="hidden md:inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-primary-600 hover:to-secondary-600"
            >
              View All Events
              <ArrowRight size={20} className="ml-2 animate-bounce-x" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 shadow-lg"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-primary-300"></div>
              </div>
              <p className="mt-6 text-gray-700 text-lg font-medium animate-pulse">Loading exciting events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="relative">
              {/* Horizontal scroll container */}
              <div className="overflow-x-auto scrollbar-hide pb-6">
                <div className="flex space-x-6 min-w-max px-4">
                  {upcomingEvents.slice(0, 8).map((event, index) => (
                    <div 
                      key={event.id} 
                      className="flex-shrink-0 w-80 transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
                      style={{ 
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="relative group">
                        {/* Animated border gradient */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 animate-gradient-x"></div>
                        <div className="relative">
                          <EventCard event={event} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add more events indicator */}
                  {upcomingEvents.length > 8 && (
                    <div className="flex-shrink-0 w-80 flex items-center justify-center">
                      <Link 
                        to="/events"
                        className="bg-gradient-to-br from-brand-primary/20 to-purple-800/20 border-2 border-dashed border-brand-primary/40 rounded-xl p-8 text-center hover:from-brand-primary/30 hover:to-purple-800/30 hover:border-brand-primary/60 transition-all duration-300 group w-full h-full flex flex-col items-center justify-center min-h-[400px]"
                      >
                        <div className="text-brand-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Calendar size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-primary mb-2">View All Events</h3>
                        <p className="text-gray-600 mb-4">Discover more events and activities</p>
                        <div className="inline-flex items-center text-brand-primary font-semibold group-hover:text-secondary-600 transition-colors">
                          See More
                          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Scroll indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {upcomingEvents.slice(0, 8).map((_, index) => (
                  <div 
                    key={index}
                    className="w-2 h-2 rounded-full bg-brand-primary/30 hover:bg-brand-primary/60 transition-colors cursor-pointer"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeIn 0.5s ease-out forwards'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <Calendar size={64} className="mx-auto text-gray-300 animate-bounce" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Events Available</h3>
              <p className="text-gray-500 text-lg">Stay tuned for exciting events and activities!</p>
              <div className="mt-6">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Contact Us for Updates
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link 
              to="/events" 
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-primary-600 hover:to-secondary-600"
            >
              View All Events
              <ArrowRight size={20} className="ml-2 animate-bounce-x" />
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Redesigned */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-24 0c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-600 mb-6">
              Inspiring Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet some of our incredible alumni who have transformed their lives and are now inspiring others
            </p>
          </div>

          {successStories.length > 0 ? (
            <div className={`${successStories.length > 4 ? 'overflow-x-auto pb-4' : ''}`}>
              <div className={`flex ${successStories.length > 4 ? 'space-x-8 min-w-max' : 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'}`}>
                {successStories.map((story, index) => (
                  <div 
                    key={index} 
                    className={`group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 ${
                      successStories.length > 4 ? 'flex-shrink-0 w-80' : ''
                    }`}
                  >
                    {/* Profile Image with animated background */}
                    <div className="relative mb-6 text-center">
                      <div className="relative inline-block">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary-100 group-hover:border-primary-300 transition-colors duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Story Content */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors">
                        {story.name}
                      </h3>
                      <div className="inline-block bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {story.achievement}
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative mb-6">
                      <div className="text-primary-400 text-4xl opacity-50 absolute -top-2 -left-2">
                        <Quote size={24} />
                      </div>
                      <p className="text-gray-600 leading-relaxed italic pl-6">
                        {story.story}
                      </p>
                    </div>

                    {/* Decorative bottom line */}
                    <div className="h-1 bg-gradient-to-r from-primary-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                ))}
              </div>
              
              {/* Scroll indicator for horizontal scrolling */}
              {successStories.length > 4 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <ArrowRight className="w-4 h-4" />
                    <span>Scroll to see more stories</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto">
                  <Star className="w-12 h-12 text-primary-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Success Stories Coming Soon</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Amazing transformation stories from our beneficiaries will be featured here soon.
              </p>
            </div>
          )}

          {/* Bottom CTA */}
          {successStories.length > 0 && (
            <div className="text-center mt-16">
              <Link 
                to="/success-stories" 
                className="inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read All Stories</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Awards & Recognition - Modern Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Recognition</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-600 mb-6">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by various institutions and organizations
            </p>
          </div>

          {awards.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {awards.map((award, index) => (
                <div 
                  key={award.id || index} 
                  className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
                >
                  {/* Award Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                      {award.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Year Badge */}
                  <div className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 group-hover:bg-primary-700 transition-colors">
                    {award.year}
                  </div>

                  {/* Award Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
                    {award.title}
                  </h3>

                  {/* Organization */}
                  {award.organization && (
                    <p className="text-primary-600 text-sm font-medium mb-4 bg-primary-50 rounded-lg px-3 py-2">
                      {award.organization}
                    </p>
                  )}

                  {/* Decorative bottom element */}
                  <div className="h-1 bg-gradient-to-r from-yellow-400 to-primary-600 rounded-full mx-auto w-0 group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Awards Coming Soon</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                We're working hard to earn recognition for our impactful work in the community.
              </p>
            </div>
          )}

          {/* Bottom CTA */}
          {awards.length > 0 && (
            <div className="text-center mt-16">
              <Link 
                to="/gallery" 
                className="inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Eye className="w-5 h-5" />
                <span>View All Achievements</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Testimonials
            </h2>
            <p className="text-xl text-gray-600">
              Hear from the people whose lives we've touched
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg relative">
                  <div className="text-primary-600 text-4xl mb-4">
                    <Quote size={32} />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">Testimonials will be available here soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
