import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import NoteGrid from './components/NoteGrid';
import CreateNoteModal from './components/CreateNoteModal';
import FloatingActionButton from './components/FloatingActionButton';
import AuthModal from './components/AuthModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const {
    state,
    setState,
    notes,
    labels,
    workspaces,
    loading,
    createNote,
    updateNote,
    deleteNote,
    createLabel,
    createWorkspace,
    defaultColors,
  } = useNotes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

const handleCreateNote = (noteData: any) => {
  createNote(noteData, {
    onSuccess: () => {
      setShowCreateModal(false);
    }
  });
};

  const togglePin = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { isPinned: !note.isPinned });
    }
  };

  const toggleArchive = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { 
        isArchived: !note.isArchived,
        isPinned: false,
        isTrashed: false,
      });
    }
  };

  const toggleTrash = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { 
        isTrashed: !note.isTrashed,
        isPinned: false,
        isArchived: false,
      });
    }
  };

  const getViewTitle = () => {
    switch (state.currentView) {
      case 'notes':
        return 'Notes';
      case 'archive':
        return 'Archive';
      case 'trash':
        return 'Trash';
      case 'reminders':
        return 'Reminders';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Notes';
    }
  };

  const getCurrentWorkspaceName = () => {
    if (!state.currentWorkspace) return null;
    const workspace = workspaces.find(w => w.id === state.currentWorkspace);
    return workspace?.name;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NoteNexus...</p>
        </div>
      </div>
    );
  }