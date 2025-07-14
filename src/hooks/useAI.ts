import { useState } from 'react';
import { AIResponse } from '../types';
import toast from 'react-hot-toast';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const analyzeNote = async (content: string): Promise<AIResponse> => {
    if (!OPENAI_API_KEY) {
      toast.error('AI features require OpenAI API key');
      throw new Error('OpenAI API key not configured');
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that helps analyze notes. For the given note content, provide:
              1. A brief summary (max 100 words)
              2. Suggested tags/labels (max 5)
              3. Action items/todos if any (max 5)
              4. Productivity suggestions (max 3)
              
              Respond in JSON format with keys: summary, tags, todos, suggestions`
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze note');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        summary: result.summary,
        tags: result.tags || [],
        todos: result.todos || [],
        suggestions: result.suggestions || [],
      };
    } catch (error: any) {
      toast.error('Failed to analyze note with AI');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (prompt: string): Promise<string> => {
    if (!OPENAI_API_KEY) {
      toast.error('AI features require OpenAI API key');
      throw new Error('OpenAI API key not configured');
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that generates content for notes based on user prompts.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      toast.error('Failed to generate content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeNote,
    generateContent,
    loading,
  };
};