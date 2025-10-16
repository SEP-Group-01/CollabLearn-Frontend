// Shared types for collaborative editing

export interface CollaborationUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isActive: boolean;
  cursor?: {
    anchor: number;
    head: number;
  };
}

export interface DocumentVersion {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  label?: string;
}

export interface DocumentPermission {
  userId: string;
  documentId: string;
  permission: 'read' | 'write' | 'admin';
  grantedBy: string;
  grantedAt: Date;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  userId: string;
  action: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
}

export interface MediaUploadResult {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  documentId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';
export type CollaborationType = 'yjs' | 'websocket' | 'none';
export type UserPermission = 'read' | 'write' | 'admin';
export type ExportFormat = 'pdf' | 'docx' | 'html';
export type MediaType = 'image' | 'video' | 'file';