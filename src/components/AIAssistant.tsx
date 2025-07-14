import React, { useState } from 'react';
import { Bot, Sparkles, Lightbulb, CheckSquare, Tag, Loader } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  noteContent: string;
  onSuggestionApply: (suggestion: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ noteContent, onSuggestionApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const { analyzeNote, generateContent, loading } = useAI();

  const handleAnalyze = async () => {
    if (!noteContent.trim()) {
      toast.error('Please add some content to analyze');
      return;
    }

    try {
      const result = await analyzeNote(noteContent);
      setAnalysis(result);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      const content = await generateContent(prompt);
      onSuggestionApply({ type: 'content', content });
      setPrompt('');
      toast.success('Content generated and applied');
    } catch (error) {
      // Error handled in hook
    }
  };

  const applySuggestion = (type: string, data: any) => {
    onSuggestionApply({ type, data });
    toast.success(`${type} applied successfully`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Bot className="w-4 h-4" />
        AI Assistant
        <Sparkles className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                AI Assistant
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Get insights and suggestions for your note
              </p>
            </div>

            <div className="p-4 space-y-4">
