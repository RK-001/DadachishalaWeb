import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import EventCard from '../components/EventCard';
import SEO from '../components/SEO';
import { useEvents } from '../hooks/useFirebaseQueries';

const EventsPage = () => {
  const { data: events = [], isLoading: loading } = useEvents();

  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": "Dada Chi Shala Community Events",
    "organizer": {
      "@type": "NGO",
      "name": "Dada Chi Shala",
      "url": "https://dadachishala.org"
    },
    "location": {
      "@type": "Place",
      "name": "Pune, Maharashtra"
    }
  };

  return (
    <>
      <SEO
        title="Events - Dada Chi Shala | Community Programs & Activities in Pune"
        description="Join our educational programs, volunteer drives, and community initiatives. Upcoming events supporting street children education across 10 branches in Pune, Maharashtra."
        keywords="NGO events Pune, community programs, educational events, volunteer activities, charity events Pune, street children events"
        canonicalUrl="/events"
        structuredData={eventsSchema}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom text-center">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-secondary-400" />
          <h1 className="text-4xl md:text-5xl block text-white mb-4">
            Our Events
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join us in our activities and help make a difference in children's lives
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500">
                We don't have any events scheduled at the moment. Please check back later!
              </p>
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
};

export default EventsPage;
