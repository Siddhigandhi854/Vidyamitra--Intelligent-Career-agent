import React from 'react';

export const TestDashboard: React.FC = () => {
  console.log('🎯 TestDashboard: RENDERING!');
  
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: 'red',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      🚨 TEST DASHBOARD - IF YOU SEE THIS, ROUTING WORKS!
    </div>
  );
};
