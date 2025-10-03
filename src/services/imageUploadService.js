/**
 * Firebase Storage Service for Image Uploads
 * Handles image uploads, compression, and URL generation
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Compress image file before upload
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - Quality from 0.1 to 1.0
 * @returns {Promise<Blob>} - Compressed image blob
 */
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate a unique filename with timestamp
 * @param {string} originalName - Original filename
 * @param {string} category - Image category
 * @returns {string} - Unique filename
 */
const generateFileName = (originalName, category) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop().toLowerCase();
  
  return `gallery/${category}/${timestamp}_${randomId}.${extension}`;
};

/**
 * Upload image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} category - Image category
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = async (file, category, onProgress = null) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB.');
    }

    // Compress image if it's too large
    let imageBlob = file;
    if (file.size > 1024 * 1024) { // 1MB
      console.log('Compressing image...');
      imageBlob = await compressImage(file);
    }

    // Generate unique filename
    const fileName = generateFileName(file.name, category);
    
    // Create storage reference
    const storageRef = ref(storage, fileName);
    
    // Create metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        category: category,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload file
    console.log('Uploading image to Firebase Storage...');
    const snapshot = await uploadBytes(storageRef, imageBlob, metadata);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;

  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {FileList} files - Array of image files
 * @param {string} category - Image category
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<Array<string>>} - Array of download URLs
 */
export const uploadMultipleImages = async (files, category, onProgress = null) => {
  const uploadPromises = Array.from(files).map(async (file, index) => {
    try {
      const url = await uploadImage(file, category, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      });
      return { success: true, url, fileName: file.name };
    } catch (error) {
      return { success: false, error: error.message, fileName: file.name };
    }
  });

  const results = await Promise.all(uploadPromises);
  return results;
};

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Download URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathStart = url.pathname.indexOf('/o/') + 3;
    const pathEnd = url.pathname.indexOf('?');
    const filePath = decodeURIComponent(
      url.pathname.substring(pathStart, pathEnd)
    );

    // Create reference and delete
    const imageRef = ref(storage, filePath);
    await deleteObject(imageRef);
    
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get image metadata
 * @param {string} imageUrl - Download URL of the image
 * @returns {Promise<object>} - Image metadata
 */
export const getImageMetadata = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const pathStart = url.pathname.indexOf('/o/') + 3;
    const pathEnd = url.pathname.indexOf('?');
    const filePath = decodeURIComponent(
      url.pathname.substring(pathStart, pathEnd)
    );

    const imageRef = ref(storage, filePath);
    const metadata = await getMetadata(imageRef);
    
    return metadata;
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeKB - Maximum file size in KB (default: 10MB = 10240KB)
 * @returns {object} - Validation result
 */
export const validateImageFile = (file, maxSizeKB = 10240) => {
  const errors = [];
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }
  
  // Check file size
  const maxSize = maxSizeKB * 1024; // Convert KB to bytes
  if (file.size > maxSize) {
    if (maxSizeKB >= 1024) {
      const maxSizeMB = (maxSizeKB / 1024).toFixed(1);
      errors.push(`Image size must be less than ${maxSizeMB}MB`);
    } else {
      errors.push(`Image size must be less than ${maxSizeKB}KB`);
    }
  }
  
  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedFormats.includes(file.type.toLowerCase())) {
    errors.push('Supported formats: JPEG, PNG, WebP, GIF');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create image preview URL
 * @param {File} file - Image file
 * @returns {string} - Preview URL
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Cleanup image preview URL
 * @param {string} previewUrl - Preview URL to cleanup
 */
export const cleanupImagePreview = (previewUrl) => {
  URL.revokeObjectURL(previewUrl);
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImageMetadata,
  validateImageFile,
  createImagePreview,
  cleanupImagePreview
};
