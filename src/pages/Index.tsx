import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { ColorTradingGame } from '@/components/ColorTradingGame';

interface User {
  email: string;
  username: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('casino-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem('casino-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
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
