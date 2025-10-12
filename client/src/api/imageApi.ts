import type { ImageMetadata, ImageUploadResult, UploadProgressCallback } from '../lib/imageUtils';
import { getAccessToken } from './authApi';

const API_BASE = 'http://localhost:3000/api';

export interface UploadImageRequest {
  file: File;
  documentId: string;
  workspaceId: string;
  threadId: string;
  position?: number;
  onProgress?: UploadProgressCallback;
}

export const uploadImage = async ({
  file,
  documentId,
  workspaceId,
  threadId,
  position,
  onProgress
}: UploadImageRequest): Promise<ImageUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);
    formData.append('workspaceId', workspaceId);
    formData.append('threadId', threadId);
    
    if (position !== undefined) {
      formData.append('imagePosition', position.toString());
    }

    const response = await fetch(`${API_BASE}/documents/${documentId}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const result = await response.json();
    
    // Map backend response to frontend ImageMetadata format
    const backendData = result.data;
    const imageMetadata = {
      id: backendData.id,
      url: backendData.downloadUrl, // Map downloadUrl to url
      firebasePath: backendData.firebasePath,
      originalName: backendData.originalName,
      mimeType: backendData.mimeType,
      size: backendData.size,
      width: backendData.metadata?.width,
      height: backendData.metadata?.height,
      documentId: backendData.documentId,
      workspaceId: backendData.workspaceId,
      threadId: backendData.threadId,
      uploadedBy: backendData.uploadedBy,
      uploadedAt: new Date(backendData.uploadedAt)
    };
    
    return {
      success: true,
      imageMetadata: imageMetadata
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
};

export const deleteImage = async (
  documentId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/documents/media/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Image delete error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image'
    };
  }
};

export const getDocumentImages = async (
  documentId: string
): Promise<{ success: boolean; images?: ImageMetadata[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/documents/${documentId}/media`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch images');
    }

    const result = await response.json();
    
    return {
      success: true,
      images: result.data || []
    };
  } catch (error: any) {
    console.error('Fetch images error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch images'
    };
  }
};

// Helper function to get auth token
const getAuthToken = (): string => {
  return getAccessToken() || '';
};

// Upload with progress tracking
export const uploadImageWithProgress = async (
  request: UploadImageRequest
): Promise<ImageUploadResult> => {
  console.log('📡 [ImageAPI] Starting upload with progress tracking');
  console.log('📡 [ImageAPI] Request details:', {
    fileName: request.file.name,
    fileSize: request.file.size,
    documentId: request.documentId,
    workspaceId: request.workspaceId,
    threadId: request.threadId,
    position: request.position
  });
  
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('documentId', request.documentId);
    formData.append('workspaceId', request.workspaceId);
    formData.append('threadId', request.threadId);
    
    if (request.position !== undefined) {
      formData.append('imagePosition', request.position.toString());
    }

    const xhr = new XMLHttpRequest();
    const url = `${API_BASE}/documents/${request.documentId}/media`;
    const token = getAuthToken();
    
    console.log('📡 [ImageAPI] Upload URL:', url);
    console.log('📡 [ImageAPI] Auth token length:', token ? token.length : 0);

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && request.onProgress) {
        const progress = (event.loaded / event.total) * 100;
        console.log('📊 [ImageAPI] Upload progress:', progress.toFixed(1) + '%');
        request.onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      console.log('📡 [ImageAPI] Upload completed with status:', xhr.status);
      console.log('📡 [ImageAPI] Response text:', xhr.responseText);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log('✅ [ImageAPI] Upload successful:', result);
          
          // Map backend response to frontend ImageMetadata format
          const backendData = result.data;
          const imageMetadata = {
            id: backendData.id,
            url: backendData.downloadUrl, // Map downloadUrl to url
            firebasePath: backendData.firebasePath,
            originalName: backendData.originalName,
            mimeType: backendData.mimeType,
            size: backendData.size,
            width: backendData.metadata?.width,
            height: backendData.metadata?.height,
            documentId: backendData.documentId,
            workspaceId: backendData.workspaceId,
            threadId: backendData.threadId,
            uploadedBy: backendData.uploadedBy,
            uploadedAt: new Date(backendData.uploadedAt)
          };
          
          resolve({
            success: true,
            imageMetadata: imageMetadata
          });
        } catch (error) {
          console.error('❌ [ImageAPI] Failed to parse response:', error);
          resolve({
            success: false,
            error: 'Invalid response format'
          });
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          console.error('❌ [ImageAPI] Upload failed with error:', error);
          resolve({
            success: false,
            error: error.message || 'Upload failed'
          });
        } catch {
          console.error('❌ [ImageAPI] Upload failed with status:', xhr.status);
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`
          });
        }
      }
    });

    xhr.addEventListener('error', (event) => {
      console.error('❌ [ImageAPI] Network error during upload:', event);
      resolve({
        success: false,
        error: 'Network error during upload'
      });
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    
    console.log('📡 [ImageAPI] Sending request...');
    xhr.send(formData);
  });
};