export interface Workspace {
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

export interface Thread {
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