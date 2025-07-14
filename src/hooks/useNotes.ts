import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Note, Label, Workspace, AppState, NoteVersion } from '../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

const defaultColors = [
  '#ffffff', '#f8fafc', '#fef3c7', '#fecaca', '#fed7d7', 
  '#e0e7ff', '#ddd6fe', '#f3e8ff', '#ecfdf5', '#fdf4ff'
];

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [state, setState] = useState<AppState>({
    notes: [],
    labels: [],
    workspaces: [],
    searchQuery: '',
    selectedLabels: [],
    currentView: 'notes',
    currentWorkspace: null,
    selectedNoteId: null,
    isCreatingNote: false,
    user: null,
    isAuthenticated: false,
  });

  // Fetch notes
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes', user?.id, state.currentWorkspace],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('notes')
        .select(`
          *,
          note_labels(label_id),
          collaborators(*),
          comments(*)
        `)
        .eq('user_id', user.id)
        .order('position', { ascending: false });

      if (state.currentWorkspace) {
        query = query.eq('workspace_id', state.currentWorkspace);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(note => ({
        ...note,
        labels: note.note_labels?.map((nl: any) => nl.label_id) || [],
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        reminderDate: note.reminder_date ? new Date(note.reminder_date) : undefined,
        isPinned: note.is_pinned,
        isArchived: note.is_archived,
        isTrashed: note.is_trashed,
        isEncrypted: note.is_encrypted,
        workspaceId: note.workspace_id,
        userId: note.user_id,
      })) as Note[];
    },
    enabled: !!user,
  });

  // Fetch labels
  const { data: labels = [] } = useQuery({
    queryKey: ['labels', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map(label => ({
        ...label,
        createdAt: new Date(label.created_at),
        userId: label.user_id,
      })) as Label[];
    },
    enabled: !!user,
  });

  // Fetch workspaces
  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      
      return data.map(workspace => ({
        ...workspace,
        createdAt: new Date(workspace.created_at),
        userId: workspace.user_id,
        isDefault: workspace.is_default,
      })) as Workspace[];
    },
    enabled: !!user,
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: Partial<Note>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: noteData.title || '',
          content: noteData.content || '',
          type: noteData.type || 'text',
          color: noteData.color || defaultColors[0],
          is_pinned: false,
          is_archived: false,
          is_trashed: false,
          is_encrypted: false,
          workspace_id: state.currentWorkspace,
          user_id: user.id,
          reminder_date: noteData.reminderDate?.toISOString(),
          image_url: noteData.imageUrl,
          audio_url: noteData.audioUrl,
          video_url: noteData.videoUrl,
          checklist_items: noteData.checklistItems || [],
          position: Date.now(),
          version: 1,
        })
        .select()
        .single();

      if (error) throw error;
