// resourceService.ts - Frontend API integration with TypeScript
import axios from "axios";
import { getAccessToken, getUserData } from "./authApi";
import type { Document, Link, Video, Review, ResourceRating } from "../types/ThreadInterfaces";

// Generic type for API responses
type ApiResponse = Record<string, unknown>;

export interface ResourceMetadata {
  title: string;
  description?: string;
  tags?: string[];
}

export interface LinkData {
  title: string;
  url: string;
  description?: string;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  file: File;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  type?: "pdf" | "doc" | "txt";
  tags?: string[];
  file: File;
}

export interface AllResources {
  documents: Document[];
  videos: Video[];
  links: Link[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAccessToken();
  
  let baseURL;
  if (API_URL.includes('/api')) {
    baseURL = API_URL;
  } else {
    baseURL = `${API_URL}/api`;
  }
  
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  
  return instance;
};

// Get current user ID from stored user data
const getCurrentUserId = (): string => {
  const userData = getUserData();
  if (!userData || !userData.id) {
    throw new Error('User not authenticated or user ID not found');
  }
  return userData.id.toString();
};

// ===== DOCUMENT OPERATIONS =====

export const uploadDocument = async (
  workspaceId: string,
  threadId: string,
  uploadData: DocumentUploadData,
): Promise<Document> => {
  const currentUserId = getCurrentUserId();
  const formData = new FormData();
  formData.append('file', uploadData.file);
  formData.append('user_id', currentUserId);
  formData.append('title', uploadData.title);
  formData.append('description', uploadData.description || '');
  formData.append('type', uploadData.type || 'pdf');
  
  if (uploadData.tags && uploadData.tags.length > 0) {
    formData.append('tags', JSON.stringify(uploadData.tags));
  }

  const api = createAuthenticatedRequest();
  // Override content type for multipart form data
  api.defaults.headers['Content-Type'] = 'multipart/form-data';
  
  const response = await api.post(
    `/workspaces/${workspaceId}/threads/${threadId}/documents`,
    formData
  );
  
  // Transform API response to frontend format
  const doc = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = doc.id || doc._id;
  if (!rawId) {
    console.error('❌ Backend returned no ID:', doc);
    throw new Error('Backend returned no ID. Please check your backend response.');
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const documentId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  console.log('✅ Document uploaded with ID:', documentId, 'from backend response:', doc);
  
  return {
    id: documentId,
    title: doc.title,
    type: (doc.type || "pdf") as "pdf" | "doc" | "txt",
    uploadedBy: doc.uploadedBy || doc.user_id || "Unknown",
    size: doc.size || `${Math.round((doc.file_size || 0) / 1024)}KB`,
    uploadedAt: doc.uploadedAt || doc.created_at || new Date().toISOString(),
    isCurrentlyEditing: false,
    description: doc.description,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    firebase_url: doc.firebase_url,
    created_at: doc.created_at,
    user_id: doc.user_id,
  };
};

export const getDocumentDetails = async (
  workspaceId: string,
  threadId: string,
  documentId: string,
): Promise<Document> => {
  const response = await axios.get(
    `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/documents/${documentId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const doc = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = doc.id || doc._id;
  if (!rawId) {
    console.error('❌ Backend returned no ID:', doc);
    throw new Error(`Backend returned no ID: ${doc.id}`);
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const docId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  return {
    id: docId,
    title: doc.title,
    type: (doc.type || "pdf") as "pdf" | "doc" | "txt",
    uploadedBy: doc.uploadedBy || doc.user_id || "Unknown",
    size: doc.size || `${Math.round((doc.file_size || 0) / 1024)}KB`,
    uploadedAt: doc.uploadedAt || doc.created_at || new Date().toISOString(),
    isCurrentlyEditing: false,
    description: doc.description,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    firebase_url: doc.firebase_url,
    created_at: doc.created_at,
    user_id: doc.user_id,
  };
};

// ===== VIDEO OPERATIONS =====

export const uploadVideo = async (
  workspaceId: string,
  threadId: string,
  uploadData: VideoUploadData,
): Promise<Video> => {
  console.log('🔍 uploadVideo called with:', { workspaceId, threadId, uploadData: { ...uploadData, file: uploadData.file.name } });
  
  const currentUserId = getCurrentUserId();
  const formData = new FormData();
  formData.append('file', uploadData.file);
  formData.append('user_id', currentUserId);
  formData.append('title', uploadData.title);
  formData.append('description', uploadData.description || '');

  const api = createAuthenticatedRequest();
  // Override content type for multipart form data
  api.defaults.headers['Content-Type'] = 'multipart/form-data';
  
  console.log('📡 Video upload URL:', `/workspaces/${workspaceId}/threads/${threadId}/videos`);

  const response = await api.post(
    `/workspaces/${workspaceId}/threads/${threadId}/videos`,
    formData,
    {
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    }
  );
  
  // Transform API response to frontend format
  const video = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = video.id || video._id;
  if (!rawId) {
    console.error('❌ Backend returned no video ID:', video);
    throw new Error('Backend returned no video ID. Please check your backend response.');
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const videoId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  return {
    id: videoId,
    title: video.title,
    duration: video.duration || "0:00",
    addedBy: video.user_id || "Unknown",
    addedAt: video.created_at || new Date().toISOString(),
    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
    views: 0,
    url: video.url || video.firebase_url || "",
    description: video.description,
    file_size: video.file_size,
    mime_type: video.mime_type,
    firebase_url: video.firebase_url,
    created_at: video.created_at,
    user_id: video.user_id,
  };
};

export const getVideoDetails = async (
  workspaceId: string,
  threadId: string,
  videoId: string,
): Promise<Video> => {
  const response = await axios.get(
    `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/videos/${videoId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const video = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = video.id || video._id;
  if (!rawId) {
    console.error('❌ Backend returned no video ID:', video);
    throw new Error(`Backend returned no video ID: ${video.id}`);
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const vidId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  return {
    id: vidId,
    title: video.title,
    duration: video.duration || "0:00",
    addedBy: video.user_id || "Unknown",
    addedAt: video.created_at || new Date().toISOString(),
    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
    views: video.views || 0,
    url: video.url || video.firebase_url || "",
    description: video.description,
    file_size: video.file_size,
    mime_type: video.mime_type,
    firebase_url: video.firebase_url,
    created_at: video.created_at,
    user_id: video.user_id,
  };
};

// ===== LINK OPERATIONS =====

export const createLink = async (
  workspaceId: string,
  threadId: string,
  linkData: LinkData,
): Promise<Link> => {
  const currentUserId = getCurrentUserId();
  const api = createAuthenticatedRequest();
  
  const payload = {
    user_id: currentUserId,
    title: linkData.title,
    url: linkData.url,
    description: linkData.description || '',
  };
  
  console.log('🚀 Creating link with URL:', `/workspaces/${workspaceId}/threads/${threadId}/links`);
  console.log('🚀 Payload:', payload);
  
  const response = await api.post(`/workspaces/${workspaceId}/threads/${threadId}/links`, payload);
  
  console.log('✅ Backend response:', response.data);
  
  // Transform API response to frontend format
  const link = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = link.id || link._id;
  if (!rawId) {
    console.error('❌ Backend returned no link ID:', link);
    throw new Error('Backend returned no link ID. Please check your backend response.');
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const linkId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  return {
    id: linkId,
    title: link.title,
    url: link.url,
    addedBy: link.addedBy || link.user_id || "Unknown",
    addedAt: link.addedAt || link.created_at || new Date().toISOString(),
    description: link.description || "",
    created_at: link.created_at,
    user_id: link.user_id,
  };
};

export const getLinkDetails = async (
  workspaceId: string,
  threadId: string,
  linkId: string,
): Promise<Link> => {
  const response = await axios.get(
    `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/links/${linkId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const link = response.data;
  
  // Handle both numeric and UUID string IDs from backend
  const rawId = link.id || link._id;
  if (!rawId) {
    console.error('❌ Backend returned no link ID:', link);
    throw new Error(`Backend returned no link ID: ${link.id}`);
  }
  
  // Try to parse as number first, if it fails, use the string as-is (for UUIDs)
  const linkIdValue = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId));
  
  return {
    id: linkIdValue,
    title: link.title,
    url: link.url,
    addedBy: link.addedBy || link.user_id || "Unknown",
    addedAt: link.addedAt || link.created_at || new Date().toISOString(),
    description: link.description || "",
    created_at: link.created_at,
    user_id: link.user_id,
  };
};

export const getAllResources = async (
  workspaceId: string,
  threadId: string,
) => {
  const response = await axios.get(
    `${API_URL}/resource-service/workspace/${workspaceId}/threads/${threadId}/resources`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.resources || { documents: [], videos: [], links: [] };
};

export const deleteResource = async (
  workspaceId: string,
  threadId: string,
  resourceType: 'documents' | 'videos' | 'links',
  resourceId: string,
) => {
  const currentUserId = getCurrentUserId();
  const api = createAuthenticatedRequest();
  
  const response = await api.delete(
    `/workspace/${workspaceId}/threads/${threadId}/${resourceType}/${resourceId}`,
    {
      data: { user_id: currentUserId },
    }
  );
  return response.data;
};

// ===== INDIVIDUAL RESOURCE GETTERS =====

export const getDocuments = async (
  workspaceId: string,
  threadId: string,
): Promise<Document[]> => {
  const url = `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/documents`;
  
  console.log('🔗 Fetching documents from URL:', url);
  console.log('📊 Request parameters:', { workspaceId, threadId });
  
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  console.log('📡 API Response Status:', response.status);
  console.log('📡 API Response Data:', response.data);
  console.log('📡 API Response Data Type:', typeof response.data);
  console.log('📡 API Response Data Length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
  
  // Handle different response structures
  const apiDocuments = Array.isArray(response.data) 
    ? response.data 
    : (response.data.documents || response.data.data || []);
  console.log('📄 Raw documents from API:', apiDocuments);
  
  // Transform backend response to frontend format
  const transformedDocuments = apiDocuments.map((apiDoc: Record<string, unknown>) => {
    console.log('🔧 Transforming document:', apiDoc);
    
    // Handle both numeric and UUID string IDs from backend
    const rawId = apiDoc.id || apiDoc._id;
    if (!rawId) {
      console.error('❌ Document has no ID from backend:', apiDoc);
      console.warn('⚠️ Skipping document with no ID. Backend should return valid IDs.');
      return null; // Mark for filtering out
    }
    
    // For numeric IDs, validate they're positive. For string IDs (UUIDs), just check they exist
    let validId: string | number;
    if (typeof rawId === 'string' && isNaN(Number(rawId))) {
      // It's a UUID string
      validId = rawId;
      console.log('✅ Using UUID ID:', validId);
    } else {
      // It's numeric
      const numericId = parseInt(String(rawId));
      if (!numericId || numericId <= 0) {
        console.error('❌ Document has invalid numeric ID from backend:', apiDoc);
        console.warn('⚠️ Skipping document with invalid numeric ID. Backend should return valid IDs.');
        return null; // Mark for filtering out
      }
      validId = numericId;
      console.log('✅ Using numeric ID:', validId);
    }
    
    const transformed = {
      id: validId, // Use the validated ID (either string UUID or positive number)
      title: String(apiDoc.title || apiDoc.name || "Untitled Document"),
      type: (String(apiDoc.type || apiDoc.document_type || "pdf")) as "pdf" | "doc" | "txt",
      uploadedBy: String(apiDoc.uploadedBy || apiDoc.uploaded_by || apiDoc.user_id || apiDoc.author) || "Unknown",
      size: String(apiDoc.size) || `${Math.round((Number(apiDoc.file_size || apiDoc.size_bytes) || 0) / 1024)}KB`,
      uploadedAt: String(apiDoc.uploadedAt || apiDoc.uploaded_at || apiDoc.created_at || apiDoc.createdAt) || new Date().toISOString(),
      isCurrentlyEditing: false,
      // Include backend fields for compatibility
      description: String(apiDoc.description || apiDoc.desc || ""),
      file_size: Number(apiDoc.file_size || apiDoc.size_bytes) || 0,
      mime_type: String(apiDoc.mime_type || apiDoc.mimeType || apiDoc.content_type) || "application/octet-stream",
      firebase_url: String(apiDoc.firebase_url || apiDoc.firebaseUrl || apiDoc.download_url || apiDoc.url) || "",
      created_at: String(apiDoc.created_at || apiDoc.createdAt || apiDoc.uploadedAt) || new Date().toISOString(),
      user_id: String(apiDoc.user_id || apiDoc.userId || apiDoc.uploadedBy) || "",
    };
    
    console.log('✅ Transformed document:', transformed);
    return transformed;
  }).filter(Boolean); // Remove null values first
  
  // Filter out any remaining invalid documents
  const validDocuments = transformedDocuments.filter((doc: Document) => 
    doc && doc.title && doc.title !== "Untitled Document" && doc.id && 
    (typeof doc.id === 'string' || (typeof doc.id === 'number' && doc.id > 0))
  );
  
  console.log('🔄 Valid transformed documents:', validDocuments);
  return validDocuments;
};

export const getVideos = async (workspaceId: string, threadId: string): Promise<Video[]> => {
  const fetchUrl = `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/videos`;
  console.log('🔍 getVideos called with:', { workspaceId, threadId });
  console.log('📡 Video fetch URL:', fetchUrl);
  
  const response = await axios.get(
    fetchUrl,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  console.log('📦 Raw getVideos API response:', response.data);
  const apiVideos = response.data.videos || response.data || [];
  console.log('🔍 Extracted videos array:', apiVideos);
  
  // Transform backend response to frontend format
  return apiVideos.map((apiVideo: ApiResponse) => {
    const rawId = apiVideo.id || apiVideo._id;
    const videoId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId)) || 0;
    
    return {
      id: videoId,
      title: String(apiVideo.title || ""),
      duration: String(apiVideo.duration) || "0:00",
      addedBy: String(apiVideo.user_id) || "Unknown",
      addedAt: String(apiVideo.created_at) || new Date().toISOString(),
      thumbnail: String(apiVideo.thumbnail) || "/default-thumbnail.jpg",
      views: 0,
      url: String(apiVideo.url || apiVideo.firebase_url) || "",
      description: apiVideo.description as string,
      // Include backend fields for compatibility
      file_size: apiVideo.file_size as number,
      mime_type: apiVideo.mime_type as string,
      firebase_url: apiVideo.firebase_url as string,
      created_at: apiVideo.created_at as string,
      user_id: apiVideo.user_id as string,
    };
  });
};

export const getLinks = async (workspaceId: string, threadId: string): Promise<Link[]> => {
  const url = `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/links`;
  console.log('🔍 Fetching links from URL:', url);
  
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  console.log('📦 Raw getLinks response:', response.data);
  console.log('🔍 Response structure:', {
    hasLinks: 'links' in response.data,
    hasData: 'data' in response.data,
    isArray: Array.isArray(response.data),
    keys: Object.keys(response.data)
  });
  
  // Try different response formats
  let apiLinks: ApiResponse[] = [];
  
  if (response.data.links) {
    apiLinks = response.data.links;
    console.log('📋 Using response.data.links:', apiLinks.length, 'items');
  } else if (Array.isArray(response.data)) {
    apiLinks = response.data;
    console.log('📋 Using response.data as array:', apiLinks.length, 'items');
  } else if (response.data.data) {
    apiLinks = response.data.data;
    console.log('📋 Using response.data.data:', apiLinks.length, 'items');
  } else {
    console.warn('⚠️ Unknown response format, defaulting to empty array');
    apiLinks = [];
  }
  
  console.log('🎯 Final apiLinks to process:', apiLinks);
  
  // Transform backend response to frontend format
  return apiLinks.map((apiLink: ApiResponse) => {
    const rawId = apiLink.id || apiLink._id;
    const linkId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId)) || 0;
    
    return {
      id: linkId,
      title: String(apiLink.title || ""),
      url: String(apiLink.url || ""),
      addedBy: String(apiLink.addedBy || apiLink.user_id) || "Unknown",
      addedAt: String(apiLink.addedAt || apiLink.created_at) || new Date().toISOString(),
      description: String(apiLink.description) || "",
      // Include backend fields for compatibility
      created_at: apiLink.created_at as string,
      user_id: apiLink.user_id as string,
    };
  });
};

// ===== UTILITY FUNCTIONS =====

// Search/Query functions for documents
export const queryDocuments = async (
  workspaceId: string,
  threadId: string,
  query: string,
): Promise<Document[]> => {
  const response = await axios.post(
    `${API_URL}/workspace/${workspaceId}/threads/${threadId}/documents/query`,
    {
      query: query,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const apiDocuments = response.data.documents || [];
  return apiDocuments.map((apiDoc: ApiResponse) => {
    const rawId = apiDoc.id || apiDoc._id;
    const docId = typeof rawId === 'string' && isNaN(Number(rawId)) ? rawId : parseInt(String(rawId)) || 0;
    
    return {
      id: docId,
      title: String(apiDoc.title || ""),
      type: (String(apiDoc.type) || "pdf") as "pdf" | "doc" | "txt",
      uploadedBy: String(apiDoc.uploadedBy || apiDoc.user_id) || "Unknown",
      size: String(apiDoc.size) || `${Math.round((Number(apiDoc.file_size) || 0) / 1024)}KB`,
      uploadedAt: String(apiDoc.uploadedAt || apiDoc.created_at) || new Date().toISOString(),
      isCurrentlyEditing: false,
      description: apiDoc.description as string,
      file_size: apiDoc.file_size as number,
      mime_type: apiDoc.mime_type as string,
      firebase_url: apiDoc.firebase_url as string,
      created_at: apiDoc.created_at as string,
      user_id: apiDoc.user_id as string,
    };
  });
};

// Download document
export const downloadDocument = async (
  workspaceId: string,
  threadId: string,
  documentId: string,
): Promise<Blob> => {
  const response = await axios.get(
    `${API_URL}/workspace/${workspaceId}/threads/${threadId}/documents/${documentId}/download`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

// Share resource
export const shareResource = async (
  workspaceId: string,
  threadId: string,
  resourceType: 'documents' | 'videos' | 'links',
  resourceId: string,
  shareData: { email: string; message?: string },
): Promise<{ success: boolean; shareUrl: string }> => {
  const response = await axios.post(
    `${API_URL}/resource-service/workspace/${workspaceId}/threads/${threadId}/${resourceType}/${resourceId}/share`,
    shareData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Update resource metadata
export const updateResourceMetadata = async (
  workspaceId: string,
  threadId: string,
  resourceType: 'documents' | 'videos' | 'links',
  resourceId: string,
  updates: Partial<ResourceMetadata>,
): Promise<boolean> => {
  const response = await axios.patch(
    `${API_URL}/resource-service/workspace/${workspaceId}/threads/${threadId}/${resourceType}/${resourceId}`,
    updates,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.status === 200;
};

// Helper function to validate file types
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.includes('/')) {
      // MIME type check
      return file.type === type;
    } else {
      // Extension check
      return file.name.toLowerCase().endsWith(`.${type}`);
    }
  });
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to extract video metadata
export const extractVideoMetadata = (file: File): Promise<{ duration: string; thumbnail?: string }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      resolve({
        duration: formattedDuration,
      });
    };
    
    video.onerror = () => {
      resolve({ duration: '0:00' });
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// ===== REVIEW AND RATING OPERATIONS =====

export interface ReviewData {
  user_id: string
  username: string
  ratings: number  // 1-5 stars (backend expects 'ratings' not 'rating')
  review: string   // backend expects 'review' not 'comment'
}

export interface ReviewUpdateData {
  ratings?: number  // backend expects 'ratings' not 'rating'
  review?: string   // backend expects 'review' not 'comment'
}

// Add a review to a resource
export const addReview = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
  reviewData: ReviewData,
): Promise<Review> => {
  const url = `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/reviews`;
  
  console.log('🚀 Adding review with URL:', url);
  console.log('🚀 Review data being sent:', JSON.stringify(reviewData, null, 2));
  console.log('🚀 URL parameters:', { workspaceId, threadId, resourceId });
  console.log('🚀 API_URL:', API_URL);
  
  try {
    const response = await axios.post(
      url,
      reviewData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ Review added successfully:', response.data);
    
    // Transform backend response to frontend format
    const backendReview = response.data;
    const frontendReview: Review = {
      id: backendReview.id,
      user_id: backendReview.user_id,
      username: backendReview.username || reviewData.username, // Use username from request if not in response
      rating: backendReview.ratings || backendReview.rating || 0,
      comment: backendReview.review || backendReview.comment || '',
      created_at: backendReview.created_at,
      updated_at: backendReview.updated_at,
      // Keep backend fields for compatibility
      ratings: backendReview.ratings,
      review: backendReview.review
    };
    
    return frontendReview;
  } catch (error) {
    console.error('❌ Review submission failed with detailed error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('❌ Response status:', error.response?.status);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response headers:', error.response?.headers);
      console.error('❌ Request config:', error.config);
      
      // Log the actual error message from backend if available
      if (error.response?.data) {
        console.error('❌ Backend error details:', error.response.data);
      }
    }
    
    throw error;
  }
};

// Get all reviews for a resource
export const getReviews = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
): Promise<Review[]> => {
  const url = `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/reviews`;
  
  console.log('🔍 Getting reviews with URL:', url);
  
  try {
    const response = await axios.get(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ Reviews fetched successfully:', response.data);
    
    // Transform backend response to frontend format
    const backendReviews = Array.isArray(response.data) ? response.data : [];
    const frontendReviews: Review[] = backendReviews.map((backendReview: Record<string, unknown>) => ({
      id: backendReview.id as number | string,
      user_id: String(backendReview.user_id || ''),
      username: String(backendReview.username || 'Anonymous User'),
      rating: Number(backendReview.ratings || backendReview.rating) || 0,
      comment: String(backendReview.review || backendReview.comment) || '',
      created_at: String(backendReview.created_at || ''),
      updated_at: String(backendReview.updated_at || ''),
      // Keep backend fields for compatibility
      ratings: Number(backendReview.ratings) || undefined,
      review: String(backendReview.review) || undefined
    }));
    
    return frontendReviews;
  } catch (error) {
    console.error('❌ Get reviews failed with detailed error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('❌ Response status:', error.response?.status);
      console.error('❌ Response data:', error.response?.data);
      
      // If it's a 404, return empty array (no reviews yet)
      if (error.response?.status === 404) {
        console.log('🔄 No reviews found (404), returning empty array');
        return [];
      }
    }
    
    throw error;
  }
};

// Get rating summary for a resource
export const getRatingSummary = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
): Promise<ResourceRating> => {
  const response = await axios.get(
    `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/rating-summary`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
};

// Update a review (now uses user-specific endpoint)
export const updateReview = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
  updateData: ReviewUpdateData,
): Promise<Review> => {
  const currentUserId = getCurrentUserId();
  const api = createAuthenticatedRequest();
  
  const response = await api.put(
    `/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/reviews/user/${currentUserId}`,
    updateData
  );
  
  // Transform backend response to frontend format
  const backendReview = response.data;
  const frontendReview: Review = {
    id: backendReview.id,
    user_id: backendReview.user_id,
    username: backendReview.username || 'Anonymous User',
    rating: backendReview.ratings || backendReview.rating || 0,
    comment: backendReview.review || backendReview.comment || '',
    created_at: backendReview.created_at,
    updated_at: backendReview.updated_at,
    // Keep backend fields for compatibility
    ratings: backendReview.ratings,
    review: backendReview.review
  };
  
  return frontendReview;
};

// Delete a review
export const deleteReview = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
  reviewId: string,
): Promise<void> => {
  await axios.delete(
    `${API_URL}/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/reviews/${reviewId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

// Get user's review for a resource (if any)
// Wrapper functions for backward compatibility
export const handleUpdateReview = async (
  resourceType: string,
  resourceId: string,
  _userId: string, // Deprecated - now uses current user automatically
  updateData: ReviewUpdateData,
): Promise<Review> => {
  // For now, we'll assume workspaceId and threadId are available from context
  // This is a temporary solution - ideally these should be passed properly
  const workspaceId = "temp-workspace"; // TODO: Get from context
  const threadId = "temp-thread"; // TODO: Get from context
  
  return updateReview(workspaceId, threadId, resourceId, updateData);
};

export const getUserReview = async (
  workspaceId: string,
  threadId: string,
  resourceId: string,
): Promise<Review | null> => {
  const currentUserId = getCurrentUserId();
  const api = createAuthenticatedRequest();
  
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/threads/${threadId}/resources/${resourceId}/reviews/user/${currentUserId}`
    );
    
    // Transform backend response to frontend format
    const backendReview = response.data;
    const frontendReview: Review = {
      id: backendReview.id,
      user_id: backendReview.user_id,
      username: backendReview.username || 'Anonymous User',
      rating: backendReview.ratings || backendReview.rating || 0,
      comment: backendReview.review || backendReview.comment || '',
      created_at: backendReview.created_at,
      updated_at: backendReview.updated_at,
      // Keep backend fields for compatibility
      ratings: backendReview.ratings,
      review: backendReview.review
    };
    
    return frontendReview;
  } catch (error) {
    // If no review found, return null
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
