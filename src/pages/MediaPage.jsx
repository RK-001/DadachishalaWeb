import React, { memo } from 'react';
import { Newspaper, Play, Award, ExternalLink, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { useNews, useVideos, useAwards } from '../hooks/useFirebaseQueries';

const MediaCard = memo(({ item, type }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
    {item.image && (
      <div className="h-48 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
    )}
    <div className="p-5">
      {item.date && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
      {item.source && <p className="text-sm text-primary-600 font-medium mb-2">{item.source}</p>}
      {item.description && <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.description}</p>}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium">
          {type === 'video' ? 'Watch Video' : 'Read More'}
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      )}
    </div>
  </div>
));
MediaCard.displayName = 'MediaCard';

const MediaPage = () => {
  const { data: news = [], isLoading: newsLoading } = useNews();
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: awards = [], isLoading: awardsLoading } = useAwards();

  const loading = newsLoading || videosLoading || awardsLoading;

  const mediaSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Dada Chi Shala Media Coverage",
    "description": "News articles, press releases, and media coverage about Dada Chi Shala"
  };

  return (
    <>
      <SEO
        title="Media & Press - Dada Chi Shala | News Coverage & Press Releases"
        description="Latest news, press releases, and media coverage about Dada Chi Shala's work with street children in Pune. Featured in Pune Mirror, Times of India, and regional media outlets."
        keywords="Dadachishala news, NGO press Pune, media coverage, press release, news articles, achievements, awards"
        canonicalUrl="/media"
        structuredData={mediaSchema}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container-custom text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-6 text-secondary-400" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Media & News</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Our work in the news — coverage, features, and media appearances that amplify our mission.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
            <p className="mt-4 text-gray-600">Loading media...</p>
          </div>
        ) : (
          <>
            {/* News Section */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="text-center mb-10">
                  <Newspaper className="w-10 h-10 mx-auto mb-3 text-primary-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">News & Press</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Featured articles and press coverage of our work.</p>
                </div>
                {news.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map(item => <MediaCard key={item.id} item={item} type="news" />)}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">News articles will appear here once published.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Videos Section */}
            <section className="section-padding bg-white">
              <div className="container-custom">
                <div className="text-center mb-10">
                  <Play className="w-10 h-10 mx-auto mb-3 text-primary-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Videos</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Watch our stories of impact and transformation.</p>
                </div>
                {videos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(item => <MediaCard key={item.id} item={item} type="video" />)}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Videos will appear here once uploaded.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Awards Section */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="text-center mb-10">
                  <Award className="w-10 h-10 mx-auto mb-3 text-primary-600" />
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Awards & Recognitions</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Honors that fuel our mission forward.</p>
                </div>
                {awards.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awards.map(award => (
                      <div key={award.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                        {award.image && (
                          <img src={award.image} alt={award.title} className="w-full h-40 object-cover rounded-lg mb-4" loading="lazy" />
                        )}
                        <div className="flex items-center mb-3">
                          <Award className="w-5 h-5 text-secondary-500 mr-2" />
                          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">{award.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{award.title}</h3>
                        {award.organization && <p className="text-primary-600 font-medium text-sm mb-2">{award.organization}</p>}
                        {award.description && <p className="text-gray-600 text-sm">{award.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Awards will appear here once added.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default MediaPage;
