import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

// Set the app element for accessibility
Modal.setAppElement('#root');

const GalleryGrid = ({ images, isAdmin = false, onDeleteImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const handleDelete = (imageId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this image?')) {
      onDeleteImage(imageId);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-200 aspect-square"
            onClick={() => openModal(image)}
          >
            <img
              src={image.url || image.imageURL}
              alt={image.caption || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">View Full Size</span>
              </div>
            </div>

            {/* Admin Delete Button */}
            {isAdmin && onDeleteImage && (
              <button
                onClick={(e) => handleDelete(image.id, e)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <X size={16} />
              </button>
            )}

            {/* Caption overlay */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for full-size image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full z-10 transition-colors"
          >
            <X size={20} />
          </button>
          
          {selectedImage && (
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage.url || selectedImage.imageURL}
                alt={selectedImage.caption || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {selectedImage.caption && (
                <div className="p-4">
                  <p className="text-gray-700">{selectedImage.caption}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GalleryGrid;
