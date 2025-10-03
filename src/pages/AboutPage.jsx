import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Home, Award, ArrowRight, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const AboutPage = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Load testimonials from team management data
  useEffect(() => {
    const loadTestimonials = () => {
      try {
        const teamData = localStorage.getItem('teamMembers');
        if (teamData) {
          const allMembers = JSON.parse(teamData);
          const communityVoices = allMembers.filter(member => 
            member.category === 'community-voice' && member.status === 'active'
          );
          
          // Transform team member data to testimonial format
          const formattedTestimonials = communityVoices.map(member => ({
            quote: member.description || member.education || "Thank you for all the wonderful work!",
            name: member.name,
            role: member.position || "Community Member"
          }));
          
          setTestimonials(formattedTestimonials);
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Fallback to hardcoded testimonials if there's an error
        setTestimonials([
          {
            quote: "Dada Chi Shala gave my daughter the education I could never afford. Today she's pursuing her dreams with confidence.",
            name: "Sunita Devi",
            role: "Parent"
          },
          {
            quote: "The dedication of the teachers and staff here is incredible. They truly care about each child's future.",
            name: "Rajesh Kumar",
            role: "Community Member"
          },
          {
            quote: "Supporting Dada Chi Shala means investing in the future of our society. Their work is truly transformational.",
            name: "Dr. Priya Sharma",
            role: "Supporter"
          }
        ]);
      }
    };

    loadTestimonials();
  }, []);
  const impactStats = [
    { value: 1700, label: 'Students Taught', suffix: '+' },
    { value: 10, label: 'Branches in Pune', suffix: '' },
    { value: 12, label: 'Slum Areas Covered', suffix: '' },
    { value: 257, label: 'Children Deaddicted', suffix: '' },
    { value: 450, label: 'Current Students', suffix: '+' },
    { value: 524, label: 'Students in Schools', suffix: '' },
    { value: 100, label: 'Campaigns', suffix: '+' },
    { value: 250, label: 'Volunteers', suffix: '' }
  ];

  const focusAreas = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: "Quality Education",
      description: "Providing comprehensive education to underprivileged children, ensuring they receive the knowledge and skills needed for a brighter future."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      title: "Healthcare & Nutrition",
      description: "Ensuring children receive proper healthcare, nutritious meals, and regular health check-ups to support their physical and mental development."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Community Development",
      description: "Building stronger communities through skill development programs, awareness campaigns, and empowering local families to become self-sufficient."
    },
    {
      icon: <Home className="w-8 h-8 text-primary-600" />,
      title: "Safe Environment",
      description: "Creating a secure, nurturing environment where children can learn, grow, and develop their full potential without fear or discrimination."
    }
  ];

  return (
    <div className="min-h-screen">

      {/* Our Story Section */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-brand-primary mb-6">
                About Educare Educational Trust
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  <strong style={{color: '#191947'}}>Dadachi Shala</strong> is a non-governmental organization (NGO) in Maharashtra, founded by <strong style={{color: '#191947'}}>Adv. Abhijeet Pokharnikar</strong> and co-founded by <strong style={{color: '#191947'}}>Shubham Mane</strong>. Our primary mission is to provide free education to underprivileged children, particularly those living on the streets and slum areas.
                </p>
                <p>
                  Adv. Abhijeet Pokharnikar, a dedicated student and social worker from Pune, initiated this effort to help children of labourers and uneducated people from slum areas continue their education. What started as a compassionate vision has grown into a transformative movement.
                </p>
                <p>
                  Today, our school operates in various locations across Pune district, teaching around <strong style={{color: '#191947'}}>450 underprivileged children</strong> throughout Maharashtra. <strong style={{color: '#191947'}}>Dadachi Shala</strong> aims to break the cycle of poverty by offering education, instilling confidence, and promoting self-reliance among these children.
                </p>
                <p className="text-primary-700 font-medium">
                  People now address us as <strong style={{color: '#191947'}}>Dadachishala</strong> - a name that has become synonymous with hope, education, and transformation in our communities.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-primary-600">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg font-bold text-brand-primary mb-2 group-hover:text-secondary-600 transition-colors duration-300">
                  We envision a world where every child has access to quality education, proper nutrition, and healthcare. A society where no child is left behind due to poverty, discrimination, or lack of opportunity. We strive to create empowered communities where families can break free from the cycle of poverty and build dignified, fulfilling lives.
                </p>
                <div className="bg-primary-700 rounded-lg p-4">
                  <p className="text-sm text-primary-200">
                    "Education is the most powerful weapon which you can use to change the world." - Our guiding principle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact & Recognition Section */}
      <div className="section-padding bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">
                The Impact of Dadachishala
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                At Dadachishala, we take immense pride in the impact we have created within various communities. 
                We were able to touch the lives of <strong style={{color: '#191947'}}>1700 underprivileged street children</strong>.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-4">
                    Empowering Communities
                  </h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Beyond education, we strive to empower communities in multiple ways. Our initiatives include:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Legal literacy programs</strong> to educate families about their rights</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Smart teaching techniques</strong> using tablets and modern technology</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Youth participation programs</strong> encouraging community involvement</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Access to social welfare</strong> and government schemes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-4">
                    Collaborative Success
                  </h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      <strong style={{color: '#191947'}}>Collaboration has been a key driver of our success.</strong> We have partnered with:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Other NGOs</strong> to expand our reach and impact</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Governmental organizations</strong> for policy support</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong style={{color: '#191947'}}>Corporate sponsors</strong> for financial sustainability</span>
                      </li>
                    </ul>
                    <p className="mt-4">
                      These collaborations have strengthened our ability to bring sustainable change to the lives of countless children.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-600 to-primary-600 rounded-2xl p-8 md:p-12 text-white opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-primary-black">
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Recognition & Support
                </h3>
                <div className="space-y-4 text-primary-100 leading-relaxed text-lg">
                  <p>
                    Our journey has been recognized widely, thanks to the unwavering support of 
                    <strong className="text-white"> Dr. Sindhutai Sapkal (Maai)</strong>, extensive media coverage, 
                    and local newspapers. Their belief in our mission has amplified our voice and helped us gain 
                    mass recognition, furthering our efforts in education and child welfare.
                  </p>
                  <p className="text-white font-medium">
                    "The growth of Dadachishala stands as a testament to the power of community-driven initiatives 
                    and the transformative impact of education."
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                We remain committed to our mission—ensuring that every child, regardless of their background, 
                gets a fair chance at a better life. <strong style={{color: '#191947'}}>Together, we continue to make a difference, one child at a time.</strong>
              </p>
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
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Since our inception in 2010, we have provided holistic support to underprivileged children and their families across Maharashtra
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-transform duration-300"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="bg-primary-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary-600">
                      <AnimatedCounter 
                        end={stat.value} 
                        duration={2000} 
                        suffix={stat.suffix}
                        startOnView={true}
                      />
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-brand-primary mb-4">
              Voices from Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the families, supporters, and community members whose lives have been touched by our work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="text-primary-600 text-4xl mb-4">"</div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    {testimonial.quote}
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600 text-lg">
                  Community voices will appear here once they are added through the admin panel.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  We value feedback from our community members, parents, and supporters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default AboutPage;
