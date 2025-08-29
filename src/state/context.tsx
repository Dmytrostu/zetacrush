import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockSessions } from '../data/mockSessions';

export interface User {
  id: string;
  email: string;
  token: string;
  trialActive: boolean;
  subscriptionActive: boolean;
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  date: string;
  summary: {
    characters: string[];
    synopsis: string;
    easterEgg: string;
  };
}

interface AppState {
  user: User | null;
  uploadHistory: UploadHistoryItem[];
  sidebarOpen: boolean;
  activeSession: string | null; // Store active session ID
  isNewSession: boolean; // Flag to indicate we're in new session mode
  setUser: (user: User | null) => void;
  setUploadHistory: (history: UploadHistoryItem[]) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSession: (sessionId: string | null) => void;
  setIsNewSession: (isNew: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>(mockSessions);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Set to true by default
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isNewSession, setIsNewSession] = useState<boolean>(true);

  return (
    <AppContext.Provider value={{ 
      user, 
      uploadHistory, 
      sidebarOpen, 
      activeSession,
      isNewSession,
      setUser, 
      setUploadHistory, 
      setSidebarOpen,
      setActiveSession,
      setIsNewSession
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
