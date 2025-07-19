import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { ColorTradingGame } from '@/components/ColorTradingGame';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  username: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User'
        };
        setUser(userData);
        localStorage.setItem('casino-user', JSON.stringify(userData));
      } else {
        // Fallback to localStorage if no Supabase session
        const savedUser = localStorage.getItem('casino-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Add a mock ID if it doesn't exist
          if (!userData.id) {
            userData.id = 'mock-' + Date.now();
          }
          setUser(userData);
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User'
        };
        setUser(userData);
        localStorage.setItem('casino-user', JSON.stringify(userData));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('casino-user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (userData: User) => {
    // Add a mock ID if it doesn't exist (for localStorage auth)
    if (!userData.id) {
      userData.id = 'mock-' + Date.now();
    }
    setUser(userData);
    localStorage.setItem('casino-user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    // Sign out from Supabase if session exists
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('casino-user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Color Splash Casino...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <ColorTradingGame user={user} onLogout={handleLogout} />;
};

export default Index;
