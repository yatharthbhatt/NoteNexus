import React, { useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const WorkspaceManager: React.FC = () => {
  const { workspaces, createWorkspace, state, setState } = useNotes();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    try {
      await createWorkspace(newWorkspace);
      setNewWorkspace({ name: '', description: '', color: '#3B82F6' });
      setShowCreateModal(false);
    } catch {
      // handled in useNotes hook
    }
  };

  const switchWorkspace = (workspaceId: string | null) => {
    if(state.currentWorkspace !== workspaceId) {
      setState(prev => ({ ...prev, currentWorkspace: workspaceId }));
      toast.success(workspaceId ? 'Workspace switched' : 'Switched to all notes');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Workspaces
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => switchWorkspace(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            state.currentWorkspace === null
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="flex-1 text-left text-sm">All Notes</span>
        </button>

        {workspaces.map(ws => (
          <motion.button
            key={ws.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => switchWorkspace(ws.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              state.currentWorkspace === ws.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ws.color }}
            />
            <span className="flex-1 text-left text-sm">{ws.name}</span>
            {ws.isDefault && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Default
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Workspace</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Organize your notes into separate workspaces
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Work, Personal, Projects"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={3}
                    placeholder="Brief description of this workspace"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewWorkspace(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          newWorkspace.color === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center gap-3">
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Workspace
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceManager;