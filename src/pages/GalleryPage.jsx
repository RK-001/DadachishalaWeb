import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { 
  Award, 
  Camera, 
  Play, 
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Users,
  Star,
  Trophy,
  Medal,
  Heart,
  Eye,
  Loader,
  BookOpen,
  PenTool
} from 'lucide-react';
import { useGalleryItems, useAwards, useNews, useVideos, useBlogs } from '../hooks/useFirebaseQueries';
import BlogCard from '../components/BlogCard';
import BlogModal from '../components/BlogModal';

const GalleryPage = () => {
  // React Query hooks - automatic caching and refetching
  const { data: awardsData = [], isLoading: awardsLoading, error: awardsError } = useAwards();
  const { data: photos = [], isLoading: photosLoading, error: photosError } = useGalleryItems();
  const { data: videos = [], isLoading: videosLoading, error: videosError } = useVideos();
  const { data: newsItems = [], isLoading: newsLoading, error: newsError } = useNews();
  const { data: blogs = [], isLoading: blogsLoading, error: blogsError } = useBlogs();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [selectedBlogFilter, setSelectedBlogFilter] = useState('all');

  // Aggregate loading and error states
  const loading = awardsLoading || photosLoading || videosLoading || newsLoading || blogsLoading;
  const error = awardsError || photosError || videosError || newsError || blogsError;

  // Function to determine award icon based on title
  const getAwardIcon = (title) => {
    if (title.toLowerCase().includes('best') || title.toLowerCase().includes('top')) {
      return <Trophy className="w-6 h-6" />;
    } else if (title.toLowerCase().includes('excellence') || title.toLowerCase().includes('outstanding')) {
      return <Medal className="w-6 h-6" />;
    } else {
      return <Star className="w-6 h-6" />;
    }
  };

  // Process awards data to add icons
  const awards = awardsData.map(award => ({
    ...award,
    icon: getAwardIcon(award.title)
  }));

  const openImageModal = (photo) => {
    setSelectedImage(photo);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setBlogModalOpen(true);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
    setBlogModalOpen(false);
  };

  // Filter blogs based on author type
  const filteredBlogs = selectedBlogFilter === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.author_type === selectedBlogFilter);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Gallery</h2>
          <p className="text-gray-600">Please wait while we fetch the latest content...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <Camera className="w-16 h-16 mx-auto mb-6 text-secondary-400" />
          <h1 className="text-4xl md:text-5xl block text-white mb-4">
            Achievements & Milestones
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Celebrating Impact, Change & the Power of Education. From teaching under a tree to educating hundreds daily — our journey is a testimony to how compassion + community can transform lives.
          </p>
        </div>
      </section>

      {/* Awards & Recognitions Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Awards & Recognitions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognition fuels responsibility — each award reminds us why we started and why we continue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.length > 0 ? (
              awards.map((award) => (
                <div key={award.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={award.image} 
                      alt={award.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="text-primary-600 mr-3">
                        {award.icon}
                      </div>
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {award.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {award.title}
                    </h3>
                    <p className="text-primary-600 font-medium mb-3">
                      {award.organization}
                    </p>
                    <p className="text-gray-600">
                      {award.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Awards Yet</h3>
                <p className="text-gray-600">Awards and recognitions will appear here once added.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Photo Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Moments that tell our story. Our camera captures what words can’t — a child’s first notebook, a volunteer teaching under the sun, laughter, colours, dreams taking flight.
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.length > 0 ? (
              photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300"
                  onClick={() => openImageModal(photo)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={photo.image_url || photo.src} 
                      alt={photo.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{photo.title}</h3>
                    <p className="text-gray-600 text-sm">{photo.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Photos Yet</h3>
                <p className="text-gray-600">Photos will appear here once added to the gallery.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Play className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Video Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stories of impact and transformation in motion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div 
                  key={video.id} 
                  className="group cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  onClick={() => openVideoModal(video)}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-primary-600" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Yet</h3>
                <p className="text-gray-600">Video content will appear here once added.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News & Media Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              News & Media
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Coverage of our work and impact in various media outlets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <article key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{item.source}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.excerpt}
                    </p>
                    {item.link && item.link !== '#' && (
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read More
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Articles Yet</h3>
                <p className="text-gray-600">News and media coverage will appear here once added.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <PenTool className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Stories & Blogs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Inspiring stories and experiences shared by our volunteers and students
            </p>
          </div>

          {/* Blog Filter */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedBlogFilter('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedBlogFilter === 'all'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Stories ({blogs.length})
            </button>
            <button
              onClick={() => setSelectedBlogFilter('volunteer')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedBlogFilter === 'volunteer'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Volunteer Stories ({blogs.filter(b => b.author_type === 'volunteer').length})
            </button>
            <button
              onClick={() => setSelectedBlogFilter('student')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedBlogFilter === 'student'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Student Stories ({blogs.filter(b => b.author_type === 'student').length})
            </button>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  onClick={openBlogModal}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedBlogFilter === 'all' ? 'No Blogs Yet' : `No ${selectedBlogFilter} Stories Yet`}
                </h3>
                <p className="text-gray-600">
                  {selectedBlogFilter === 'all' 
                    ? 'Blog posts and stories will appear here once added.' 
                    : `${selectedBlogFilter === 'volunteer' ? 'Volunteer' : 'Student'} stories will appear here once added.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage.image_url || selectedImage.src} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-screen object-contain"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg p-6">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-primary-600" />
                  <p className="text-gray-600">Video Player Placeholder</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Replace with actual video component
                  </p>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      <BlogModal 
        blog={selectedBlog}
        isOpen={blogModalOpen}
        onClose={closeBlogModal}
      />
    </div>
  );
};

export default GalleryPage;
