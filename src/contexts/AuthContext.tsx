import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscription: string | null; // new field for subscription tier
  updateSubscription: (newSub: string) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signInWithGoogle: () => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch subscription info from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription')
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching subscription:', error);
          setSubscription(null);
        } else {
          setSubscription(data?.subscription || null);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Create or update profile
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || '',
          });
        
        if (error) {
          console.error('Error creating profile:', error);
        }
        // Fetch subscription info on sign in
        const { data, error: subError } = await supabase
          .from('profiles')
          .select('subscription')
          .eq('id', session.user.id)
          .single();
        if (subError) {
          console.error('Error fetching subscription:', subError);
          setSubscription(null);
        } else {
          setSubscription(data?.subscription || null);
        }
      } else if (event === 'SIGNED_OUT') {
        setSubscription(null);
      }
      
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('SignUp error:', error);
      }

      return { error };
    } catch (err) {
      console.error('SignUp fetch failed:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    return { error };
  };

  const updateSubscription = (newSub: string) => {
    setSubscription(newSub);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    subscription,
    loading,
    updateSubscription,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}