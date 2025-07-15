import React, { useState, useRef } from 'react';
import { Upload, Image, Mic, Video, File, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface MediaUploaderProps {
  onUpload: (url: string, type: 'image' | 'audio' | 'video') => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'image' | 'audio' | 'video') => {
    if (!file) return;

    setUploading(true);
    try {
      // In a real app, you would upload to a service like Supabase Storage
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file);
      onUpload(url, type);
      toast.success(`${type} uploaded successfully`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      if (file.type.startsWith('image/')) {
        handleFileUpload(file, 'image');
      } else if (file.type.startsWith('audio/')) {
        handleFileUpload(file, 'audio');
      } else if (file.type.startsWith('video/')) {
        handleFileUpload(file, 'video');
      } else {
        toast.error('Unsupported file type');
      }
    }
  };

  const uploadOptions = [
    {
      type: 'image' as const,
      label: 'Image',
      icon: Image,
      accept: 'image/*',
      ref: fileInputRef,
      color: 'text-green-600 bg-green-50 hover:bg-green-100',
    },
    {
      type: 'audio' as const,
      label: 'Audio',
      icon: Mic,
      accept: 'audio/*',
      ref: audioInputRef,
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    },
    {
      type: 'video' as const,
      label: 'Video',
      icon: Video,
      accept: 'video/*',
      ref: videoInputRef,
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Upload className="w-4 h-4" />
        Media
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Media
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports images, audio, and video files
                </p>
              </div>

              {/* Upload Options */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {uploadOptions.map(option => (
                  <div key={option.type}>
                    <input
                      ref={option.ref}
                      type="file"
                      accept={option.accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, option.type);
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => option.ref.current?.click()}
                      disabled={uploading}
                      className={`w-full p-4 rounded-lg transition-colors ${option.color} disabled:opacity-50`}
                    >
                      <option.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  </div>
                ))}
              </div>

              {uploading && (
                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                  <Loader className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Uploading...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUploader;