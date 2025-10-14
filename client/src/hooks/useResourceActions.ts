import { useState, useCallback } from 'react';
import { 
  uploadDocument, 
  uploadVideo, 
  createLink, 
  getDocuments, 
  getVideos, 
  getLinks,
  validateFileType,
  formatFileSize,
  addReview,
  getReviews,
  getRatingSummary,
  updateReview,
  deleteReview,
  getUserReview,
  type DocumentUploadData,
  type VideoUploadData,
  type LinkData,
  type ReviewData,
  type ReviewUpdateData
} from '../api/resourseApi';
import type { Document, Video, Link, Review, ResourceRating } from '../types/ThreadInterfaces';

export const useResourceActions = (workspaceId: string, threadId: string) => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Document operations
  const handleDocumentUpload = useCallback(async (uploadData: DocumentUploadData): Promise<Document> => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate file
      const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
      if (!validateFileType(uploadData.file, allowedTypes)) {
        throw new Error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (uploadData.file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      const result = await uploadDocument(workspaceId, threadId, uploadData);
      console.log('✅ Document uploaded successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Document upload failed';
      console.error('❌ Document upload failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching documents for:', { workspaceId, threadId });
      console.log('🌐 API URL will be:', `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/workspaces/${workspaceId}/threads/${threadId}/documents`);
      
      const documents = await getDocuments(workspaceId, threadId);
      console.log('✅ Documents fetched successfully:', documents.length);
      console.log('📄 Documents data:', documents);
      return documents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      console.error('❌ Failed to fetch documents:', err);
      
      // Enhanced error logging for debugging
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as Error & {
          response?: {
            status?: number;
            data?: unknown;
          };
          config?: { url?: string };
        };
        console.error('❌ API Response Status:', axiosError.response?.status);
        console.error('❌ API Response Data:', axiosError.response?.data);
        console.error('❌ API URL:', axiosError.config?.url);
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  // Video operations
  const handleVideoUpload = useCallback(async (uploadData: VideoUploadData): Promise<Video> => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate file
      const allowedTypes = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
      if (!validateFileType(uploadData.file, allowedTypes)) {
        throw new Error('Invalid file type. Please upload MP4, WEBM, OGG, AVI, or MOV files only.');
      }

      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (uploadData.file.size > maxSize) {
        throw new Error('Video file size must be less than 100MB');
      }

      const result = await uploadVideo(workspaceId, threadId, uploadData);
      console.log('✅ Video uploaded successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video upload failed';
      console.error('❌ Video upload failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const fetchVideos = useCallback(async (): Promise<Video[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const videos = await getVideos(workspaceId, threadId);
      console.log('✅ Videos fetched successfully:', videos.length);
      return videos;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch videos';
      console.error('❌ Failed to fetch videos:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  // Link operations
  const handleLinkCreate = useCallback(async (linkData: LinkData): Promise<Link> => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate URL
      try {
        new URL(linkData.url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      // Validate required fields
      if (!linkData.title.trim()) {
        throw new Error('Link title is required');
      }

      const result = await createLink(workspaceId, threadId, linkData);
      console.log('✅ Link created successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Link creation failed';
      console.error('❌ Link creation failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const fetchLinks = useCallback(async (): Promise<Link[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const links = await getLinks(workspaceId, threadId);
      console.log('✅ Links fetched successfully:', links.length);
      return links;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch links';
      console.error('❌ Failed to fetch links:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  // Utility functions
  const isValidFileType = useCallback((file: File, allowedTypes: string[]): boolean => {
    return validateFileType(file, allowedTypes);
  }, []);

  const getFileSize = useCallback((bytes: number): string => {
    return formatFileSize(bytes);
  }, []);

  // Review operations
  const handleAddReview = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string,
    reviewData: ReviewData
  ): Promise<Review> => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate rating
      if (reviewData.ratings < 1 || reviewData.ratings > 5) {
        throw new Error('Rating must be between 1 and 5 stars');
      }

      // Comment is optional - allow rating-only reviews or comment-only reviews
      if (!reviewData.review.trim() && !reviewData.ratings) {
        throw new Error('Either comment or rating is required');
      }

      const result = await addReview(workspaceId, threadId, resourceId, reviewData);
      console.log('✅ Review added successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Review submission failed';
      console.error('❌ Review submission failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const fetchReviews = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string
  ): Promise<Review[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const reviews = await getReviews(workspaceId, threadId, resourceId);
      console.log('✅ Reviews fetched successfully:', reviews.length);
      return reviews;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
      console.error('❌ Failed to fetch reviews:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  const fetchRatingSummary = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string
  ): Promise<ResourceRating> => {
    setLoading(true);
    setError(null);
    
    try {
      const summary = await getRatingSummary(workspaceId, threadId, resourceId);
      console.log('✅ Rating summary fetched successfully:', summary);
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rating summary';
      console.error('❌ Failed to fetch rating summary:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  const handleUpdateReview = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string,
    userId: string,
    updateData: ReviewUpdateData
  ): Promise<Review> => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate rating if provided
      if (updateData.ratings && (updateData.ratings < 1 || updateData.ratings > 5)) {
        throw new Error('Rating must be between 1 and 5 stars');
      }

      const result = await updateReview(workspaceId, threadId, resourceId, userId, updateData);
      console.log('✅ Review updated successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Review update failed';
      console.error('❌ Review update failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const handleDeleteReview = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string,
    reviewId: string
  ): Promise<void> => {
    setUploading(true);
    setError(null);
    
    try {
      await deleteReview(workspaceId, threadId, resourceId, reviewId);
      console.log('✅ Review deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Review deletion failed';
      console.error('❌ Review deletion failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [workspaceId, threadId]);

  const fetchUserReview = useCallback(async (
    resourceType: 'documents' | 'videos' | 'links',
    resourceId: string,
    userId: string
  ): Promise<Review | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const review = await getUserReview(workspaceId, threadId, resourceId, userId);
      console.log('✅ User review fetched:', review ? 'Found' : 'Not found');
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user review';
      console.error('❌ Failed to fetch user review:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, threadId]);

  return {
    uploading,
    loading,
    error,
    handleDocumentUpload,
    fetchDocuments,
    handleVideoUpload,
    fetchVideos,
    handleLinkCreate,
    fetchLinks,
    isValidFileType,
    getFileSize,
    clearError,
    // Review operations
    handleAddReview,
    fetchReviews,
    fetchRatingSummary,
    handleUpdateReview,
    handleDeleteReview,
    fetchUserReview,
  };
};
