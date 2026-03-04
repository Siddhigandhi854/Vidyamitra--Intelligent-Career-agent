import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const TestAuth: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Authentication Test Page</h1>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}
      </div>
      {user && (
        <button onClick={signOut} style={{ padding: '0.5rem 1rem', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>
          Sign Out
        </button>
      )}
    </div>
  );
};
