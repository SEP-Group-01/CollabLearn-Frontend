export interface Workspace {
  id: string;
  title: string;
  image_url: string;
  description: string;
  members_count: number; // Changed from member_count to match backend
  join_policy: 'Anyone' | 'Requests' | 'Invites'; // Changed to match backend capitalization
  admin_ids: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  role: 'member' | 'admin' | 'requested' | 'invited' | 'user';
}

// Legacy interface for backward compatibility (if needed)
export interface WorkspaceLegacy {
  id: number;
  title: string;
  category: string;
  requiresApproval: boolean;
  isMember: boolean;
  isPending: boolean;
  image: string;
  lightColor: string;
  darkColor: string;
  members: number;
  studyHours: number;
  description: string;
  isAdmin: boolean;
}

export interface WorkspaceFormData {
  title: string;
  description: string;
  tags: string[];
  image: File | null;
  joinPolicy: 'anyone' | 'requests' | 'invites';
}

export interface Thread {
  id: string;
  workspace_id: string;
  title?: string; // Optional since backend doesn't always include it
  description: string;
  created_at: string;
  updated_at: string;
  subscriber_count: number;
  resource_count: number;
}

// Legacy thread interface for backward compatibility
export interface ThreadLegacy {
  id: number;
  title: string;
  description: string;
  resources: number;
  sessions: number;
  enrolled: boolean;
}

export interface JoinedWorkspace extends Workspace {
  joinedAt: string;
}

export interface Invite {
  id: string;
  workspace_id: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
  updated_at: string;
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  existsInOrganization: boolean;
  isWorkspaceMember: boolean;
  canInvite: boolean;
  warning?: string;
}

export interface EmailWithStatus {
  email: string;
  validation?: EmailValidationResult;
}

export interface InviteMembersModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceTitle: string;
}