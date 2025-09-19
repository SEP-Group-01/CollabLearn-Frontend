export interface CollaborativeUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isActive: boolean;
  cursor?: {
    position: number;
    selection: { start: number; end: number };
  };
}

export interface DocumentData {
  id: string;
  title: string;
  lastEdited: string;
  preview: string;
  isActive: boolean;
}

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  length?: number;
  text?: string;
  position: number;
  userId: string;
  timestamp: number;
}