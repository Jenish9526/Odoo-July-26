import { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load registered users from localStorage or initialize with defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('mock_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return [
      { name: 'Admin User', email: 'admin@dashboard.com', password: 'admin123' }
    ];
  });

  // Helper mock sleep timeout
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Mock Login
  const loginMock = async (email, password) => {
    console.log('loginMock parameters received:', { email, password });
    try {
      setLoading(true);
      setError(null);
      await sleep(1500); // Simulate API network latency

      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const cleanPassword = password ? password.trim() : '';

      const matchedUser = users.find((u) => u.email === cleanEmail && u.password === cleanPassword);

      if (matchedUser) {
        const mockUser = { id: `usr_${Date.now()}`, name: matchedUser.name, email: cleanEmail };
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true, message: 'Authentication successful' };
      }
      
      // Dynamic fallback validation error
      throw new Error('Invalid email or password. Try: admin@dashboard.com / admin123');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock Register
  const registerMock = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      await sleep(1500);

      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const cleanPassword = password ? password.trim() : '';

      const exists = users.some((u) => u.email === cleanEmail);
      if (exists) {
        throw new Error('An account already exists with this email address');
      }

      const newUser = { name, email: cleanEmail, password: cleanPassword };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('mock_users', JSON.stringify(updatedUsers));

      return { success: true, message: 'Account registered successfully!' };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock Forgot Password
  const forgotPasswordMock = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await sleep(1500);

      return { success: true, message: 'Reset token dispatched to ' + email };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock Reset Password
  const resetPasswordMock = async (_token, _password) => {
    try {
      setLoading(true);
      setError(null);
      await sleep(1500);

      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock Logout
  const logoutMock = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    loginMock,
    registerMock,
    forgotPasswordMock,
    resetPasswordMock,
    logoutMock,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
