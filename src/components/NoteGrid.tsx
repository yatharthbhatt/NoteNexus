import React from 'react';
import { Note, Label } from '../types';
import NoteCard from './NoteCard';

interface NoteGridProps {
  notes: Note[];
  labels: Label[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleTrash: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

const NoteGrid: React.FC<NoteGridProps> = ({
  notes,
  labels,
  onUpdateNote,
  onTogglePin,
  onToggleArchive,
  onToggleTrash,
  onDeleteNote,
}) => {
  const pinnedNotes = notes.filter(note => note.isPinned);
  const regularNotes = notes.filter(note => !note.isPinned);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium mb-2">No notes yet</h3>
        <p className="text-gray-400">Click the + button to create your first note</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            📌 Pinned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {pinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                labels={labels}
                onUpdate={onUpdateNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onToggleTrash={onToggleTrash}
                onDelete={onDeleteNote}
              />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              Others
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {regularNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                labels={labels}
                onUpdate={onUpdateNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onToggleTrash={onToggleTrash}
                onDelete={onDeleteNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteGrid;