import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const MainLayoutSimple: React.FC = () => {
  console.log('🏠 MainLayoutSimple: Rendering layout');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Simple Header */}
      <div style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🎉 VidyāMitra
        </h2>
        <div style={{
          fontSize: '1rem',
          opacity: 0.8
        }}>
          Your Intelligent Career Agent
        </div>
      </div>
      
      {/* Main Content with Sidebar */}
      <div style={{
        flex: 1,
        display: 'flex'
      }}>
        {/* Navigation Sidebar */}
        <aside style={{
          width: '280px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
        }}>
          {/* Logo */}
          <div style={{
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              VidyāMitra
            </h1>
            <p style={{
              fontSize: '0.9rem',
              opacity: 0.9,
              margin: 0
            }}>
              Your Career Agent
            </p>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1 }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                opacity: 0.7,
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                Overview
              </div>
              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                📊 Dashboard
              </NavLink>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                opacity: 0.7,
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                Career Journey
              </div>
              <NavLink
                to="/resume"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                📄 Resume Analysis
              </NavLink>
              <NavLink
                to="/roles"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                💼 Job Roles
              </NavLink>
              <NavLink
                to="/training"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                🎓 Training Plan
              </NavLink>
              <NavLink
                to="/quiz"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                🧠 Quiz Module
              </NavLink>
              <NavLink
                to="/interview"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                🎭 Mock Interview
              </NavLink>
              <NavLink
                to="/progress"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                })}
              >
                📊 Progress
              </NavLink>
            </div>
          </nav>
        </aside>
        
        {/* Content Area */}
        <div style={{
          flex: 1,
          backgroundColor: '#f8fafc',
          padding: '2rem'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
