import React from 'react';

export const RegisterTest: React.FC = () => {
  console.log('🎯 RegisterTest: Component rendering');
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'red',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      🎯 REGISTER TEST PAGE - IF YOU SEE THIS, ROUTING WORKS!
    </div>
  );
};
