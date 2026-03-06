import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './router';
import { AuthProvider } from './contexts/AuthContextSimple';
import { Notification } from './components/ui';
import './styles.css';

// Add a simple test to verify UI components are working
console.log('🎨 UI Components loaded successfully!');
console.log('⚡ Performance optimizations active!');
console.log('🚀 VidyāMitra Enhanced Version');

// Route debugger component
const RouteDebugger: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('🛣️ Route changed to:', location.pathname);
    console.log('🔍 Search params:', location.search);
    console.log('📍 Hash:', location.hash);
    console.log('🔐 Auth check:', {
      token: localStorage.getItem('vm_token') ? 'exists' : 'missing',
      email: localStorage.getItem('vm_user_email')
    });
    
    // Check for potential issues
    if (location.pathname === '/dashboard') {
      console.log('🎯 Dashboard route detected - checking for issues...');
      
      // Check if required components are available
      try {
        const DashboardDebug = require('./pages/Dashboard/DashboardDebug').DashboardDebug;
        console.log('✅ DashboardDebug component loaded successfully');
      } catch (error) {
        console.error('❌ DashboardDebug component failed to load:', error);
      }
      
      // Check if ErrorBoundary is working
      try {
        const ErrorBoundary = require('./components/ErrorBoundary').default;
        console.log('✅ ErrorBoundary component loaded successfully');
      } catch (error) {
        console.error('❌ ErrorBoundary component failed to load:', error);
      }
    }
  }, [location]);
  
  return null;
};

const App: React.FC = () => {
  const [showNotification, setShowNotification] = React.useState(true);

  React.useEffect(() => {
    console.log('🚀 App component mounted');
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showNotification && (
        <Notification
          message="🎉 New UI & Performance Features Loaded!"
          type="success"
          duration={8000}
          onClose={() => setShowNotification(false)}
        />
      )}
      <BrowserRouter>
        <RouteDebugger />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
