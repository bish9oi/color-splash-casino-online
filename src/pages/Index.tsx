import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { ColorTradingGame } from '@/components/ColorTradingGame';

interface User {
  id: string;
  email: string;
  username: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('casino-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Add a mock ID if it doesn't exist
      if (!userData.id) {
        userData.id = 'mock-' + Date.now();
      }
      return userData;
    }
    return null;
  });

  const handleAuth = (userData: User) => {
    // Add a mock ID if it doesn't exist (for localStorage auth)
    if (!userData.id) {
      userData.id = 'mock-' + Date.now();
    }
    setUser(userData);
    localStorage.setItem('casino-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('casino-user');
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <ColorTradingGame user={user} onLogout={handleLogout} />;
};

export default Index;
