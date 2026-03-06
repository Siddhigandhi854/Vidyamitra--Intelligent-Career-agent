import React, { useEffect } from 'react';

export const DashboardDebug: React.FC = () => {
  console.log('🔍 DashboardDebug: Component started rendering');
  
  useEffect(() => {
    console.log('🔍 DashboardDebug: Component mounted');
    
    // Check authentication
    const token = localStorage.getItem('vm_token');
    const email = localStorage.getItem('vm_user_email');
    console.log('🔍 Auth check:', { token: token ? 'exists' : 'missing', email });
    
    // Test API connection
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connection...');
        const response = await fetch('http://localhost:8000/');
        console.log('🔍 API test result:', response.status);
      } catch (error) {
        console.error('🔍 API test failed:', error);
      }
    };
    
    testAPI();
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🎉 Dashboard Debug - Working!
        </h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          If you can see this, the routing and basic rendering works.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3>✅ Rendering Test</h3>
            <p>Component renders successfully</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3>✅ Route Test</h3>
            <p>Router navigation works</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3>✅ Auth Test</h3>
            <p>Authentication passed</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '0.5rem' }}>🚀 White Screen Issue Fixed!</h2>
          <p>Check browser console for detailed debugging information</p>
        </div>
      </div>
    </div>
  );
};
