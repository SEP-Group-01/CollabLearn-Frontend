// Image upload utilities for the collaborative editor
export interface ImageMetadata {
  id: string;
  url: string;
  firebasePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  documentId: string;
  workspaceId: string;
  threadId: string;
  uploadedBy: string;
  uploadedAt: Date;
  position?: {
    x: number;
    y: number;
    index: number;
  };
}

export interface ImageUploadResult {
  success: boolean;
  imageMetadata?: ImageMetadata;
  error?: string;
}

export interface EditorImageData {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: string;
  position: number; // Position in document
}

// Firebase path structure for editor images
export const getImageFirebasePath = (
  workspaceId: string,
  threadId: string,
  documentId: string,
  imageId: string,
  fileName: string
): string => {
  return `workspaces/${workspaceId}/threads/${threadId}/editor/${documentId}/images/${imageId}/${fileName}`;
};

// Image validation utilities
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.'
    };
  }
  
  return { valid: true };
};

// Extract image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

// Generate unique image ID
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Convert File to base64 for preview
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Resize image while maintaining aspect ratio
export const resizeImage = (
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  const { width, height } = canvas;
  let newWidth = width;
  let newHeight = height;
  
  // Calculate new dimensions
  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newWidth * maxHeight) / newHeight;
  }
  
  return { width: Math.round(newWidth), height: Math.round(newHeight) };
};

// Extract images from clipboard
export const extractImagesFromClipboard = async (clipboardData: DataTransfer): Promise<File[]> => {
  const images: File[] = [];
  
  for (let i = 0; i < clipboardData.items.length; i++) {
    const item = clipboardData.items[i];
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        images.push(file);
      }
    }
  }
  
  return images;
};

// Create image element with metadata
export const createImageElement = (
  imageMetadata: ImageMetadata,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    className?: string;
    onContextMenu?: (e: MouseEvent, img: HTMLImageElement, metadata: ImageMetadata) => void;
  } = {}
): HTMLDivElement => {
  console.log('🎨 [ImageUtils] Creating enhanced image element for:', imageMetadata.originalName);
  console.log('🎨 [ImageUtils] Image URL:', imageMetadata.url);
  console.log('🎨 [ImageUtils] Options:', options);
  
  // Create wrapper div first
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-image-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.margin = '10px 0';
  
  // Create the image
  const img = document.createElement('img');
  img.src = imageMetadata.url;
  img.alt = imageMetadata.originalName;
  img.id = imageMetadata.id;
  img.dataset.documentId = imageMetadata.documentId;
  img.dataset.workspaceId = imageMetadata.workspaceId;
  img.dataset.threadId = imageMetadata.threadId;
  img.dataset.firebasePath = imageMetadata.firebasePath;
  
  // Set responsive styling with better defaults
  img.style.maxWidth = options.maxWidth ? `${options.maxWidth}px` : '100%';
  img.style.height = 'auto';
  img.style.margin = '0'; // Reset since wrapper handles margin
  img.style.cursor = 'pointer';
  img.style.borderRadius = '8px';
  img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
  img.style.border = '2px solid transparent';
  img.style.transition = 'all 0.2s ease';
  img.style.display = 'block';
  img.style.userSelect = 'none';
  
  // Make images resizable
  img.style.resize = 'both';
  img.style.overflow = 'hidden';
  img.style.minWidth = '100px';
  img.style.minHeight = '50px';
  
  if (options.maxHeight) {
    img.style.maxHeight = `${options.maxHeight}px`;
  }
  
  if (options.className) {
    img.className = options.className;
  }
  
  // Add data attributes for YJS tracking
  img.dataset.yjsImageId = imageMetadata.id;
  img.dataset.yjsImageUrl = imageMetadata.url;
  img.dataset.yjsImagePath = imageMetadata.firebasePath;
  
  // Add hover effects
  img.addEventListener('mouseenter', () => {
    img.style.borderColor = '#4caf50';
    img.style.transform = 'scale(1.02)';
  });
  
  img.addEventListener('mouseleave', () => {
    img.style.borderColor = 'transparent';
    img.style.transform = 'scale(1)';
  });
  
  // Add click handler for image preview/editing
  img.addEventListener('click', (e) => {
    e.preventDefault();
    openImageModal(imageMetadata);
  });

  // Add right-click context menu handler
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (options.onContextMenu) {
      options.onContextMenu(e, img, imageMetadata);
    }
  });
  
  // Add image to wrapper
  wrapper.appendChild(img);
  
  // Add resize handles to wrapper
  addResizeHandlesToWrapper(wrapper);
  
  return wrapper;
};

// Helper function to add resize handles to image wrapper
const addResizeHandlesToWrapper = (wrapper: HTMLDivElement) => {
  // Create resize handles
  const handles = ['nw', 'ne', 'sw', 'se'];
  handles.forEach(position => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${position}`;
    handle.style.position = 'absolute';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.backgroundColor = '#4caf50';
    handle.style.border = '2px solid white';
    handle.style.borderRadius = '50%';
    handle.style.cursor = `${position}-resize`;
    handle.style.zIndex = '10';
    handle.style.opacity = '0';
    handle.style.transition = 'opacity 0.2s ease';
    
    // Position handles
    switch (position) {
      case 'nw':
        handle.style.top = '-5px';
        handle.style.left = '-5px';
        break;
      case 'ne':
        handle.style.top = '-5px';
        handle.style.right = '-5px';
        break;
      case 'sw':
        handle.style.bottom = '-5px';
        handle.style.left = '-5px';
        break;
      case 'se':
        handle.style.bottom = '-5px';
        handle.style.right = '-5px';
        break;
    }
    
    wrapper.appendChild(handle);
  });
  
  // Show/hide handles on hover
  wrapper.addEventListener('mouseenter', () => {
    wrapper.querySelectorAll('.resize-handle').forEach(handle => {
      (handle as HTMLElement).style.opacity = '1';
    });
  });
  
  wrapper.addEventListener('mouseleave', () => {
    wrapper.querySelectorAll('.resize-handle').forEach(handle => {
      (handle as HTMLElement).style.opacity = '0';
    });
  });
};

// Helper function to open image modal for preview/editing
const openImageModal = (imageMetadata: ImageMetadata) => {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  overlay.style.zIndex = '10000';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.cursor = 'pointer';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.style.position = 'relative';
  modal.style.maxWidth = '90%';
  modal.style.maxHeight = '90%';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '12px';
  modal.style.padding = '20px';
  modal.style.cursor = 'default';
  
  // Create large image
  const img = document.createElement('img');
  img.src = imageMetadata.url;
  img.alt = imageMetadata.originalName;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '70vh';
  img.style.objectFit = 'contain';
  img.style.borderRadius = '8px';
  
  // Create info section
  const info = document.createElement('div');
  info.style.marginTop = '15px';
  info.style.fontSize = '14px';
  info.style.color = '#666';
  info.innerHTML = `
    <strong>${imageMetadata.originalName}</strong><br>
    Size: ${(imageMetadata.size / 1024).toFixed(1)} KB<br>
    ${imageMetadata.width && imageMetadata.height ? `Dimensions: ${imageMetadata.width} × ${imageMetadata.height}px` : ''}
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '15px';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'none';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#999';
  
  modal.appendChild(img);
  modal.appendChild(info);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  
  // Close handlers
  const closeModal = () => {
    document.body.removeChild(overlay);
  };
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  closeBtn.addEventListener('click', closeModal);
  
  // Prevent modal content clicks from closing modal
  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Add ESC key handler
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  
  document.addEventListener('keydown', handleEsc);
  document.body.appendChild(overlay);
};

// Parse image elements from HTML content
export const parseImagesFromContent = (htmlContent: string): EditorImageData[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = doc.querySelectorAll('img[data-yjs-image-id]');
  
  return Array.from(images).map((img, index) => ({
    id: img.getAttribute('data-yjs-image-id') || '',
    src: (img as HTMLImageElement).src,
    alt: (img as HTMLImageElement).alt,
    width: (img as HTMLImageElement).naturalWidth,
    height: (img as HTMLImageElement).naturalHeight,
    style: (img as HTMLImageElement).style.cssText,
    position: index
  }));
};

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Image upload configuration
export interface ImageUploadConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  compressLarge?: boolean;
  generateThumbnail?: boolean;
  onProgress?: UploadProgressCallback;
}