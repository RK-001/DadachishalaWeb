import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Home, Award, ArrowRight, MessageCircle } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

// Static constants moved outside the component for performance
const IMPACT_STATS = [
  { value: 1700, label: 'Students Taught', suffix: '+' },
  { value: 10, label: 'Branches in Pune', suffix: '' },
  { value: 12, label: 'Slum Areas Covered', suffix: '' },
  { value: 257, label: 'Children Deaddicted', suffix: '' },
  { value: 450, label: 'Current Students', suffix: '+' },
  { value: 524, label: 'Students in Schools', suffix: '' },
  { value: 100, label: 'Campaigns', suffix: '+' },
  { value: 250, label: 'Volunteers', suffix: '' }
];

const FOCUS_AREAS = [
  {
    icon: <BookOpen className="w-8 h-8 text-primary-600" />,
    title: 'Quality Education',
    description: 'Providing comprehensive education to underprivileged children, ensuring they receive the knowledge and skills needed for a brighter future.'
  },
  {
    icon: <Heart className="w-8 h-8 text-primary-600" />,
    title: 'Healthcare & Nutrition',
    description: 'Ensuring children receive proper healthcare, nutritious meals, and regular health check-ups to support their physical and mental development.'
  },
  {
    icon: <Users className="w-8 h-8 text-primary-600" />,
    title: 'Community Development',
    description: 'Building stronger communities through skill development programs, awareness campaigns, and empowering local families to become self-sufficient.'
  },
  {
    icon: <Home className="w-8 h-8 text-primary-600" />,
    title: 'Safe Environment',
    description: 'Creating a secure, nurturing environment where children can learn, grow, and develop their full potential without fear or discrimination.'
  }
];

const TESTIMONIAL_FALLBACK = [
  {
    quote: "Dada Chi Shala gave my daughter the education I could never afford. Today she's pursuing her dreams with confidence.",
    name: 'Sunita Devi',
    role: 'Parent'
  },
  {
    quote: 'The dedication of the teachers and staff here is incredible. They truly care about each child\'s future.',
    name: 'Rajesh Kumar',
    role: 'Community Member'
  },
  {
    quote: 'Supporting Dada Chi Shala means investing in the future of our society. Their work is truly transformational.',
    name: 'Dr. Priya Sharma',
    role: 'Supporter'
  }
];

const StatCard = memo(({ stat }) => (
  <div className="text-center transform hover:scale-105 transition-transform duration-300">
    <div className="bg-primary-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-primary-600">
          <AnimatedCounter end={stat.value} duration={1500} suffix={stat.suffix} startOnView />
        </div>
      </div>
    </div>
    <p className="font-semibold text-gray-900 text-sm">{stat.label}</p>
  </div>
));
StatCard.displayName = 'StatCard';

const FocusCard = memo(({ item }) => (
  <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">{item.icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{item.title}</h4>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </div>
    </div>
  </div>
));
FocusCard.displayName = 'FocusCard';

const TestimonialCard = memo(({ t }) => (
  <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
    <div className="text-primary-600 text-4xl mb-4">"</div>
    <p className="text-gray-700 mb-6 leading-relaxed italic">{t.quote}</p>
    <div className="border-t pt-4">
      <p className="font-semibold text-gray-900">{t.name}</p>
      <p className="text-sm text-gray-600">{t.role}</p>
    </div>
  </div>
));
TestimonialCard.displayName = 'TestimonialCard';

const AboutPage = () => {
  const [testimonials, setTestimonials] = useState([]);

  const loadTestimonials = useCallback(() => {
    try {
      const teamData = localStorage.getItem('teamMembers');
      if (!teamData) {
        setTestimonials(TESTIMONIAL_FALLBACK);
        return;
      }
      const allMembers = JSON.parse(teamData);
      const communityVoices = (allMembers || []).filter(m => m.category === 'community-voice' && m.status === 'active');
      const formatted = communityVoices.map(m => ({ quote: m.description || m.education || 'Thank you for all the wonderful work!', name: m.name, role: m.position || 'Community Member' }));
      setTestimonials(formatted.length ? formatted : TESTIMONIAL_FALLBACK);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setTestimonials(TESTIMONIAL_FALLBACK);
    }
  }, []);

  useEffect(() => { loadTestimonials(); }, [loadTestimonials]);

  return (
    <div className="min-h-screen">

      {/* Hero / Intro Section - About */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-brand-primary mb-6">
                Educating Streets. Empowering Childhoods. Transforming Futures.
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Dada Chi Shala is a youth-driven non-governmental organisation working to make education accessible for street & slum children who are deprived of schooling, dignity and opportunity.
                </p>
                <p>
                  What began as one boy teaching under a tree with a few notebooks is today a movement that has educated more than <strong>1700+ children</strong>, rescued hundreds from begging & built a family of <strong>250+ volunteers</strong> across Maharashtra.
                </p>
                <div className="mt-4 text-primary-700 font-medium">
                  <strong>Who We Are</strong>
                  <p className="mt-2 text-gray-700">
                    We operate where schools often cannot—footpaths, traffic signals, slums & open grounds—turning them into classrooms filled with hope. Our goal is simple yet powerful: No child should grow up on the streets without education, safety and a dream. Dada Chi Shala currently runs 10 learning centers/branches in Pune, providing daily learning classes, remedial teaching, life-skills, activities & formal school admissions for underprivileged children.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-primary-600">
                <h3 className="text-2xl font-bold mb-4">Vision & Mission</h3>
                <p className="text-lg font-semibold text-brand-primary mb-3">
                  <strong>Vision:</strong> A future where every underprivileged child receives free, fair and quality education.
                </p>
                <p className="text-md mb-2">
                  <strong>Mission:</strong>
                </p>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Ensure free primary & secondary education for street children</li>
                  <li>Mainstream them into schools & reduce dropouts</li>
                  <li>Eliminate educational discrimination & child begging</li>
                  <li>Promote skill development, digital literacy & self-reliance</li>
                  <li>Inspire youth participation in social change</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Origin Story & What We Do */}
      <div className="section-padding bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">Our Origin Story</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">When Adv. Abhijeet Suman Pokharnikar (then a college student) saw children begging for coins instead of carrying schoolbags, he asked one question — "Why should poverty decide a child’s destiny?" That question became a revolution. With no funding and no building—only belief—he began teaching children under a tree at Saras Baug, Pune. Slowly, volunteers joined. More children gathered. Streets turned into classrooms. Dreams turned into achievements.</p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4">What We Do</h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>We deliver on-the-ground programs that bring learning and care directly to children who would otherwise miss out on formal education.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {FOCUS_AREAS.map((f, i) => <FocusCard key={i} item={f} />)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 md:p-12 text-yellow-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-yellow-700">
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-900">Recognition & Support</h3>
                <div className="space-y-4 text-yellow-900 leading-relaxed text-lg">
                  <p>
                    Our journey has been recognized widely, thanks to the unwavering support of <strong className="text-yellow-800">Dr. Sindhutai Sapkal (Maai)</strong>, extensive media coverage, and local newspapers. Their belief in our mission has amplified our voice and helped us gain mass recognition, furthering our efforts in education and child welfare.
                  </p>
                  <p className="font-medium">
                    "The growth of Dadachishala stands as a testament to the power of community-driven initiatives and the transformative impact of education."
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">Because a child holding a book will never need to hold a begging bowl. Because education is the only real exit from poverty. Because the streets deserve classrooms too. ✨ We are building futures — one child at a time. 👉 Join us as a Volunteer or Donor & become part of this change.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Report Section */}
      <div className="section-padding bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                Annual Report 2024
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Discover our journey, achievements, and impact through our comprehensive annual report. 
                See how your support has transformed lives and communities.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold text-primary-900 mb-4">
                    2024 Impact Report
                  </h3>
                  <div className="space-y-3 text-gray-700 mb-6">
                    <p className="flex items-center">
                      <Award className="w-5 h-5 text-secondary-600 mr-2" />
                      Comprehensive overview of our programs and achievements
                    </p>
                    <p className="flex items-center">
                      <Users className="w-5 h-5 text-secondary-600 mr-2" />
                      Detailed impact statistics and success stories
                    </p>
                    <p className="flex items-center">
                      <Heart className="w-5 h-5 text-secondary-600 mr-2" />
                      Financial transparency and accountability
                    </p>
                    <p className="flex items-center">
                      <BookOpen className="w-5 h-5 text-secondary-600 mr-2" />
                      Future plans and vision for 2025
                    </p>
                  </div>
                  
                  <a 
                    href="/ANNUAL REPORT.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Download Annual Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-6 rounded-xl">
                    <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                    <p className="text-sm text-primary-700 font-medium">
                      Annual Report<br />2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact Section - Enhanced */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">The growth of Organisation stands as a testament to the power of community-driven efforts and the profound impact that dedicated education can have on transforming lives.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {IMPACT_STATS.map((s, i) => <StatCard key={i} stat={s} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-brand-primary mb-4">Voices from Our Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from the families, supporters, and community members whose lives have been touched by our work</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials && testimonials.length ? testimonials.map((t, i) => <TestimonialCard key={i} t={t} />) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600 text-lg">Community voices will appear here once they are added through the admin panel.</p>
                <p className="text-gray-500 text-sm mt-2">We value feedback from our community members, parents, and supporters.</p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default AboutPage;
