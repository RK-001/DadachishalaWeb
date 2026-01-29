import React from 'react';
import SEO from '../components/SEO';

const MediaPage = () => {
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
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-4xl font-heading font-bold mb-8">Media & News</h1>
          <p className="text-lg text-gray-700">Media page content will be added here.</p>
        </div>
      </div>
    </>
  );
};

export default MediaPage;
