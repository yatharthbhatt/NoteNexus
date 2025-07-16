import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, RotateCcw, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NoteVersion } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  noteId: string;
  onRestore: (version: NoteVersion) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ noteId, onRestore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['note-versions', noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('note_versions')
        .select('*')
        .eq('note_id', noteId)
        .order('version', { ascending: false });

      if (error) throw error;

      return data.map(version => ({
        ...version,
        createdAt: new Date(version.created_at),
        noteId: version.note_id,
        userId: version.user_id,
      })) as NoteVersion[];
    },
    enabled: isOpen,
  });

  const handleRestore = (version: NoteVersion) => {
    onRestore(version);
    setIsOpen(false);
    setSelectedVersion(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <History className="w-4 h-4" />
        Version History
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Version History
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading versions...
                </div>
              ) : versions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No version history available
                </div>
              ) : (
                <div className="p-2">
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Version {version.version}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {version.title || 'Untitled'}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedVersion(version)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </button>
                        {index > 0 && (
                          <button
                            onClick={() => handleRestore(version)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version Preview Modal */}
      <AnimatePresence>
        {selectedVersion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Version {selectedVersion.version} Preview
                  </h3>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDistanceToNow(selectedVersion.createdAt, { addSuffix: true })}
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-96">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedVersion.title || 'Untitled'}
                </h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedVersion.content}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => handleRestore(selectedVersion)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore This Version
                </button>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionHistory;