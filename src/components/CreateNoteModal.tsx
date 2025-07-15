import React, { useState } from 'react';
import { X, Type, CheckSquare, Image, Palette, Tag, Sparkles } from 'lucide-react';
import { Note, Label, ChecklistItem } from '../types';
import AIAssistant from './AIAssistant';
import ReminderManager from './ReminderManager';
import MediaUploader from './MediaUploader';
import { motion } from 'framer-motion';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (note: Partial<Note>) => void;
  labels: Label[];
  defaultColors: string[];
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  labels,
  defaultColors,
}) => {
  const [noteType, setNoteType] = useState<'text' | 'checklist' | 'image' | 'audio' | 'video'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(defaultColors[0]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [reminder, setReminder] = useState<Date | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return;

    const noteData: Partial<Note> = {
      title,
      content,
      type: noteType,
      color,
      labels: selectedLabels,
      checklistItems: noteType === 'checklist' ? checklistItems : undefined,
      imageUrl: noteType === 'image' ? mediaUrl : undefined,
      audioUrl: noteType === 'audio' ? mediaUrl : undefined,
      videoUrl: noteType === 'video' ? mediaUrl : undefined,
      reminderDate: reminder,
      isEncrypted,
    };

    onCreate(noteData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor(defaultColors[0]);
    setSelectedLabels([]);
    setChecklistItems([]);
    setMediaUrl('');
    setReminder(null);
    setIsEncrypted(false);
    setNoteType('text');
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      completed: false,
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklistItems(items =>
      items.map(item => item.id === id ? { ...item, text } : item)
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems(items => items.filter(item => item.id !== id));
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const handleAISuggestion = (suggestion: any) => {
    switch (suggestion.type) {
      case 'content':
        setContent(prev => prev + '\n\n' + suggestion.content);
        break;
      case 'tag':
        // Find or create label for the tag
        const existingLabel = labels.find(l => l.name.toLowerCase() === suggestion.data.toLowerCase());
        if (existingLabel && !selectedLabels.includes(existingLabel.id)) {
          setSelectedLabels(prev => [...prev, existingLabel.id]);
        }
        break;
      case 'todo':
        if (noteType !== 'checklist') {
          setNoteType('checklist');
        }
        const newTodo: ChecklistItem = {
          id: Date.now().toString(),
          text: suggestion.data,
          completed: false,
        };
        setChecklistItems(prev => [...prev, newTodo]);
        break;
    }
  };

  const handleMediaUpload = (url: string, type: 'image' | 'audio' | 'video') => {
    setMediaUrl(url);
    setNoteType(type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
            <div className="flex items-center gap-2">
              <AIAssistant 
                noteContent={content} 
                onSuggestionApply={handleAISuggestion}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {[
              { type: 'text', icon: Type, label: 'Text' },
              { type: 'checklist', icon: CheckSquare, label: 'Checklist' },
              { type: 'image', icon: Image, label: 'Image' },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setNoteType(type as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  noteType === type ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-medium border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
            />
          </div>

          {noteType === 'text' && (
            <div>
              <textarea
                placeholder="Take a note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          )}

          {noteType === 'checklist' && (
            <div className="space-y-2">
              {checklistItems.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="List item..."
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => removeChecklistItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addChecklistItem}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add item
              </button>
            </div>
          )}

          {(noteType === 'image' || noteType === 'audio' || noteType === 'video') && (
            <div>
              {mediaUrl ? (
                <div className="relative">
                  {noteType === 'image' && (
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  {noteType === 'audio' && (
                    <audio controls className="w-full">
                      <source src={mediaUrl} />
                    </audio>
                  )}
                  {noteType === 'video' && (
                    <video controls className="w-full h-48 rounded-lg">
                      <source src={mediaUrl} />
                    </video>
                  )}
                  <button
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No {noteType} selected</p>
                  <MediaUploader onUpload={handleMediaUpload} />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </h3>
              <div className="flex gap-2 flex-wrap">
                {defaultColors.map(colorOption => (
                  <button
                    key={colorOption}
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      color === colorOption ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>

            {/* Labels */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Labels
              </h3>
              <div className="flex gap-2 flex-wrap">
                {labels.map(label => (
                  <button
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedLabels.includes(label.id)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ReminderManager 
                  reminder={reminder}
                  onSetReminder={setReminder}
                />
                <MediaUploader onUpload={handleMediaUpload} />
              </div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={(e) => setIsEncrypted(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Encrypt note</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Note
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateNoteModal;