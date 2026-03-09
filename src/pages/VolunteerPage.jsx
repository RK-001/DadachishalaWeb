import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Quote,
  GraduationCap,
  Stethoscope,
  Computer,
  Palette,
  FileText,
  Mail,
  Award,
  Target,
  Lightbulb,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import { addVolunteer } from '../services/cachedDatabaseService';
import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import { sanitizeString, sanitizeEmail } from '../utils/validators';

const VolunteerPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    skills: [],
    interests: [],
    preferredBranches: [],
    availability: '',
    timeCommitment: '',
    previousExperience: '',
    whyVolunteer: '',
    references: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const totalSteps = 4;
  const stepTitles = [
    'Personal Info',
    'Skills & Interests', 
    'Availability',
    'Motivation & Contact'
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.skills.length > 0 || formData.interests;
      case 3:
        return formData.availability && formData.timeCommitment;
      case 4:
        return formData.whyVolunteer && formData.emergencyContact && formData.emergencyPhone;
      default:
        return true;
    }
  };

  // Load testimonials from team management data
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        console.log('Loading testimonials from team management...'); // Debug log
        
        // Get team members from localStorage
        const savedMembers = localStorage.getItem('teamMembers');
        if (savedMembers) {
          const teamMembers = JSON.parse(savedMembers);
          
          // Filter for volunteer category members who are marked as testimonials
          const featuredTestimonials = teamMembers
            .filter(member => 
              member.category === 'volunteer' && 
              member.isTestimonial && 
              member.status === 'active'
            )
            .slice(0, 3) // Limit to 3 testimonials
            .map(member => ({
              quote: member.description || 
                     member.education || 
                     "Working with Dada Chi Shala has been an amazing experience.",
              name: member.name || 'Anonymous Volunteer',
              role: member.position || 'Volunteer',
              duration: member.duration || 'Active volunteer',
              image: member.image || 
                     `https://images.unsplash.com/photo-1494790108755-2616b612b0e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
            }));
          
          console.log('Featured testimonials found:', featuredTestimonials); // Debug log
          setTestimonials(featuredTestimonials);
        } else {
          console.log('No team members found in localStorage'); // Debug log
          setTestimonials([]);
        }
        
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setTestimonials([]);
      }
    };

    loadTestimonials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleBranchChange = (branch) => {
    setFormData(prev => ({
      ...prev,
      preferredBranches: prev.preferredBranches.includes(branch)
        ? prev.preferredBranches.filter(b => b !== branch)
        : [...prev.preferredBranches, branch]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || 
          !formData.availability || !formData.timeCommitment || !formData.whyVolunteer || 
          !formData.emergencyContact || !formData.emergencyPhone) {
        setSubmitMessage('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for Firebase
      const volunteerData = {
        personal_info: {
          full_name: sanitizeString(formData.fullName),
          email: sanitizeEmail(formData.email),
          phone: sanitizeString(formData.phone),
          age: formData.age || null,
          occupation: sanitizeString(formData.occupation || ''),
        },
        skills_and_interests: {
          skills: formData.skills,
          other_interests: sanitizeString(formData.interests || ''),
          preferred_branches: formData.preferredBranches,
        },
        availability: {
          when_available: sanitizeString(formData.availability),
          time_commitment: sanitizeString(formData.timeCommitment),
        },
        experience_and_motivation: {
          previous_experience: sanitizeString(formData.previousExperience || ''),
          why_volunteer: sanitizeString(formData.whyVolunteer),
        },
        references_and_emergency: {
          references: sanitizeString(formData.references || ''),
          emergency_contact_name: sanitizeString(formData.emergencyContact),
          emergency_contact_phone: sanitizeString(formData.emergencyPhone),
        },
        application_status: 'pending',
        submitted_at: new Date().toISOString(),
      };

      console.log('Submitting volunteer application:', volunteerData);
      
      // Submit to Firebase
      const volunteerId = await addVolunteer(volunteerData);
      
      console.log('Volunteer application submitted successfully with ID:', volunteerId);
      
      // Send confirmation email via Cloud Function
      try {
        const sendVolunteerConfirmation = httpsCallable(functions, 'sendVolunteerConfirmation');
        await sendVolunteerConfirmation({
          volunteerData: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            skills: formData.skills.join(', ')
          }
        });
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the application if email fails
      }
      
      setSubmitMessage('🎉 Thank you for your application! We have received your volunteer registration and will contact you within 5-7 business days. Your application ID is: ' + volunteerId);
      
      // Reset form
      setFormData({
        fullName: '', email: '', phone: '', age: '', occupation: '', 
        skills: [], interests: '', preferredBranches: [], availability: '', timeCommitment: '',
        previousExperience: '', whyVolunteer: '', references: '', emergencyContact: '', emergencyPhone: ''
      });

      // Reset to first step
      setCurrentStep(1);

      // Scroll to success message
      setTimeout(() => {
        document.getElementById('volunteer-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitMessage('❌ There was an error submitting your application. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const volunteerOpportunities = [
    {
      title: "Educational Support",
      description: "Help children with formal education subjects like English, Mathematics, Science, and Hindi. Support classroom activities and homework assistance.",
      icon: <GraduationCap className="w-8 h-8 text-primary-600" />,
      skills: ["Teaching", "Subject Knowledge", "Patience"]
    },
    {
      title: "Healthcare & Nutrition",
      description: "Assist with health check-ups, maintain medical records, and support nutrition programs. Medical background preferred but not mandatory.",
      icon: <Stethoscope className="w-8 h-8 text-primary-600" />,
      skills: ["Medical Knowledge", "Care", "Record Keeping"]
    },
    {
      title: "Life Skills Training",
      description: "Teach essential life skills including communication, teamwork, time management, self-awareness, and creative thinking.",
      icon: <Lightbulb className="w-8 h-8 text-primary-600" />,
      skills: ["Mentoring", "Communication", "Training"]
    },
    {
      title: "Creative Arts & Sports",
      description: "Engage children in creative expression through arts, crafts, music, dance, theater, and sports activities.",
      icon: <Palette className="w-8 h-8 text-primary-600" />,
      skills: ["Creativity", "Arts", "Sports"]
    },
    {
      title: "Computer & Technology",
      description: "Teach basic computer skills, MS Office, internet usage, and digital literacy to children and staff members.",
      icon: <Computer className="w-8 h-8 text-primary-600" />,
      skills: ["Computer Skills", "Teaching", "Technology"]
    },
    {
      title: "Documentation & Administration",
      description: "Help with documentation, case studies, database management, marketing materials, and administrative tasks.",
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      skills: ["Writing", "Organization", "Data Management"]
    }
  ];

  const whyVolunteerReasons = [
    {
      title: "Make a Real Impact",
      description: "Directly contribute to transforming the lives of underprivileged children and help them build a better future.",
      icon: <Target className="w-12 h-12 text-primary-600" />
    },
    {
      title: "Gain Valuable Experience",
      description: "Develop new skills, gain practical experience, and enhance your personal and professional growth.",
      icon: <Award className="w-12 h-12 text-primary-600" />
    },
    {
      title: "Cultural Learning",
      description: "Immerse yourself in Indian culture, learn about social issues, and gain a broader perspective on life.",
      icon: <Users className="w-12 h-12 text-primary-600" />
    }
  ];

  const impactStats = [
    { number: 500, label: "Active Volunteers", suffix: "+" },
    { number: 2000, label: "Children Helped", suffix: "+" },
    { number: 10000, label: "Volunteer Hours", suffix: "+" },
    { number: 50, label: "Countries Represented", suffix: "+" }
  ];

  const skillOptions = [
    "Teaching", "Healthcare", "Computer Skills", "Arts & Crafts", "Sports", "Music", 
    "Writing", "Photography", "Event Planning", "Counseling", "Administration", "Marketing"
  ];

  const branchOptions = [
    {
      name: "Pune Main Center",
      location: "Pune, Maharashtra",
      description: "Our main center with residential facilities and primary education programs"
    },
    {
      name: "Mumbai Outreach Center", 
      location: "Mumbai, Maharashtra",
      description: "Community outreach programs and day care services"
    },
    {
      name: "Nashik Branch",
      location: "Nashik, Maharashtra", 
      description: "Educational support and skill development programs"
    },
    {
      name: "Aurangabad Center",
      location: "Aurangabad, Maharashtra",
      description: "Healthcare and nutrition programs with educational support"
    },
    {
      name: "Rural Outreach Programs",
      location: "Various villages in Maharashtra",
      description: "Mobile education and healthcare services in rural areas"
    },
    {
      name: "Online/Remote Support",
      location: "Work from anywhere",
      description: "Digital education, documentation, and administrative support"
    }
  ];

  const volunteerSchema = {
    "@context": "https://schema.org",
    "@type": "VolunteerAction",
    "organizer": {
      "@type": "NGO",
      "name": "Dada Chi Shala",
      "url": "https://dadachishala.org"
    },
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      }
    },
    "description": "Join 250+ volunteers teaching street children in Pune"
  };

  return (
    <>
      <SEO
        title="Volunteer with Dada Chi Shala - Help Street Children in Pune"
        description="Join 250+ volunteers making a difference! Volunteer with Dada Chi Shala teaching street children across 10 branches in Pune. Teaching, healthcare, skill development opportunities available."
        keywords="volunteer Pune, volunteer with children NGO, teaching opportunities Pune, social work volunteering, volunteer street children education, NGO volunteer Maharashtra"
        canonicalUrl="/volunteer"
        structuredData={volunteerSchema}
      />
      <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-900 to-primary-700">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Volunteers with children"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl block text-white mb-6">
              Volunteer With Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Join our mission to transform lives through education, care, and community support. 
              Your time and skills can make a lasting difference in a child's future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#volunteer-form" 
                className="bg-secondary-500 hover:bg-secondary-600 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <Heart className="mr-2" size={20} />
                Apply Now
              </a>
              <a 
                href="#opportunities" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-800 text-lg px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <BookOpen className="mr-2" size={20} />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Why Volunteer With Dada Chi Shala?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Volunteering with us is more than just giving your time - it's about creating meaningful 
              connections, learning new perspectives, and being part of a transformative journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyVolunteerReasons.map((reason, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300">
                <div className="flex justify-center mb-6">
                  {reason.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-primary mb-4">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section id="opportunities" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer diverse volunteering opportunities that match your skills, interests, and 
              availability. Find the perfect way to contribute to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-50 rounded-lg p-3 mr-4">
                    {opportunity.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-primary">{opportunity.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{opportunity.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary-700">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Volunteer Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Together, our volunteers have created a significant impact in the lives of children and communities we serve.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-secondary-300 mb-2">
                  {stat.number.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-primary-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Volunteer Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our volunteers about their transformative experiences and the impact they've made.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
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
                      <h4 className="font-semibold text-brand-primary">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-primary-600">{testimonial.duration}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-3 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Testimonials Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Volunteer testimonials will appear here once approved volunteers are featured by our admin team.
                  Be the first to volunteer and share your amazing experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Volunteer Application Form */}
      <section id="volunteer-form" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6">
              Apply to Volunteer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to make a difference? Fill out our volunteer application form and join our mission 
              to empower children and transform communities.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Step Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                {stepTitles.map((title, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > index + 1 
                        ? 'bg-green-500 text-white' 
                        : currentStep === index + 1 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <div className={`ml-2 text-sm font-medium hidden sm:block ${
                      currentStep >= index + 1 ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      {title}
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div className={`w-8 h-1 mx-4 ${
                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border">
              {submitMessage && (
                <div className={`mb-6 p-6 rounded-lg border-l-4 ${
                  submitMessage.includes('❌') || submitMessage.includes('error') 
                    ? 'bg-red-50 border-red-400 text-red-800' 
                    : 'bg-green-50 border-green-400 text-green-800'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {submitMessage.includes('❌') ? (
                        <div className="text-red-400">❌</div>
                      ) : (
                        <div className="text-green-400">✅</div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium leading-relaxed">{submitMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-brand-primary mb-2">Tell Us About Yourself</h3>
                    <p className="text-gray-600">Let's start with some basic information</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="16"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Student, Professional, Retired, etc."
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Skills & Interests */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-brand-primary mb-2">Share Your Skills</h3>
                    <p className="text-gray-600">Help us understand what you're passionate about</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">What skills would you like to contribute? (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skillOptions.map((skill) => (
                        <label key={skill} className="flex items-center p-3 border rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleSkillsChange(skill)}
                            className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Any other skills or interests?</label>
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Tell us about any other skills, hobbies, or interests you have..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Where would you like to contribute? (Select all that apply)</label>
                    <div className="space-y-3">
                      {branchOptions.map((branch) => (
                        <label key={branch.name} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferredBranches.includes(branch.name)}
                            onChange={() => handleBranchChange(branch.name)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="flex-grow">
                            <div className="font-medium text-brand-primary">{branch.name}</div>
                            <div className="text-sm text-gray-600">{branch.location}</div>
                            <div className="text-xs text-gray-500 mt-1">{branch.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Availability */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-brand-primary mb-2">Your Availability</h3>
                    <p className="text-gray-600">When can you contribute your time?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">When are you available? *</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select your availability</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends only</option>
                        <option value="flexible">Flexible (both weekdays and weekends)</option>
                        <option value="specific">Specific days/times (please specify below)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time commitment *</label>
                      <select
                        name="timeCommitment"
                        value={formData.timeCommitment}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select your commitment</option>
                        <option value="1-3 hours/week">1-3 hours per week</option>
                        <option value="4-6 hours/week">4-6 hours per week</option>
                        <option value="7+ hours/week">7+ hours per week</option>
                        <option value="full-time">Full-time volunteer (4+ weeks)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous volunteering experience</label>
                    <textarea
                      name="previousExperience"
                      value={formData.previousExperience}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Tell us about any previous volunteering experience or work with children/NGOs..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Motivation & Contact */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-brand-primary mb-2">Almost Done!</h3>
                    <p className="text-gray-600">Tell us about your motivation and emergency contact</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to volunteer with Dada Chi Shala? *</label>
                    <textarea
                      name="whyVolunteer"
                      value={formData.whyVolunteer}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Share your motivation and what you hope to achieve through volunteering..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">References (Name, Contact, Relationship)</label>
                    <textarea
                      name="references"
                      value={formData.references}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Please provide references who can vouch for your character (optional but helpful)..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Full name of emergency contact"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    currentStep === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps}
                </div>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                      isStepValid()
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepValid()}
                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${
                      isSubmitting || !isStepValid()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>

              {currentStep === totalSteps && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  We will review your application and contact you within 5-7 business days.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Change Lives?
            </h2>
            <p className="text-xl mb-8 text-primary-100 leading-relaxed">
              Join our community of dedicated volunteers and help us create a world where every child 
              has the opportunity to learn, grow, and succeed. Your contribution matters!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#volunteer-form" 
                className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <Heart className="mr-2" size={20} />
                Apply to Volunteer
              </a>
              <Link 
                to="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <Mail className="mr-2" size={20} />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default VolunteerPage;
