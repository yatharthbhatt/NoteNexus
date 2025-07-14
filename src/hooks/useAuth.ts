import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        toast.success('Welcome back!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await auth.signUp(email, password);
      if (error) throw error;
      toast.success('Check your email for verification link');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await auth.signIn(email, password);
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};