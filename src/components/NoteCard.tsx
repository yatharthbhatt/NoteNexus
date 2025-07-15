import React, { useState } from 'react';
import { 
  Pin, 
  Archive, 
  Trash2, 
  MoreVertical, 
  Edit, 
  Copy, 
  Share,
  CheckSquare,
  Square,
  Bell,
  Lock,
  Users,
  History,
  Sparkles
} from 'lucide-react';
import { Note, Label, ChecklistItem, NoteVersion } from '../types';
import VersionHistory from './VersionHistory';
import AIAssistant from './AIAssistant';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  labels: Label[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleTrash: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  labels,
  onUpdate,
  onTogglePin,
  onToggleArchive,
  onToggleTrash,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    onUpdate(note.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleChecklistToggle = (itemId: string) => {
    const updatedItems = note.checklistItems?.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate(note.id, { checklistItems: updatedItems });
  };

  const handleVersionRestore = (version: NoteVersion) => {
    onUpdate(note.id, { 
      title: version.title, 
      content: version.content 
    });
  };

  const handleAISuggestion = (suggestion: any) => {
    // Handle AI suggestions for existing notes
    switch (suggestion.type) {
      case 'content':
        onUpdate(note.id, { 
          content: note.content + '\n\n' + suggestion.content 
        });
        break;
    }
  };

  const noteLabels = labels.filter(label => note.labels.includes(label.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all group relative ${
        note.isPinned ? 'ring-2 ring-blue-200' : ''
      }`}
      style={{ backgroundColor: note.color }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-lg font-semibold text-gray-900"
              placeholder="Note title..."
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {note.title || 'Untitled'}
            </h3>
          )}
          
          {/* Note metadata */}
          <div className="flex items-center gap-2 mt-1">
            {note.isEncrypted && (
              <Lock className="w-3 h-3 text-gray-500" />
            )}
            {note.collaborators && note.collaborators.length > 0 && (
              <Users className="w-3 h-3 text-gray-500" />
            )}
            {note.version > 1 && (
              <span className="text-xs text-gray-500">v{note.version}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-2 rounded-lg transition-colors ${
              note.isPinned 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <VersionHistory 
                  noteId={note.id}
                  onRestore={handleVersionRestore}
                />
                <button
                  onClick={() => {
                    onToggleArchive(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  onClick={() => {
                    onToggleTrash(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {note.isTrashed ? 'Restore' : 'Delete'}
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        {note.type === 'text' && (
          isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-700 resize-none"
              rows={4}
              placeholder="Take a note..."
            />
          ) : (
            <p className="text-gray-700 line-clamp-6 whitespace-pre-wrap">
              {note.content}
            </p>
          )
        )}

        {note.type === 'checklist' && note.checklistItems && (
          <div className="space-y-2">
            {note.checklistItems.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleChecklistToggle(item.id)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-green-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </div>
            ))}
            {note.checklistItems.length > 5 && (
              <p className="text-xs text-gray-500">
                +{note.checklistItems.length - 5} more items
              </p>
            )}
          </div>
        )}

        {note.type === 'image' && note.imageUrl && (
          <img
            src={note.imageUrl}
            alt="Note"
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {note.type === 'audio' && note.audioUrl && (
          <audio controls className="w-full">
            <source src={note.audioUrl} />
          </audio>
        )}

        {note.type === 'video' && note.videoUrl && (
          <video controls className="w-full h-32 rounded-lg">
            <source src={note.videoUrl} />
          </video>
        )}
      </div>

      {/* Labels */}
      {noteLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {noteLabels.map(label => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white bg-opacity-70 rounded-full text-xs font-medium text-gray-700"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>
            {format(note.updatedAt, 'MMM d, yyyy')}
          </span>
          {note.reminderDate && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Bell className="w-3 h-3" />
              <span>{format(note.reminderDate, 'MMM d')}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIAssistant 
            noteContent={note.content}
            onSuggestionApply={handleAISuggestion}
          />
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NoteCard;