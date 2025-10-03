/**
 * Firebase Database Service Functions
 * Common database operations for Dada Chi Shala NGO website
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ================================
// EVENTS COLLECTION OPERATIONS
// ================================

/**
 * Get all events with optional limit
 */
export const getEvents = async (limitCount = null) => {
  try {
    let q = query(collection(db, 'events'), orderBy('event_date', 'asc'));
    if (limitCount) {
      q = query(collection(db, 'events'), orderBy('event_date', 'asc'), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// ================================
// SUCCESS STORIES COLLECTION OPERATIONS
// ================================

/**
 * Add a new success story
 */
export const addSuccessStory = async (storyData) => {
  try {
    const docRef = await addDoc(collection(db, 'success_stories'), {
      ...storyData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding success story:', error);
    throw error;
  }
};

/**
 * Get all success stories
 */
export const getSuccessStories = async () => {
  try {
    const q = query(collection(db, 'success_stories'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching success stories:', error);
    throw error;
  }
};

/**
 * Update a success story
 */
export const updateSuccessStory = async (storyId, updateData) => {
  try {
    const storyRef = doc(db, 'success_stories', storyId);
    await updateDoc(storyRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating success story:', error);
    throw error;
  }
};

/**
 * Delete a success story
 */
export const deleteSuccessStory = async (storyId) => {
  try {
    await deleteDoc(doc(db, 'success_stories', storyId));
  } catch (error) {
    console.error('Error deleting success story:', error);
    throw error;
  }
};

// ================================
// TESTIMONIALS COLLECTION OPERATIONS
// ================================

/**
 * Add a new testimonial
 */
export const addTestimonial = async (testimonialData) => {
  try {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...testimonialData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

/**
 * Get all testimonials
 */
export const getTestimonials = async () => {
  try {
    const q = query(collection(db, 'testimonials'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * Update a testimonial
 */
export const updateTestimonial = async (testimonialId, updateData) => {
  try {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    await updateDoc(testimonialRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (testimonialId) => {
  try {
    await deleteDoc(doc(db, 'testimonials', testimonialId));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

/**
 * Get upcoming events only
 */
export const getUpcomingEvents = async (limitCount = 3) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'events'),
      where('event_date', '>=', today),
      orderBy('event_date', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

/**
 * Add new event
 */
export const addEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

/**
 * Update event
 */
export const updateEvent = async (eventId, updateData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// ================================
// DONATIONS COLLECTION OPERATIONS
// ================================

/**
 * Add new donation record
 */
export const addDonation = async (donationData) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      created_at: serverTimestamp(),
      status: 'pending' // Default status
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
};

/**
 * Update donation status (for payment confirmations)
 */
export const updateDonationStatus = async (donationId, status, paymentId = null) => {
  try {
    const donationRef = doc(db, 'donations', donationId);
    const updateData = {
      status,
      updated_at: serverTimestamp()
    };
    
    if (paymentId) {
      updateData.payment_id = paymentId;
    }
    
    await updateDoc(donationRef, updateData);
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

/**
 * Get donation statistics
 */
export const getDonationStats = async () => {
  try {
    const q = query(
      collection(db, 'donations'),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(q);
    const donations = querySnapshot.docs.map(doc => doc.data());
    
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalDonors = donations.length;
    
    return {
      totalAmount,
      totalDonors,
      donations
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
};

// ================================
// VOLUNTEERS COLLECTION OPERATIONS
// ================================

/**
 * Add new volunteer registration
 */
export const addVolunteer = async (volunteerData) => {
  try {
    const docRef = await addDoc(collection(db, 'volunteers'), {
      ...volunteerData,
      created_at: serverTimestamp(),
      status: 'pending' // Default status for review
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding volunteer:', error);
    throw error;
  }
};

/**
 * Get all volunteers
 */
export const getVolunteers = async () => {
  try {
    const q = query(collection(db, 'volunteers'), orderBy('submitted_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

/**
 * Update volunteer status
 */
export const updateVolunteerStatus = async (volunteerId, status, notes = '') => {
  try {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(volunteerRef, {
      application_status: status,
      updated_at: serverTimestamp(),
      ...(notes && { status_notes: notes })
    });
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    throw error;
  }
};

/**
 * Add volunteer action history
 */
export const addVolunteerAction = async (volunteerId, action, adminEmail, notes = '') => {
  try {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    const volunteerDoc = await getDoc(volunteerRef);
    
    if (volunteerDoc.exists()) {
      const currentData = volunteerDoc.data();
      const actionHistory = currentData.action_history || [];
      
      actionHistory.push({
        action,
        admin_email: adminEmail,
        notes,
        timestamp: serverTimestamp()
      });

      await updateDoc(volunteerRef, {
        action_history: actionHistory,
        updated_at: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error adding volunteer action:', error);
    throw error;
  }
};

/**
 * Get volunteers by status
 */
export const getVolunteersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'volunteers'), 
      where('application_status', '==', status),
      orderBy('submitted_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching volunteers by status:', error);
    throw error;
  }
};

/**
 * Assign volunteer to branch
 */
export const assignVolunteerToBranch = async (volunteerId, branchName, coordinatorEmail) => {
  try {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(volunteerRef, {
      assigned_branch: branchName,
      coordinator_email: coordinatorEmail,
      status: 'assigned',
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error assigning volunteer to branch:', error);
    throw error;
  }
};

// ================================
// GALLERY COLLECTION OPERATIONS
// ================================

/**
 * Add new gallery item (photos)
 */
export const addGalleryItem = async (galleryData) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...galleryData,
      uploaded_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

/**
 * Get gallery items by category
 */
export const getGalleryItems = async (category = null, limitCount = null) => {
  try {
    let q;
    
    if (category) {
      // Query with category filter only (no orderBy to avoid composite index requirement)
      q = query(
        collection(db, 'gallery'),
        where('category', '==', category)
      );
    } else {
      // Query all items with ordering
      q = query(collection(db, 'gallery'), orderBy('uploaded_at', 'desc'));
    }
    
    if (limitCount && !category) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    let items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // If category filter was applied, sort in memory and apply limit
    if (category) {
      items = items.sort((a, b) => {
        const dateA = a.uploaded_at?.toDate?.() || new Date(0);
        const dateB = b.uploaded_at?.toDate?.() || new Date(0);
        return dateB - dateA; // Descending order
      });
      
      if (limitCount) {
        items = items.slice(0, limitCount);
      }
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

/**
 * Update gallery item
 */
export const updateGalleryItem = async (itemId, updateData) => {
  try {
    const itemRef = doc(db, 'gallery', itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    throw error;
  }
};

/**
 * Delete gallery item
 */
export const deleteGalleryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'gallery', itemId));
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

// ================================
// AWARDS & RECOGNITIONS OPERATIONS
// ================================

/**
 * Add new award
 */
export const addAward = async (awardData) => {
  try {
    const docRef = await addDoc(collection(db, 'awards'), {
      ...awardData,
      created_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding award:', error);
    throw error;
  }
};

/**
 * Get all awards
 */
export const getAwards = async (limitCount = null) => {
  try {
    let q = query(collection(db, 'awards'), orderBy('year', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching awards:', error);
    throw error;
  }
};

/**
 * Update award
 */
export const updateAward = async (awardId, updateData) => {
  try {
    const awardRef = doc(db, 'awards', awardId);
    await updateDoc(awardRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating award:', error);
    throw error;
  }
};

/**
 * Delete award
 */
export const deleteAward = async (awardId) => {
  try {
    await deleteDoc(doc(db, 'awards', awardId));
  } catch (error) {
    console.error('Error deleting award:', error);
    throw error;
  }
};

// ================================
// NEWS & MEDIA OPERATIONS
// ================================

/**
 * Add new news article
 */
export const addNewsArticle = async (newsData) => {
  try {
    const docRef = await addDoc(collection(db, 'news'), {
      ...newsData,
      created_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding news article:', error);
    throw error;
  }
};

/**
 * Get all news articles
 */
export const getNewsArticles = async (limitCount = null) => {
  try {
    let q = query(collection(db, 'news'), orderBy('date', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }
};

/**
 * Update news article
 */
export const updateNewsArticle = async (newsId, updateData) => {
  try {
    const newsRef = doc(db, 'news', newsId);
    await updateDoc(newsRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating news article:', error);
    throw error;
  }
};

/**
 * Delete news article
 */
export const deleteNewsArticle = async (newsId) => {
  try {
    await deleteDoc(doc(db, 'news', newsId));
  } catch (error) {
    console.error('Error deleting news article:', error);
    throw error;
  }
};

// ================================
// VIDEOS OPERATIONS
// ================================

/**
 * Add new video
 */
export const addVideo = async (videoData) => {
  try {
    const docRef = await addDoc(collection(db, 'videos'), {
      ...videoData,
      created_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
};

/**
 * Get all videos
 */
export const getVideos = async (limitCount = null) => {
  try {
    let q = query(collection(db, 'videos'), orderBy('created_at', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

/**
 * Update video
 */
export const updateVideo = async (videoId, updateData) => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

/**
 * Delete video
 */
export const deleteVideo = async (videoId) => {
  try {
    await deleteDoc(doc(db, 'videos', videoId));
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// ================================
// CONTACT/MESSAGES OPERATIONS
// ================================

/**
 * Add contact message
 */
export const addContactMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      created_at: serverTimestamp(),
      status: 'unread'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding contact message:', error);
    throw error;
  }
};

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Get document by ID from any collection
 */
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete document by ID from any collection
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get collection size/count
 */
export const getCollectionCount = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error(`Error getting ${collectionName} count:`, error);
    throw error;
  }
};

// ================================
// BRANCHES COLLECTION OPERATIONS
// ================================

/**
 * Get all branches
 */
export const getBranches = async () => {
  try {
    const q = query(collection(db, 'branches'), orderBy('branch_name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

/**
 * Add new branch
 */
export const addBranch = async (branchData) => {
  try {
    const docRef = await addDoc(collection(db, 'branches'), {
      ...branchData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

/**
 * Update branch
 */
export const updateBranch = async (branchId, updateData) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await updateDoc(branchRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

/**
 * Delete branch
 */
export const deleteBranch = async (branchId) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await deleteDoc(branchRef);
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};

/**
 * Get branch by ID
 */
export const getBranchById = async (branchId) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    const branchSnap = await getDoc(branchRef);
    
    if (branchSnap.exists()) {
      return {
        id: branchSnap.id,
        ...branchSnap.data()
      };
    } else {
      throw new Error('Branch not found');
    }
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

// Export all functions
export default {
  // Events
  getEvents,
  getUpcomingEvents,
  addEvent,
  updateEvent,
  
  // Donations
  addDonation,
  updateDonationStatus,
  getDonationStats,
  
  // Volunteers
  addVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  
  // Gallery
  addGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  
  // Awards
  addAward,
  getAwards,
  updateAward,
  deleteAward,
  
  // News
  addNewsArticle,
  getNewsArticles,
  updateNewsArticle,
  deleteNewsArticle,
  
  // Videos
  addVideo,
  getVideos,
  updateVideo,
  deleteVideo,
  
  // Branches
  getBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchById,
  
  // Contact
  addContactMessage,
  
  // Success Stories
  addSuccessStory,
  getSuccessStories,
  updateSuccessStory,
  deleteSuccessStory,
  
  // Testimonials
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  
  // Utilities
  getDocumentById,
  deleteDocument,
  getCollectionCount
};
