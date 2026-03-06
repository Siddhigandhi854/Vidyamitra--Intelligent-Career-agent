import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  'https://ilmwebrpykhijzkxfimc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXdlYnJweWtoaWp6a3hmaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzYwNDksImV4cCI6MjA4NzQxMjA0OX0.CXp8wUsuV4R2_-kUkGhJ9vH159fCGgnIfVTQkTxDNRo'
);

export const LoginFinal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 LOGIN IN TO SUPABASE:', email);
      
      // Login directly with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('❌ SUPABASE LOGIN ERROR:', error);
        setError(error.message || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('✅ SUPABASE LOGIN SUCCESS:', data);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('✅ SESSION ACTIVE:', session.user);
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError('Login successful but no session');
        setLoading(false);
      }
      
    } catch (err: any) {
      console.error('❌ LOGIN ERROR:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '3rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔐 Login
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '2rem'
          }}>
            Welcome back to VidyāMitra
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              padding: '1rem',
              borderRadius: '10px',
              color: '#ef4444',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255,255,255,0.5)'
            }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255,255,255,0.5)'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              backgroundColor: loading ? '#6b7280' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid #ffffff',
                  borderTop: '3px solid transparent',
                  borderRight: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <p style={{ fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#22c55e', textDecoration: 'underline' }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
