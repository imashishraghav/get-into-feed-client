import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, hasPermission } from '../utils/rbac.js';
import { clearServiceWorkerCaches } from '../utils/serviceWorkerClient.js';

const DEMO_USERS = [
  { id: 'usr_ashish', name: 'Ashish (Founder)', role: ROLES.OWNER, email: 'ashish@getintofeed.com', avatar: 'AR' },
  { id: 'usr_rahul', name: 'Rahul (Sales Lead)', role: ROLES.SALES_MANAGER, email: 'rahul@getintofeed.com', avatar: 'RS' },
  { id: 'usr_priya', name: 'Priya (Sales Rep)', role: ROLES.SALES_REP, email: 'priya@getintofeed.com', avatar: 'PS' },
  { id: 'usr_vikas', name: 'Vikas (Account Mgr)', role: ROLES.ACCOUNT_MANAGER, email: 'vikas@getintofeed.com', avatar: 'VA' },
  { id: 'usr_simran', name: 'Simran (Reels Lead)', role: ROLES.CREATIVE_LEAD, email: 'simran@getintofeed.com', avatar: 'SK' },
  { id: 'usr_freelance', name: 'Kunal (Contract Editor)', role: ROLES.FREELANCER, email: 'kunal@editor.freelance', avatar: 'KE' },
  { id: 'usr_finance', name: 'Deepak (Finance & CA)', role: ROLES.FINANCE, email: 'accounts@getintofeed.com', avatar: 'DA' },
  { id: 'usr_client', name: 'Ananya (Singhania)', role: ROLES.CLIENT, email: 'ananya@singhaniacouture.com', company: 'Singhania Couture', avatar: 'AS' }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gif_crm_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Default to Owner
  });

  const [uiMode, setUiMode] = useState(() => {
    return localStorage.getItem('gif_crm_ui_mode') || 'simple'; // 'simple' or 'advanced'
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gif_crm_theme') || 'light'; // Clean light mode default
  });

  useEffect(() => {
    localStorage.setItem('gif_crm_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gif_crm_ui_mode', uiMode);
  }, [uiMode]);

  useEffect(() => {
    localStorage.setItem('gif_crm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const switchRole = (roleKey) => {
    const target = DEMO_USERS.find((u) => u.role === roleKey) || DEMO_USERS[0];
    setCurrentUser(target);
    clearServiceWorkerCaches();
    // Non-owner roles default to simple mode for zero training
    if (roleKey !== ROLES.OWNER && roleKey !== ROLES.FINANCE) {
      setUiMode('simple');
    }
  };

  const logout = async () => {
    localStorage.removeItem('gif_crm_token');
    localStorage.removeItem('gif_crm_user');
    await clearServiceWorkerCaches();
    setCurrentUser(DEMO_USERS[0]);
  };

  const toggleUiMode = () => {
    setUiMode((prev) => (prev === 'simple' ? 'advanced' : 'simple'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const checkPerm = (permission) => {
    return hasPermission(currentUser?.role, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        demoUsers: DEMO_USERS,
        switchRole,
        logout,
        uiMode,
        toggleUiMode,
        theme,
        toggleTheme,
        hasPermission: checkPerm
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
