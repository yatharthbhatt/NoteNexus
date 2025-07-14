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
    if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to NoteNexus
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your advanced note-taking platform with AI-powered features, 
              real-time collaboration, and enterprise-grade security.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Let's Get Started
            </button>
            <p className="text-sm text-gray-500">
              Sign up for free and start organizing your Ideas 
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🤖</div>
              <div>AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div>Real-time Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div>End-to-end Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div>Analytics Dashboard</div>
            </div>
          </div>
        </motion.div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
}
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        state={state}
        setState={setState}
        labels={labels}
        onAddLabel={() => {
          const name = prompt('Label name:');
          if (name) {
            createLabel({ name, color: '#3B82F6' });
          }
        }}
      />

      <div className="flex-1 flex flex-col">
        <SearchBar state={state} setState={setState} />
        
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h1>
                {getCurrentWorkspaceName() && (
                  <p className="text-sm text-gray-600 mt-1">
                    in {getCurrentWorkspaceName()}
                  </p>
                )}
                {state.searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Search results for "{state.searchQuery}"
                  </p>
                )}
              </div>
              
              {state.currentView === 'notes' && (
                <div className="text-sm text-gray-500">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {state.currentView === 'analytics' ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AnalyticsDashboard />
              </motion.div>
            ) : (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <NoteGrid
                  notes={notes}
                  labels={labels}
                  onUpdateNote={updateNote}
                  onTogglePin={togglePin}
                  onToggleArchive={toggleArchive}
                  onToggleTrash={toggleTrash}
                  onDeleteNote={deleteNote}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {state.currentView === 'notes' && (
          <FloatingActionButton onClick={() => setShowCreateModal(true)} />
        )}

        <CreateNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNote}
          labels={labels}
          defaultColors={defaultColors}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
