/**
 * Custom React Query Hooks for Firebase Data
 * Provides optimized data fetching with caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cachedDb from '../services/cachedDatabaseService';

// Query Keys - centralized for consistency
export const QUERY_KEYS = {
  events: 'events',
  upcomingEvents: 'upcomingEvents',
  gallery: 'gallery',
  successStories: 'successStories',
  testimonials: 'testimonials',
  blogs: 'blogs',
  blog: 'blog',
  branches: 'branches',
  branch: 'branch',
  awards: 'awards',
  news: 'news',
  videos: 'videos',
  team: 'team',
  volunteers: 'volunteers',
  donations: 'donations',
  donation: 'donation',
  donationStats: 'donationStats',
};

// ================================
// EVENTS HOOKS
// ================================

export const useEvents = (limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.events, limitCount],
    queryFn: () => cachedDb.getEvents(limitCount),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useUpcomingEvents = (limitCount = 3) => {
  return useQuery({
    queryKey: [QUERY_KEYS.upcomingEvents, limitCount],
    queryFn: () => cachedDb.getUpcomingEvents(limitCount),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.events] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.upcomingEvents] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, updateData }) => cachedDb.updateEvent(eventId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.events] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.upcomingEvents] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.events] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.upcomingEvents] });
    },
  });
};

// ================================
// GALLERY HOOKS
// ================================

export const useGalleryItems = (category = null, limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.gallery, category, limitCount],
    queryFn: () => cachedDb.getGalleryItems(category, limitCount),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gallery] });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, updateData }) => cachedDb.updateGalleryItem(itemId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gallery] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gallery] });
    },
  });
};

// ================================
// SUCCESS STORIES HOOKS
// ================================

export const useSuccessStories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.successStories],
    queryFn: cachedDb.getSuccessStories,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddSuccessStory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addSuccessStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.successStories] });
    },
  });
};

export const useUpdateSuccessStory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storyId, updateData }) => cachedDb.updateSuccessStory(storyId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.successStories] });
    },
  });
};

export const useDeleteSuccessStory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteSuccessStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.successStories] });
    },
  });
};

// ================================
// TESTIMONIALS HOOKS
// ================================

export const useTestimonials = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.testimonials],
    queryFn: cachedDb.getTestimonials,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.testimonials] });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testimonialId, updateData }) => cachedDb.updateTestimonial(testimonialId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.testimonials] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.testimonials] });
    },
  });
};

// ================================
// BLOGS HOOKS
// ================================

export const useBlogs = (authorType = null, limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.blogs, authorType, limitCount],
    queryFn: () => cachedDb.getBlogs(authorType, limitCount),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBlog = (blogId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.blog, blogId],
    queryFn: () => cachedDb.getBlogById(blogId),
    enabled: !!blogId, // Only run if blogId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ blogId, updateData }) => cachedDb.updateBlog(blogId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog, variables.blogId] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
    },
  });
};

// ================================
// BRANCHES HOOKS
// ================================

export const useBranches = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.branches],
    queryFn: cachedDb.getBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBranch = (branchId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.branch, branchId],
    queryFn: () => cachedDb.getBranchById(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.branches] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ branchId, updateData }) => cachedDb.updateBranch(branchId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.branches] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.branch, variables.branchId] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.branches] });
    },
  });
};

// ================================
// AWARDS HOOKS
// ================================

export const useAwards = (limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.awards, limitCount],
    queryFn: () => cachedDb.getAwards(limitCount),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddAward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.awards] });
    },
  });
};

export const useUpdateAward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ awardId, updateData }) => cachedDb.updateAward(awardId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.awards] });
    },
  });
};

export const useDeleteAward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.awards] });
    },
  });
};

// ================================
// NEWS HOOKS
// ================================

export const useNews = (limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.news, limitCount],
    queryFn: () => cachedDb.getNewsArticles(limitCount),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addNewsArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.news] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ newsId, updateData }) => cachedDb.updateNewsArticle(newsId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.news] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteNewsArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.news] });
    },
  });
};

// ================================
// VIDEOS HOOKS
// ================================

export const useVideos = (limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.videos, limitCount],
    queryFn: () => cachedDb.getVideos(limitCount),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ videoId, updateData }) => cachedDb.updateVideo(videoId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
    },
  });
};

// ================================
// VOLUNTEERS HOOKS
// ================================

export const useVolunteers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.volunteers],
    queryFn: cachedDb.getVolunteers,
    staleTime: 1 * 60 * 1000, // 1 minute (dynamic data)
  });
};

export const useVolunteersByStatus = (status) => {
  return useQuery({
    queryKey: [QUERY_KEYS.volunteers, status],
    queryFn: () => cachedDb.getVolunteersByStatus(status),
    enabled: !!status,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAddVolunteer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.volunteers] });
    },
  });
};

export const useUpdateVolunteerStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ volunteerId, status, notes }) => 
      cachedDb.updateVolunteerStatus(volunteerId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.volunteers] });
    },
  });
};

// ================================
// DONATIONS HOOKS
// ================================

export const useDonations = (limitCount = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.donations, limitCount],
    queryFn: () => cachedDb.getDonations(limitCount),
    staleTime: 1 * 60 * 1000, // 1 minute (dynamic data)
  });
};

export const useDonation = (donationId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.donation, donationId],
    queryFn: () => cachedDb.getDonationById(donationId),
    enabled: !!donationId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useDonationStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.donationStats],
    queryFn: cachedDb.getDonationStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cachedDb.addDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.donations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.donationStats] });
    },
  });
};

export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ donationId, status, paymentId }) => 
      cachedDb.updateDonationStatus(donationId, status, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.donations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.donationStats] });
    },
  });
};

// ================================
// TEAM HOOKS
// ================================

export const useTeamMembers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.team],
    queryFn: cachedDb.getTeamMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cachedDb.addTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.team] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, updateData }) => cachedDb.updateTeamMember(memberId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.team] });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cachedDb.deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.team] });
    },
  });
};

// ================================
// CONTACT HOOKS
// ================================

export const useAddContactMessage = () => {
  return useMutation({
    mutationFn: cachedDb.addContactMessage,
  });
};

// ================================
// PREFETCH UTILITY
// ================================

export const usePrefetchData = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.upcomingEvents, 3],
      queryFn: () => cachedDb.getUpcomingEvents(3),
    });
    
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.gallery, null, 12],
      queryFn: () => cachedDb.getGalleryItems(null, 12),
    });
    
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.branches],
      queryFn: cachedDb.getBranches,
    });
  };
};
