import { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { sanitizeString, sanitizeUrl } from '../utils/validators';

const BASE_URL = 'https://dadachishala.org';
const DEFAULTS = {
  title: 'Dada Chi Shala - Free Education for Street Children in Pune',
  description: 'Dada Chi Shala (Dadachishala) is a leading NGO providing free quality education to 450+ street children across 10 branches in Pune, Maharashtra.',
  keywords: 'Dadachishala, street children education Pune, NGO Pune, free education Maharashtra, Pune NGO, Abhijeet Pokharnikar, Educare Education trust',
  ogImage: '/images/og-image.jpg'
};

const SEO = ({ 
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  keywords = DEFAULTS.keywords,
  ogImage = DEFAULTS.ogImage,
  ogType = 'website',
  canonicalUrl = '',
  structuredData = null,
  noindex = false
}) => {
  const safeTitle = sanitizeString(title);
  const safeDescription = sanitizeString(description);
  const safeKeywords = sanitizeString(keywords);
  const fullUrl = canonicalUrl ? sanitizeUrl(`${BASE_URL}${canonicalUrl}`) : BASE_URL;
  const fullImageUrl = ogImage.startsWith('http') ? sanitizeUrl(ogImage) : sanitizeUrl(`${BASE_URL}${ogImage}`);

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="title" content={safeTitle} />
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={safeKeywords} />
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Dada Chi Shala" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={safeTitle} />
      <meta property="twitter:description" content={safeDescription} />
      <meta property="twitter:image" content={fullImageUrl} />
      
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  canonicalUrl: PropTypes.string,
  structuredData: PropTypes.object,
  noindex: PropTypes.bool
};

export default memo(SEO);
