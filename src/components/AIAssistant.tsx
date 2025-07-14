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
                            {/* Analyze Note */}
              <div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !noteContent.trim()}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  Analyze This Note
                </button>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {analysis.summary && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{analysis.summary}</p>
                    </div>
                  )}

                  {analysis.tags && analysis.tags.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Suggested Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.tags.map((tag: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => applySuggestion('tag', tag)}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.todos && analysis.todos.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Action Items
                      </h4>
                      <div className="space-y-1">
                        {analysis.todos.map((todo: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => applySuggestion('todo', todo)}
                            className="block w-full text-left px-2 py-1 text-sm text-yellow-700 hover:bg-yellow-100 rounded transition-colors"
                          >
                            • {todo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                      <div className="space-y-1">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <p key={index} className="text-sm text-purple-700">
                            • {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Content Generation */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Generate Content</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
