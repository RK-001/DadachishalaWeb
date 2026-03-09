import React, { useState, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import { sanitizeString, sanitizeEmail } from '../utils/validators';

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Our Address',
    details: ['Lane no 07, Near Suratwala Society,', 'Kondhwa Khurd Shivneri Nagar,', 'Pune 411048, Maharashtra'],
    action: { label: 'Get Directions', href: 'https://www.google.com/maps/search/?api=1&query=Kondhwa+Khurd+Shivneri+Nagar+Pune' }
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 7020396723', '+91 7038953001'],
    action: { label: 'Call Now', href: 'tel:+917020396723' }
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['dadachishala07@gmail.com'],
    action: { label: 'Send Email', href: 'mailto:dadachishala07@gmail.com' }
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Monday - Saturday', '9:00 AM - 6:00 PM'],
    action: null
  }
];

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/dadachishala/', label: 'Facebook', Icon: Facebook, color: 'hover:bg-blue-600' },
  { href: 'https://www.instagram.com/dadachishala/?hl=en', label: 'Instagram', Icon: Instagram, color: 'hover:bg-pink-600' },
  { href: 'https://www.youtube.com/dadachishalastreetschool', label: 'YouTube', Icon: Youtube, color: 'hover:bg-red-600' },
];

const ContactInfoCard = memo(({ icon: Icon, title, details, action }) => (
  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        {details.map((detail, i) => (
          <p key={i} className="text-gray-600 text-sm">{detail}</p>
        ))}
        {action && (
          <a
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium mt-2"
          >
            {action.label}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  </div>
));
ContactInfoCard.displayName = 'ContactInfoCard';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Contact form submitted:', {
        name: sanitizeString(data.name),
        email: sanitizeEmail(data.email),
        subject: sanitizeString(data.subject),
        message: sanitizeString(data.message),
      });
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [reset]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "NGO",
      "name": "Dada Chi Shala",
      "email": "dadachishala07@gmail.com",
      "telephone": "+91-7020396723",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Lane no 07, Near Suratwala Society, Kondhwa Khurd Shivneri Nagar",
        "addressLocality": "Pune",
        "postalCode": "411048",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <SEO
        title="Contact Dada Chi Shala - Get in Touch | Pune NGO"
        description="Contact Dada Chi Shala for inquiries, donations, volunteer opportunities, or partnerships. Email: dadachishala07@gmail.com. Phone: +91 7020396723. Based in Pune, Maharashtra."
        keywords="contact Dadachishala, NGO contact Pune, email Dada Chi Shala, Pune NGO address, get in touch, inquiries"
        canonicalUrl="/contact"
        structuredData={contactSchema}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container-custom text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-6 text-secondary-400" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {CONTACT_INFO.map((info, i) => (
                <ContactInfoCard key={i} {...info} />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700 font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="input-field"
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                        })}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject', { required: 'Subject is required' })}
                      className="input-field"
                      placeholder="What is this about?"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      className="input-field resize-none"
                      placeholder="Your message..."
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map & Social */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Find Us</h2>
                  </div>
                  <div className="h-72">
                    <iframe
                      title="Dada Chi Shala Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.157!2d73.88!3d18.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKondhwa+Khurd+Pune!5e0!3m2!1sen!2sin!4v1"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">Follow Us</h3>
                  <p className="text-gray-600 mb-4">Stay connected through our social media channels.</p>
                  <div className="flex space-x-4">
                    {SOCIAL_LINKS.map(({ href, label, Icon, color }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-white ${color} transition-all duration-300`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
