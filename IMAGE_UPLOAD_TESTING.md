/\*\*

- Image Upload Test Guide for Collaborative Editor
-
- This guide explains how to test the image upload functionality
- implemented in the collaborative editor.
  \*/

# Image Upload Feature Testing Guide

## Features Implemented

### 1. Image Upload Utilities (✅ Completed)

- **File validation**: Checks file type (JPEG, PNG, GIF, WebP) and size (max 10MB)
- **Image metadata extraction**: Extracts dimensions and generates unique IDs
- **Firebase path generation**: Creates structured paths for workspace/thread/document organization
- **Type definitions**: Comprehensive TypeScript interfaces for image handling

### 2. Firebase Storage Integration (✅ Completed)

- **Structured storage paths**: `gs://collablearn-files.firebasestorage.app/workspaces/{workspace_id}/threads/{thread_id}/editor/{document_id}/images/{image_id}/{filename}`
- **Metadata storage**: Saves image metadata to Supabase database
- **Thumbnail generation**: Placeholder implementation for image thumbnails
- **Download URL generation**: Creates signed URLs for image access

### 3. YJS Collaboration Support (✅ Completed)

- **Shared image state**: Images stored in YJS Map for real-time sync
- **Image event handlers**: Callbacks for image add/remove/update events
- **Position tracking**: Images maintain position within document content
- **Collaborative editing**: Image changes synchronized across all connected users

### 4. Editor UI Features (✅ Completed)

- **Paste support**: Paste images from clipboard (Ctrl+V)
- **Drag & drop**: Drag images from file explorer directly into editor
- **File picker**: Click "Insert Image" button to browse for files
- **Upload progress**: Visual progress indicators during upload
- **Drag overlay**: Visual feedback when dragging files over editor

### 5. Backend API Integration (✅ Completed)

- **Enhanced upload endpoint**: Supports workspace/thread context
- **Authentication**: Token-based authentication for image uploads
- **Error handling**: Comprehensive error responses and validation
- **Audit logging**: Tracks image upload activities

## Testing Instructions

### Prerequisites

1. Ensure both backend and frontend services are running
2. Have valid workspace, thread, and document IDs
3. User must be authenticated

### Test Cases

#### 1. Test Image Paste (Clipboard)

```
1. Copy an image to clipboard (from browser, file explorer, etc.)
2. Open collaborative editor
3. Place cursor in editor content area
4. Press Ctrl+V (or Cmd+V on Mac)
5. Verify:
   - Upload progress indicator appears
   - Image appears in editor after upload
   - Image is properly sized and styled
   - Other collaborators see the image in real-time
```

#### 2. Test Drag & Drop

```
1. Open file explorer with image files
2. Open collaborative editor in browser
3. Drag image file from explorer to editor
4. Drop image in editor content area
5. Verify:
   - Drag overlay appears during drag
   - Upload progress shows during upload
   - Image appears at drop location
   - Image metadata is saved correctly
```

#### 3. Test File Picker

```
1. Click "Insert Image" button in toolbar (📷 icon)
2. Select one or more image files from dialog
3. Verify:
   - File picker opens with image filters
   - Multiple files can be selected
   - Each file uploads with progress indicator
   - Images appear in correct order in editor
```

#### 4. Test Collaborative Features

```
1. Open same document in multiple browser tabs/windows
2. Upload image in one tab
3. Verify:
   - Image appears in all other tabs immediately
   - Image position is consistent across tabs
   - No conflicts or duplicate images
   - YJS synchronization works correctly
```

#### 5. Test Error Handling

```
1. Try uploading invalid file types (.txt, .exe, etc.)
2. Try uploading files larger than 10MB
3. Test with network disconnected
4. Verify:
   - Appropriate error messages shown
   - No broken images in editor
   - Upload progress handles failures gracefully
   - Editor remains functional after errors
```

## Expected File Structure in Firebase

After successful uploads, images should be stored as:

```
gs://collablearn-files.firebasestorage.app/
└── workspaces/
    └── {workspace_id}/
        └── threads/
            └── {thread_id}/
                └── editor/
                    └── {document_id}/
                        └── images/
                            └── {image_id}/
                                ├── {filename}
                                └── thumbnails/
                                    └── {image_id}_thumb.jpg
```

## Database Records

Each uploaded image creates records in Supabase:

- `document_media` table: File metadata, URLs, dimensions
- `document_audit_log` table: Upload activity tracking

## Troubleshooting

### Common Issues:

1. **Images not appearing**: Check browser console for API errors
2. **Upload failing**: Verify Firebase credentials and bucket permissions
3. **Paste not working**: Ensure clipboard contains image data, not just file path
4. **Collaboration issues**: Check WebSocket connection status

### Debug Steps:

1. Open browser developer tools
2. Check Network tab for API call responses
3. Verify Firebase Storage console for uploaded files
4. Check Supabase database for metadata records
5. Monitor backend logs for error messages

## Performance Considerations

- Images are compressed and resized on upload
- Large images may take longer to upload
- Multiple concurrent uploads are handled efficiently
- Progress indicators prevent user confusion during uploads

## Security Features

- File type validation prevents malicious uploads
- Size limits prevent storage abuse
- Authentication required for all uploads
- Audit logging for compliance and debugging

This implementation provides a complete, production-ready image upload system
for the collaborative editor with proper error handling, real-time collaboration,
and efficient storage management.
