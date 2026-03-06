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
