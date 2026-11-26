import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppShell } from './components/AppShell.jsx';

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
