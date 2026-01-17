import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<UserRole, User> = {
  student: {
    id: 'student-1',
    email: 'john.doe@university.edu',
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
  },
  instructor: {
    id: 'instructor-1',
    email: 'dr.smith@university.edu',
    name: 'Dr. Sarah Smith',
    role: 'instructor',
    department: 'Computer Science',
  },
  advisor: {
    id: 'advisor-1',
    email: 'prof.johnson@university.edu',
    name: 'Prof. Michael Johnson',
    role: 'advisor',
    department: 'Computer Science',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@university.edu',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const setDemoUser = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
