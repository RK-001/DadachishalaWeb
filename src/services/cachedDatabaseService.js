/**
 * Cached Database Service
 * Firebase operations with intelligent caching
 */

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import cacheService from './cacheService';

// ================================
// EVENTS OPERATIONS
// ================================

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

export const addEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('events');
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, updateData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('events');
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    cacheService.invalidateCollection('events');
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// ================================
// GALLERY OPERATIONS
// ================================

export const getGalleryItems = async (category = null, limitCount = null) => {
  try {
    let q;
    
    if (category) {
      q = query(
        collection(db, 'gallery'),
        where('category', '==', category)
      );
    } else {
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
    
    if (category) {
      items = items.sort((a, b) => {
        const dateA = a.uploaded_at?.toDate?.() || new Date(0);
        const dateB = b.uploaded_at?.toDate?.() || new Date(0);
        return dateB - dateA;
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

export const addGalleryItem = async (galleryData) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...galleryData,
      uploaded_at: serverTimestamp()
    });
    cacheService.invalidateCollection('gallery');
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

export const updateGalleryItem = async (itemId, updateData) => {
  try {
    const itemRef = doc(db, 'gallery', itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('gallery');
  } catch (error) {
    console.error('Error updating gallery item:', error);
    throw error;
  }
};

export const deleteGalleryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'gallery', itemId));
    cacheService.invalidateCollection('gallery');
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

// ================================
// SUCCESS STORIES OPERATIONS
// ================================

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

export const addSuccessStory = async (storyData) => {
  try {
    const docRef = await addDoc(collection(db, 'success_stories'), {
      ...storyData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('successStories');
    return docRef.id;
  } catch (error) {
    console.error('Error adding success story:', error);
    throw error;
  }
};

export const updateSuccessStory = async (storyId, updateData) => {
  try {
    const storyRef = doc(db, 'success_stories', storyId);
    await updateDoc(storyRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('successStories');
  } catch (error) {
    console.error('Error updating success story:', error);
    throw error;
  }
};

export const deleteSuccessStory = async (storyId) => {
  try {
    await deleteDoc(doc(db, 'success_stories', storyId));
    cacheService.invalidateCollection('successStories');
  } catch (error) {
    console.error('Error deleting success story:', error);
    throw error;
  }
};

// ================================
// TESTIMONIALS OPERATIONS
// ================================

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

export const addTestimonial = async (testimonialData) => {
  try {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...testimonialData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('testimonials');
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (testimonialId, updateData) => {
  try {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    await updateDoc(testimonialRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('testimonials');
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (testimonialId) => {
  try {
    await deleteDoc(doc(db, 'testimonials', testimonialId));
    cacheService.invalidateCollection('testimonials');
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// ================================
// BLOGS OPERATIONS
// ================================

export const getBlogs = async (authorType = null, limitCount = null) => {
  try {
    let q = query(collection(db, 'blogs'), orderBy('created_at', 'desc'));
    
    if (authorType) {
      q = query(
        collection(db, 'blogs'),
        where('author_type', '==', authorType),
        orderBy('created_at', 'desc')
      );
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const docRef = doc(db, 'blogs', blogId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Blog not found');
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const addBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('blogs');
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

export const updateBlog = async (blogId, updateData) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('blogs');
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, 'blogs', blogId));
    cacheService.invalidateCollection('blogs');
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// ================================
// BRANCHES OPERATIONS
// ================================

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

export const getBranchById = async (branchId) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    const branchSnap = await getDoc(branchRef);
    
    if (branchSnap.exists()) {
      return { id: branchSnap.id, ...branchSnap.data() };
    } else {
      throw new Error('Branch not found');
    }
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

export const addBranch = async (branchData) => {
  try {
    const docRef = await addDoc(collection(db, 'branches'), {
      ...branchData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('branches');
    return docRef.id;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

export const updateBranch = async (branchId, updateData) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await updateDoc(branchRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('branches');
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

export const deleteBranch = async (branchId) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await deleteDoc(branchRef);
    cacheService.invalidateCollection('branches');
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};

// ================================
// AWARDS OPERATIONS (continuing all remaining functions...)
// ================================

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

export const addAward = async (awardData) => {
  try {
    const docRef = await addDoc(collection(db, 'awards'), {
      ...awardData,
      created_at: serverTimestamp()
    });
    cacheService.invalidateCollection('awards');
    return docRef.id;
  } catch (error) {
    console.error('Error adding award:', error);
    throw error;
  }
};

export const updateAward = async (awardId, updateData) => {
  try {
    const awardRef = doc(db, 'awards', awardId);
    await updateDoc(awardRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('awards');
  } catch (error) {
    console.error('Error updating award:', error);
    throw error;
  }
};

export const deleteAward = async (awardId) => {
  try {
    await deleteDoc(doc(db, 'awards', awardId));
    cacheService.invalidateCollection('awards');
  } catch (error) {
    console.error('Error deleting award:', error);
    throw error;
  }
};

// NEWS, VIDEOS, VOLUNTEERS, DONATIONS functions...
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

export const addNewsArticle = async (newsData) => {
  try {
    const docRef = await addDoc(collection(db, 'news'), {
      ...newsData,
      created_at: serverTimestamp()
    });
    cacheService.invalidateCollection('news');
    return docRef.id;
  } catch (error) {
    console.error('Error adding news article:', error);
    throw error;
  }
};

export const updateNewsArticle = async (newsId, updateData) => {
  try {
    const newsRef = doc(db, 'news', newsId);
    await updateDoc(newsRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('news');
  } catch (error) {
    console.error('Error updating news article:', error);
    throw error;
  }
};

export const deleteNewsArticle = async (newsId) => {
  try {
    await deleteDoc(doc(db, 'news', newsId));
    cacheService.invalidateCollection('news');
  } catch (error) {
    console.error('Error deleting news article:', error);
    throw error;
  }
};

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

export const addVideo = async (videoData) => {
  try {
    const docRef = await addDoc(collection(db, 'videos'), {
      ...videoData,
      created_at: serverTimestamp()
    });
    cacheService.invalidateCollection('videos');
    return docRef.id;
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
};

export const updateVideo = async (videoId, updateData) => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('videos');
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    await deleteDoc(doc(db, 'videos', videoId));
    cacheService.invalidateCollection('videos');
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

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

export const addVolunteer = async (volunteerData) => {
  try {
    const docRef = await addDoc(collection(db, 'volunteers'), {
      ...volunteerData,
      created_at: serverTimestamp(),
      status: 'pending'
    });
    cacheService.invalidateCollection('volunteers');
    return docRef.id;
  } catch (error) {
    console.error('Error adding volunteer:', error);
    throw error;
  }
};

export const updateVolunteerStatus = async (volunteerId, status, notes = '') => {
  try {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(volunteerRef, {
      application_status: status,
      status,                         // keep both fields in sync
      updated_at: serverTimestamp(),
      ...(notes && { status_notes: notes })
    });
    cacheService.invalidateCollection('volunteers');
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    throw error;
  }
};

export const assignVolunteerToBranch = async (volunteerId, branchName, coordinatorEmail) => {
  try {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(volunteerRef, {
      assigned_branch: branchName,
      coordinator_email: coordinatorEmail,
      status: 'assigned',
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('volunteers');
  } catch (error) {
    console.error('Error assigning volunteer to branch:', error);
    throw error;
  }
};

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
    cacheService.invalidateCollection('volunteers');
  } catch (error) {
    console.error('Error adding volunteer action:', error);
    throw error;
  }
};

export const getDonations = async (limitCount = null) => {
  try {
    let q = query(collection(db, 'donors'), orderBy('createdAt', 'desc'));
    if (limitCount) {
      q = query(collection(db, 'donors'), orderBy('createdAt', 'desc'), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const getDonationById = async (donationId) => {
  try {
    const docRef = doc(db, 'donors', donationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Donation not found');
    }
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw error;
  }
};

export const getDonationStats = async () => {
  try {
    const q = query(
      collection(db, 'donations'),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(q);
    const donations = querySnapshot.docs.map(doc => doc.data());
    
    return {
      totalAmount: donations.reduce((sum, donation) => sum + (donation.amount || 0), 0),
      totalDonors: donations.length,
      donations
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
};

export const addDonation = async (donationData) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      created_at: serverTimestamp(),
      status: 'pending'
    });
    cacheService.invalidateCollection('donations');
    cacheService.invalidate('stats', { type: 'donations' });
    return docRef.id;
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
};

export const updateDonationStatus = async (donationId, status, paymentId = null) => {
  try {
    const donationRef = doc(db, 'donations', donationId);
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
    }

    await updateDoc(donationRef, updateData);
    
    cacheService.invalidateCollection('donations');
    cacheService.invalidate('stats', { type: 'donations' });
    console.log('Donation status updated successfully');
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

// ================================
// TEAM OPERATIONS
// ================================

export const getTeamMembers = async () => {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.warn('getTeamMembers: orderBy query failed, falling back to unordered fetch:', error.message);
    // Fallback: fetch without ordering (handles missing index or missing 'order' field)
    try {
      const fallbackSnapshot = await getDocs(collection(db, 'team'));
      const members = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side if 'order' field exists on documents
      return members.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    } catch (fallbackError) {
      console.error('Error fetching team members (fallback):', fallbackError);
      throw fallbackError;
    }
  }
};

export const addTeamMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, 'team'), {
      ...memberData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('team');
    return docRef.id;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (memberId, updateData) => {
  try {
    const memberRef = doc(db, 'team', memberId);
    await updateDoc(memberRef, {
      ...updateData,
      updated_at: serverTimestamp()
    });
    cacheService.invalidateCollection('team');
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (memberId) => {
  try {
    await deleteDoc(doc(db, 'team', memberId));
    cacheService.invalidateCollection('team');
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

// ================================
// CONTACT MESSAGES
// ================================

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

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    cacheService.invalidateCollection(collectionName);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

export const getCollectionCount = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error(`Error getting ${collectionName} count:`, error);
    throw error;
  }
};

export const clearCache = (collectionName = null) => {
  if (collectionName) {
    cacheService.invalidateCollection(collectionName);
  } else {
    cacheService.clearAll();
  }
};

export const getCacheStats = () => {
  return cacheService.getStats();
};

export const prefetchData = async (collections = ['events', 'gallery', 'branches']) => {
  console.log('Prefetching data for:', collections);
  const promises = [];
  
  if (collections.includes('events')) {
    promises.push(getUpcomingEvents(3));
  }
  if (collections.includes('gallery')) {
    promises.push(getGalleryItems(null, 12));
  }
  if (collections.includes('branches')) {
    promises.push(getBranches());
  }
  if (collections.includes('successStories')) {
    promises.push(getSuccessStories());
  }
  if (collections.includes('testimonials')) {
    promises.push(getTestimonials());
  }
  if (collections.includes('blogs')) {
    promises.push(getBlogs(null, 6));
  }
  
  await Promise.allSettled(promises);
  console.log('Prefetch complete');
};

export default {
  getEvents,
  getUpcomingEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getSuccessStories,
  addSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  getBranches,
  getBranchById,
  addBranch,
  updateBranch,
  deleteBranch,
  getAwards,
  addAward,
  updateAward,
  deleteAward,
  getNewsArticles,
  addNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  getVolunteers,
  getVolunteersByStatus,
  addVolunteer,
  updateVolunteerStatus,
  assignVolunteerToBranch,
  addVolunteerAction,
  getDonations,
  getDonationById,
  getDonationStats,
  addDonation,
  updateDonationStatus,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  addContactMessage,
  getDocumentById,
  deleteDocument,
  getCollectionCount,
  clearCache,
  getCacheStats,
  prefetchData
};
