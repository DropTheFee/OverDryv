import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getSubdomain } from '../utils/subdomain';
import type { Database } from '../types/database';

type Organization = Database['public']['Tables']['organizations']['Row'];

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'technician' | 'master_admin';
  organization_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  organization: Organization | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for session tokens in URL (from cross-subdomain redirect)
    const restoreSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    restoreSession();
    
    // Load organization by subdomain first
    const loadOrganization = async () => {
      const subdomain = getSubdomain();
      if (subdomain) {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('subdomain', subdomain)
            .single();
          
          if (!error && data) {
            setOrganization(data);
          } else {
            console.error('Organization not found for subdomain:', subdomain);
          }
        } catch (error) {
          console.error('Error loading organization:', error);
        }
      }
    };
    
    loadOrganization();
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        // If profile doesn't exist, create a default admin profile for demo
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          const defaultProfile = {
            id: userId,
            email: session?.user?.email || '',
            first_name: 'Demo',
            last_name: 'User',
            role: 'admin' as const,
          };
          setProfile(defaultProfile);
        }
        return;
      }
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('signIn response - error:', error, 'user:', !!data?.user);

      if (!error && data.user) {
        await fetchProfile(data.user.id);
        
        // Redirect to subdomain if on root domain
        const subdomain = getSubdomain();
        if (!subdomain) {
          console.log('On root domain, looking up user org...');
          const { data: membership } = await supabase
            .from('organization_members')
            .select('organizations(subdomain)')
            .eq('user_id', data.user.id)
            .single();
          
          if (membership?.organizations?.subdomain) {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            const refreshToken = sessionData.session?.refresh_token;
            const targetUrl = `https://${membership.organizations.subdomain}.overdryv.app/dashboard?access_token=${accessToken}&refresh_token=${refreshToken}`;
            console.log('Redirecting to:', targetUrl);
            window.location.href = targetUrl;
            return { error: null };
          }
        }
        
        navigate('/dashboard');
        return { error: null };
      }

      return { error };
    } catch (err) {
      console.error('signIn exception:', err);
      return { error: err };
    }
  };


  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
        }
      }
    });

    if (!error && data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role || 'customer',
        });
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { error: profileError };
      }
      
      // Fetch the created profile
      await fetchProfile(data.user.id);
      return { error: null };
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    profile,
    organization,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};