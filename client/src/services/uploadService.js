import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'firebase/storage';
import { storage } from '../firebase/config';

export class UploadService {
  /**
   * Upload file to Firebase Storage
   * @param {File} file - File to upload
   * @param {string} workspaceId - Workspace ID
   * @param {string} threadId - Thread ID
   * @param {string} userId - User ID
   * @param {string} resourceType - 'document' or 'video'
   * @param {function} onProgress - Progress callback
   * @returns {Promise} Upload result
   */
  static uploadFile(
    file,
    workspaceId,
    threadId,
    userId,
    resourceType,
    onProgress,
  ) {
    return new Promise((resolve, reject) => {
      // Validate file type
      const allowedTypes = {
        document: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'],
        video: ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'],
      };

      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes[resourceType]?.includes(fileExtension)) {
        reject(new Error(`Invalid file type for ${resourceType}`));
        return;
      }

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        reject(new Error('File size must be less than 100MB'));
        return;
      }

      // Create unique filename
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${userId}_${timestamp}_${sanitizedFileName}`;

      // Create storage path
      const storagePath = `workspaces/${workspaceId}/threads/${threadId}/${resourceType}s/${fileName}`;
      const storageRef = ref(storage, storagePath);

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          uploadedBy: userId,
          workspaceId: workspaceId,
          threadId: threadId,
          originalName: file.name,
          uploadTimestamp: new Date().toISOString(),
        },
      });

      // Handle upload progress and completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              firebase_path: storagePath,
              firebase_url: downloadURL,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              storage_ref: storagePath,
            });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }

  /**
   * Delete file from Firebase Storage
   * @param {string} firebasePath - Path to file in storage
   * @returns {Promise} Deletion result
   */
  static async deleteFile(firebasePath) {
    try {
      const storageRef = ref(storage, firebasePath);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   * @param {string} firebasePath - Path to file in storage
   * @returns {Promise} File metadata
   */
  static async getFileInfo(firebasePath) {
    try {
      const storageRef = ref(storage, firebasePath);
      const metadata = await getMetadata(storageRef);
      return metadata;
    } catch (error) {
      console.error('Metadata error:', error);
      throw error;
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}