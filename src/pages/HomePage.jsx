import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Award, Calendar, ArrowRight, ChevronLeft, ChevronRight, Star, Quote, Eye, Sparkles, Target } from 'lucide-react';
import EventCard from '../components/EventCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { getEvents, getGalleryItems, getSuccessStories, getTestimonials, getAwards } from '../services/databaseService';

// Updated to text-first stats as requested in changesss.md
const IMPACT_STATS = [
  { label: '1700+ underprivileged children educated through campaigns and field classes' },
  { label: '257+ children rescued from begging & restored to education' },
  { label: '524+ students mainstreamed into schools across Pune' },
  { label: '10 branches actively functioning in slum & signal areas' },
  { label: '250+ volunteers joined our movement' },
  { label: 'Research paper submitted to UNICEF on street children education challenges' },
  { label: 'Government GR achieved ensuring admission for underdocumented kids' }
];

const HERO_STATS = [
  { val: '500+', label: 'Children Supported' },
  { val: '15+', label: 'Years of Impact' },
  { val: '10+', label: 'Programs Running' }
];

// Custom hook for auto-scroll functionality
const useAutoScroll = (ref, itemCount, cardWidth, interval, currentIndex, setCurrentIndex) => {
  useEffect(() => {
    if (itemCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(p => {
        const next = (p + 1) % itemCount;
        ref.current?.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [itemCount, cardWidth, interval, ref, setCurrentIndex]);

  const navigate = useCallback((dir) => {
    setCurrentIndex(p => {
      const next = dir === 'prev' ? (p - 1 + itemCount) % itemCount : (p + 1) % itemCount;
      ref.current?.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
      return next;
    });
  }, [itemCount, cardWidth, ref, setCurrentIndex]);

  const goTo = useCallback((i) => {
    setCurrentIndex(i);
    ref.current?.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
  }, [cardWidth, ref, setCurrentIndex]);

  return { navigate, goTo };
};

// Reusable scroll navigation component
const ScrollNav = memo(({ count, current, onNavigate, onGoTo, light = false }) => (
  <div className="flex items-center justify-center space-x-4 mt-4">
    <button type="button" onClick={() => onNavigate('prev')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${light ? 'bg-white/20 hover:bg-yellow-300 hover:text-primary-700 text-white' : 'bg-primary-100 hover:bg-primary-200'}`} aria-label="Previous">
      <ChevronLeft className={`w-5 h-5 ${light ? '' : 'text-primary-600'}`} />
    </button>
    <div className="flex space-x-2">
      {Array.from({ length: count }, (_, i) => (
        <button type="button" key={i} onClick={() => onGoTo(i)} className={`rounded-full transition-all duration-300 ${current === i ? (light ? 'bg-yellow-300 scale-125 w-6 h-3' : 'bg-primary-600 w-6 h-2.5') : (light ? 'bg-white/30 hover:bg-white/60 w-3 h-3' : 'bg-primary-200 hover:bg-primary-300 w-2.5 h-2.5')}`} aria-label={`Go to slide ${i + 1}`} />
      ))}
    </div>
    <button type="button" onClick={() => onNavigate('next')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${light ? 'bg-white/20 hover:bg-yellow-300 hover:text-primary-700 text-white' : 'bg-primary-100 hover:bg-primary-200'}`} aria-label="Next">
      <ChevronRight className={`w-5 h-5 ${light ? '' : 'text-primary-600'}`} />
    </button>
  </div>
));
ScrollNav.displayName = 'ScrollNav';

// Reusable components
const SectionHeader = memo(({ badge, badgeIcon, title, description, light = false }) => (
  <div className="text-center mb-10">
    <div className={`inline-flex items-center space-x-2 ${light ? 'bg-white/10 text-white' : 'bg-primary-100 text-primary-600'} rounded-full px-4 py-2 text-sm font-medium mb-3`}>
      {badgeIcon}<span>{badge}</span>
    </div>
    <h2 className={`text-3xl md:text-4xl font-heading font-bold ${light ? 'text-white' : 'text-primary-600'} mb-4`}>{title}</h2>
    <p className={`text-lg ${light ? 'text-gray-100' : 'text-gray-600'} max-w-3xl mx-auto`}>{description}</p>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const Spinner = memo(({ text = "Loading..." }) => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 shadow-lg" />
    <p className="mt-6 text-gray-700 text-lg font-medium animate-pulse">{text}</p>
  </div>
));
Spinner.displayName = 'Spinner';

const EmptyState = memo(({ icon: Icon, title, description, actionLink, actionText }) => (
  <div className="text-center py-16">
    <div className="relative inline-block mb-6">
      <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto">
        <Icon className="w-12 h-12 text-primary-400" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full animate-pulse" />
    </div>
    <h3 className="text-2xl font-bold text-gray-600 mb-4">{title}</h3>
    <p className="text-gray-500 text-lg max-w-md mx-auto">{description}</p>
    {actionLink && (
      <Link to={actionLink} className="mt-6 inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
        {actionText}<ArrowRight size={18} className="ml-2" />
      </Link>
    )}
  </div>
));
EmptyState.displayName = 'EmptyState';

const getAwardIcon = (title) => {
  const t = title?.toLowerCase() || '';
  return (t.includes('best') || t.includes('top') || t.includes('excellence') || t.includes('outstanding')) ? Star : Award;
};

const HomePage = () => {
  const [data, setData] = useState({ events: [], sliderImages: [], stories: [], testimonials: [], awards: [] });
  const [loading, setLoading] = useState({ events: true, slider: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [currentAward, setCurrentAward] = useState(0);
  
  const testimonialRef = useRef(null);
  const eventsRef = useRef(null);
  const storiesRef = useRef(null);
  const awardsRef = useRef(null);

  // Memoized counts for auto-scroll
  const eventsCount = useMemo(() => Math.min(8, data.events.length), [data.events.length]);

  // Custom hooks for auto-scroll
  const testimonialNav = useAutoScroll(testimonialRef, data.testimonials.length, 374, 4000, currentTestimonial, setCurrentTestimonial);
  const eventsNav = useAutoScroll(eventsRef, eventsCount, 344, 5000, currentEvent, setCurrentEvent);
  const storiesNav = useAutoScroll(storiesRef, data.stories.length, 344, 5000, currentStory, setCurrentStory);
  const awardsNav = useAutoScroll(awardsRef, data.awards.length, 304, 4500, currentAward, setCurrentAward);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [events, sliderImages, stories, testimonials, awardsData] = await Promise.all([
          getEvents(),
          getGalleryItems('home-slider', 5),
          getSuccessStories(),
          getTestimonials(),
          getAwards()
        ]);

        // Process events with dynamic status
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const processedEvents = (events || []).map(event => {
          const eventDate = new Date(event.event_date);
          eventDate.setHours(0, 0, 0, 0);
          const dynamicStatus = eventDate < today ? 'completed' : eventDate.getTime() === today.getTime() ? 'ongoing' : 'upcoming';
          return { ...event, displayStatus: event.status || dynamicStatus };
        }).sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

        // Process awards with icons
        const processedAwards = (awardsData || []).map(award => ({
          ...award, IconComponent: getAwardIcon(award.title)
        }));

        setData({
          events: processedEvents,
          sliderImages: sliderImages || [],
          stories: stories || [],
          testimonials: testimonials || [],
          awards: processedAwards
        });

        if (!sliderImages?.length) setImagesLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading({ events: false, slider: false });
      }
    };
    fetchAllData();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (!imagesLoaded || data.sliderImages.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % data.sliderImages.length), 5000);
    return () => clearInterval(timer);
  }, [data.sliderImages.length, imagesLoaded]);

  const handleSlideChange = useCallback((dir) => {
    setCurrentSlide(p => dir === 'prev' 
      ? (p - 1 + data.sliderImages.length) % data.sliderImages.length 
      : (p + 1) % data.sliderImages.length);
  }, [data.sliderImages.length]);

  const currentSlideData = data.sliderImages[currentSlide];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-primary-600 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {loading.slider ? (
            <img src="/images/backupImage.jpg" alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
          ) : data.sliderImages.map((slide, i) => (
            <div key={slide.id || i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide && imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.image_url} alt={slide.title || ''} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'}
                onLoad={() => { if (i === 0) setImagesLoaded(true); }} onError={e => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-primary-600/80" />

        {/* Hero Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-8 pl-6 md:pl-8 lg:pl-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4 text-yellow-300" /><span>Transforming Lives Since 2020</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                    <span className="block text-white">Empowering</span>
                    <span className="block text-yellow-300">Every Child's</span>
                    <span className="block text-white">Future</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl">
                    {currentSlideData?.description || "Providing holistic support to underprivileged children through education, healthcare, and community development across Maharashtra."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/donate" className="group bg-white text-primary-600 hover:bg-yellow-300 hover:text-primary-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center">
                    <Heart className="mr-3 w-5 h-5 group-hover:animate-pulse" />Donate Now<ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/volunteer" className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
                    <Users className="mr-3 w-5 h-5" />Join Our Mission
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                  {HERO_STATS.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-300">{s.val}</div>
                      <div className="text-sm text-gray-200">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm opacity-75">Discover More</span>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        {data.sliderImages.length > 1 && imagesLoaded && (
          <>
            <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
              {data.sliderImages.map((_, i) => (
                <button type="button" key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
            {['prev', 'next'].map(dir => (
              <button type="button" key={dir} onClick={() => handleSlideChange(dir)} className={`absolute ${dir === 'prev' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-white hover:text-yellow-300 z-20 bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm`} aria-label={`${dir} slide`}>
                {dir === 'prev' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            ))}
          </>
        )}
      </section>

      {/* Impact Statistics */}
      <section className="py-12 bg-gradient-to-r from-white to-gray-50 border-t border-primary-100">
        <div className="container-custom">
          <SectionHeader badge="Our Impact" badgeIcon={<Target className="w-4 h-4" />} title="Transforming Lives Every Day" 
            description={"Real change happens when a community stands together. At Dada Chi Shala, every notebook, every class, every smile is a step towards breaking the cycle of poverty and building a future full of possibilities. Our numbers reflect not just statistics, they reflect lives transformed."} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {IMPACT_STATS.map((stat, i) => (
              <div key={i} className="group bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl text-white">⭐</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{stat.label}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/about" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <span>Learn More About Our Impact</span><ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Events & Activities Section - Featured with dark background */}
      <section className="py-14 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
        
        <div className="container-custom relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm text-white rounded-full px-5 py-2 text-sm font-medium mb-4 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Events & Activities</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              Join Our <span className="text-yellow-300 relative">
                Mission
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Be a part of our journey to transform lives through meaningful events and community activities
            </p>
          </div>

          {loading.events ? (
            <div className="text-center py-8">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-yellow-300 shadow-lg" />
                <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
              </div>
              <p className="mt-4 text-white text-base font-medium animate-pulse">Loading events...</p>
            </div>
          ) : data.events.length > 0 ? (
            <>
              <div ref={eventsRef} className="overflow-x-auto scrollbar-hide pb-6 scroll-smooth snap-x snap-mandatory">
                <div className="flex space-x-6 min-w-max px-4">
                  {data.events.slice(0, 8).map((event, i) => (
                    <div key={event.id} className="flex-shrink-0 w-72 md:w-80 h-[400px] group relative snap-center" style={{ animationDelay: `${i * 0.1}s` }}>
                      {/* Card glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                      <div className="relative h-full transition-all duration-500 transform group-hover:-translate-y-6 group-hover:rotate-1 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
                        <EventCard event={event} />
                      </div>
                      {/* Decorative bottom accent */}
                      <div className="absolute -bottom-2 left-4 right-4 h-2 bg-gradient-to-r from-yellow-400 to-primary-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center blur-sm" />
                    </div>
                  ))}
                  
                  {/* View All Events Card */}
                  <Link to="/events" className="flex-shrink-0 w-72 md:w-80 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[440px] hover:from-white/25 hover:to-white/15 hover:border-yellow-300/50 transition-all duration-500 group relative overflow-hidden">
                    {/* Animated rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-white/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="absolute w-48 h-48 border border-white/5 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                    </div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                        <Calendar size={36} className="text-primary-700" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 text-center">View All Events</h3>
                      <p className="text-gray-200 mb-6 text-center">Discover more events and activities</p>
                      <span className="inline-flex items-center bg-white/20 hover:bg-yellow-300 hover:text-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 group-hover:scale-105">
                        See More<ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Enhanced Scroll indicators */}
              <ScrollNav count={eventsCount} current={currentEvent} onNavigate={eventsNav.navigate} onGoTo={eventsNav.goTo} light />
            </>
          ) : (
            <div className="text-center py-10">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                  <Calendar className="w-14 h-14 text-white/70" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full animate-bounce flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-700" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No Events Available</h3>
              <p className="text-gray-200 text-lg max-w-md mx-auto mb-8">Stay tuned for exciting events and activities!</p>
              <Link to="/contact" className="inline-flex items-center bg-gradient-to-r from-yellow-300 to-yellow-400 text-primary-700 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Contact Us for Updates<ArrowRight size={20} className="ml-3" />
              </Link>
            </div>
          )}

          {/* Enhanced Bottom CTA */}
          <div className="text-center mt-8">
            <Link to="/events" className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-primary-700 hover:from-white hover:via-white hover:to-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Calendar className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Explore All Events</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeader badge="Success Stories" badgeIcon={<Star className="w-4 h-4" />} title="Inspiring Transformations"
            description="Meet some of our incredible alumni who have transformed their lives and are now inspiring others" />

          {data.stories.length > 0 ? (
            <>
              <div ref={storiesRef} className="overflow-x-auto scrollbar-hide pb-6 scroll-smooth snap-x snap-mandatory">
                <div className="flex space-x-6 min-w-max px-6">
                  {data.stories.map((story, i) => (
                    <div key={i} className="flex-shrink-0 w-72 md:w-80 h-[380px] group relative snap-center">
                      {/* Card glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-yellow-400 to-primary-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                      <div className="relative h-full bg-white rounded-3xl p-6 transition-all duration-500 transform group-hover:-translate-y-4 shadow-xl group-hover:shadow-2xl border border-gray-100 flex flex-col">
                        <div className="relative mb-4 text-center">
                          <div className="relative inline-block">
                            <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-primary-100 group-hover:border-primary-300 transition-colors" />
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Star className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors">{story.name}</h3>
                          <div className="inline-block bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-medium">{story.achievement}</div>
                        </div>
                        <div className="relative flex-1 mb-4">
                          <Quote size={20} className="text-primary-400 opacity-50 absolute -top-1 -left-1" />
                          <p className="text-gray-600 leading-relaxed italic text-sm pl-5 line-clamp-4">{story.story}</p>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-primary-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Navigation controls */}
              <ScrollNav count={data.stories.length} current={currentStory} onNavigate={storiesNav.navigate} onGoTo={storiesNav.goTo} />
              <div className="text-center mt-8">
                <Link to="/success-stories" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <BookOpen className="w-5 h-5" /><span>Read All Stories</span><ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <EmptyState icon={Star} title="Success Stories Coming Soon" description="Amazing transformation stories from our beneficiaries will be featured here soon." />
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating circles */}
          <div className="absolute top-10 right-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>

        <div className="container-custom relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm text-white rounded-full px-5 py-2 text-sm font-medium mb-4 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Testimonials</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
               <span className="text-yellow-300 relative">
                Testimonials
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 12" fill="none">
                  <path d="M2 10C25 2 75 2 98 10" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              Hear from the people whose lives we've touched
            </p>
          </div>

          {data.testimonials.length > 0 ? (
            <>
              <div ref={testimonialRef} className="overflow-x-auto scrollbar-hide pb-6 scroll-smooth snap-x snap-mandatory">
                <div className="flex space-x-6 min-w-max px-6">
                  {data.testimonials.map((t, i) => (
                    <div key={i} className="flex-shrink-0 w-72 md:w-[350px] h-[300px] group relative snap-center">
                      {/* Card glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                      <div className="relative h-full bg-white rounded-3xl p-8 transition-all duration-500 transform group-hover:-translate-y-6 shadow-2xl group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] flex flex-col">
                        {/* Quote icon */}
                        <div className="absolute -top-1 left-8">
                          <div className="w-12 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <Quote size={24} className="text-primary-700" />
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed italic text-base mt-4 flex-1 line-clamp-5">"{t.quote}"</p>
                        
                        <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                          <div className="relative flex-shrink-0">
                            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-100 group-hover:border-primary-300 transition-colors" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-bold text-primary-600 text-lg group-hover:text-primary-700 transition-colors">{t.name}</h4>
                            <p className="text-gray-500 text-sm">{t.role}</p>
                          </div>
                        </div>
                        
                        {/* Decorative bottom line */}
                        <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll indicators */}
              {data.testimonials.length > 1 && (
                <ScrollNav count={data.testimonials.length} current={currentTestimonial} onNavigate={testimonialNav.navigate} onGoTo={testimonialNav.goTo} light />
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                  <Quote className="w-14 h-14 text-white/70" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full animate-bounce flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-700" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-gray-200 text-lg max-w-md mx-auto">Testimonials will be available here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay" />

        <div className="container-custom relative z-10">
          <SectionHeader badge="Recognition" badgeIcon={<Star className="w-4 h-4" />} title="Awards & Recognition"
            description="Our commitment to excellence has been recognized by various institutions and organizations" />

          {data.awards.length > 0 ? (
            <>
              <div ref={awardsRef} className="overflow-x-auto scrollbar-hide pb-6 scroll-smooth snap-x snap-mandatory">
                <div className="flex space-x-6 min-w-max px-6">
                  {data.awards.map((award, i) => {
                    const IconComp = award.IconComponent;
                    return (
                      <div key={award.id || i} className="flex-shrink-0 w-64 md:w-72 h-[300px] group relative snap-center">
                        {/* Card glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-primary-400 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                        <div className="relative h-full bg-white rounded-2xl p-6 text-center transition-all duration-500 transform group-hover:-translate-y-3 shadow-lg group-hover:shadow-2xl border border-gray-100 flex flex-col">
                          <div className="relative mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl mx-auto flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                              <IconComp className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-0 right-1/4 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Star className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                          <div className="inline-block bg-primary-600 text-white px-3 py-1.5 rounded-full text-sm font-bold mb-3 group-hover:bg-primary-700 transition-colors mx-auto">{award.year}</div>
                          <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">{award.title}</h3>
                          {award.organization && <p className="text-primary-600 text-xs font-medium bg-primary-50 rounded-lg px-2 py-1.5 flex-1 line-clamp-2">{award.organization}</p>}
                          <div className="mt-3 h-1 bg-gradient-to-r from-yellow-400 to-primary-600 rounded-full mx-auto w-0 group-hover:w-full transition-all duration-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Navigation controls */}
              <ScrollNav count={data.awards.length} current={currentAward} onNavigate={awardsNav.navigate} onGoTo={awardsNav.goTo} />

              <div className="text-center mt-8">
                <Link to="/gallery" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <Eye className="w-5 h-5" /><span>View All Achievements</span><ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <EmptyState icon={Award} title="Awards Coming Soon" description="We're working hard to earn recognition for our impactful work in the community." />
          )}
        </div>
      </section>

    </div>
  );
};

export default memo(HomePage);
