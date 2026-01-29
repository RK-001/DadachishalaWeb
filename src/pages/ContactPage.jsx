import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Users, Clock, Heart, UserPlus } from 'lucide-react';
import { useBranches } from '../hooks/useFirebaseQueries';
import Card from '../components/Card';
import { formatTimings } from '../utils/helpers';
import SEO from '../components/SEO';

const Spinner = ({ className = '', text, textClass = 'text-gray-700' }) => (
  <div className={`text-center ${className}`}>
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 shadow-lg" />
    {text && <p className={`mt-6 text-lg font-medium animate-pulse ${textClass}`}>{text}</p>}
  </div>
);

const HeroButton = ({ onClick, icon: Icon, children }) => (
  <button onClick={onClick} className="border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#191947] transition-colors flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /><span className="truncate">{children}</span>
  </button>
);

const InfoBadge = ({ icon: Icon, children }) => (
  <div className="flex items-center text-white bg-white/10 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg">
    <Icon size={16} className="mr-1.5 sm:mr-2 flex-shrink-0" /><span className="text-xs sm:text-sm font-medium">{children}</span>
  </div>
);

const BranchesPage = () => {
  const navigate = useNavigate();
  // React Query hook - automatic caching and refetching
  const { data: branches = [], isLoading: loading } = useBranches();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (branches.length && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches, selectedBranch]);

  useEffect(() => {
    if (!branches.length) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % branches.length), 4000);
    return () => clearInterval(timer);
  }, [branches.length]);

  const openMaps = (loc) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`, '_blank');
  const currentBranch = branches[currentSlide];
  const handleBranchSelect = (branch) => { branch.imageURL && setImageLoading(true); setSelectedBranch(branch); };

  const HeroContent = () => (
    <>
      {currentBranch?.imageURL ? (
        <img src={currentBranch.imageURL} alt={currentBranch.branch_name} className="w-full h-full object-cover object-top transition-all duration-1000" key={currentSlide} />
      ) : <div className="w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100" />}
      <div className="absolute inset-0 bg-[#191947]/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom section-padding max-w-4xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-heading font-bold mb-4 sm:mb-6 text-white">{currentBranch?.branch_name || 'Our Branches'}</h1>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            {currentBranch?.school_timings && <InfoBadge icon={Clock}>{formatTimings(currentBranch.school_timings)}</InfoBadge>}
            {currentBranch?.student_count !== undefined && <InfoBadge icon={Users}>{currentBranch.student_count} Students</InfoBadge>}
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:gap-4 justify-center px-2">
            <HeroButton onClick={() => openMaps(currentBranch?.location)} icon={Navigation}>Directions</HeroButton>
            <HeroButton onClick={() => navigate('/volunteer')} icon={UserPlus}>Volunteer</HeroButton>
            <HeroButton onClick={() => navigate('/donate')} icon={Heart}>Donate</HeroButton>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {branches.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </>
  );

  const branchesSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Dada Chi Shala",
    "department": branches.map(branch => ({
      "@type": "EducationalOrganization",
      "name": branch.branch_name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": branch.location
      }
    }))
  };

  return (
    <>
      <SEO
        title="Our Branches - Dada Chi Shala | 10 Education Centers Across Pune"
        description="Dada Chi Shala operates 10 branches across Pune serving 450+ street children. Find branches in Hadapsar, Kondhwa, Katraj, Sinhagad Road and more. Visit us, volunteer or enroll a child."
        keywords="Dadachishala branches Pune, NGO locations Pune, street children schools Pune, education centers Pune, Hadapsar NGO, Kondhwa education"
        canonicalUrl="/branches"
        structuredData={branchesSchema}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-64 md:h-96">
        {loading ? (
          <div className="h-full bg-gradient-to-r from-white to-[#191947] flex items-center justify-center">
            <Spinner text="Loading branches..." textClass="text-white" />
          </div>
        ) : branches.length ? <HeroContent /> : (
          <div className="h-full bg-gradient-to-r from-white to-[#191947] flex items-center justify-center">
            <div className="max-w-4xl text-center px-4">
              <h1 className="text-3xl md:text-6xl font-heading font-bold mb-6 text-white">Our Branches</h1>
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">Spreading hope and education across Maharashtra</p>
            </div>
          </div>
        )}
      </div>

      {/* Branches Section */}
      <section className="py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-x-hidden">
        <div className="container-custom px-3 sm:px-4">
          {loading ? <Spinner className="py-12" text="Loading branches..." /> : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Branch Details Panel */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 lg:sticky lg:top-4">
                <h3 className="text-xl lg:text-2xl font-bold text-brand-primary mb-4 flex items-center">
                  <MapPin className="mr-2 text-secondary-500" size={22} />Branch Details
                </h3>
                <div className="relative h-48 md:h-64 lg:h-72 rounded-xl overflow-hidden bg-gray-200">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
                    </div>
                  )}
                  {selectedBranch?.imageURL ? (
                    <img src={selectedBranch.imageURL} alt={selectedBranch.branch_name}
                      className={`w-full h-full object-cover rounded-xl transition-all duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoading(false)} onError={() => setImageLoading(false)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                      <div className="text-center">
                        <MapPin size={48} className="text-primary-600 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-brand-primary mb-2">{selectedBranch?.branch_name || 'Loading...'}</h4>
                        <p className="text-gray-600 text-sm">No image available</p>
                      </div>
                    </div>
                  )}
                  {selectedBranch?.imageURL && !imageLoading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h4 className="text-white text-xl font-bold">{selectedBranch.branch_name}</h4>
                    </div>
                  )}
                </div>
                {selectedBranch && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                    <h4 className="text-base font-bold text-brand-primary mb-1">{selectedBranch.branch_name}</h4>
                    <p className="text-gray-600 mb-2 text-sm line-clamp-2">{selectedBranch.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                      {selectedBranch.school_timings && (
                        <div className="flex items-center text-gray-600">
                          <Clock size={14} className="mr-1.5 text-secondary-500 flex-shrink-0" />
                          <span className="text-xs"><strong>Timings: </strong>{formatTimings(selectedBranch.school_timings)}</span>
                        </div>
                      )}
                      {selectedBranch.student_count !== undefined && (
                        <div className="flex items-center text-gray-600">
                          <Users size={14} className="mr-1.5 text-secondary-500" />
                          <span className="text-xs"><strong>{selectedBranch.student_count}</strong> Students</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => openMaps(selectedBranch.location)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Navigation size={14} className="mr-1.5" />Get Directions
                    </button>
                  </div>
                )}
              </div>

              {/* Branch Cards List */}
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-xl lg:text-2xl font-bold text-brand-primary mb-3 flex items-center">
                  <Users className="mr-2 text-secondary-500" size={22} />All Branches ({branches.length})
                </h3>
                {/* Horizontal scroll on mobile, vertical scroll on desktop */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto lg:max-h-[600px] lg:pr-4 pb-4 lg:pb-0 snap-x snap-mandatory lg:snap-none scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-gray-100 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0">
                  {branches.map((branch, index) => (
                    <div key={branch.id} className="flex-shrink-0 w-[85vw] sm:w-[320px] lg:w-full snap-start">
                      <Card data={branch} type="branch" index={index}
                        isSelected={selectedBranch?.id === branch.id} onClick={() => handleBranchSelect(branch)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
};

export default BranchesPage;
