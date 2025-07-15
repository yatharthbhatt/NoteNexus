export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'checklist' | 'image' | 'audio' | 'video';
  color: string;
  labels: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  isEncrypted: boolean;
  workspaceId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  reminderDate?: Date;
  checklistItems?: ChecklistItem[];
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  position: number;
  version: number;
  collaborators?: Collaborator[];
  comments?: Comment[];
}

export interface NoteVersion {
  id: string;
  noteId: string;
  title: string;
  content: string;
  version: number;
  createdAt: Date;
  userId: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: Date;
  isDefault: boolean;
}

export interface Collaborator {
  id: string;
  noteId: string;
  userId: string;
  email: string;
  permission: 'view' | 'edit' | 'admin';
  createdAt: Date;
}

export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  content: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  notes: Note[];
  labels: Label[];
  workspaces: Workspace[];
  searchQuery: string;
  selectedLabels: string[];
  currentView: 'notes' | 'archive' | 'trash' | 'reminders' | 'analytics';
  currentWorkspace: string | null;
  selectedNoteId: string | null;
  isCreatingNote: boolean;
  user: any;
  isAuthenticated: boolean;
}

export interface AIResponse {
  summary?: string;
  suggestions?: string[];
  tags?: string[];
  todos?: string[];
}

export interface AnalyticsData {
  totalNotes: number;
  notesThisWeek: number;
  mostUsedLabels: { name: string; count: number }[];
  activityHeatmap: { date: string; count: number }[];
  noteTypes: { type: string; count: number }[];
}