import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const RegisterSimple: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || success) return;
    
    // Basic validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 REGISTERING USER:', email);
      
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      console.log('🔐 REGISTER RESPONSE STATUS:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ REGISTER FAILED:', errorText);
        setError(errorText || 'Registration failed');
        return;
      }

      const data = await response.json();
      console.log('✅ REGISTER SUCCESS:', data);
      
      // Store real token
      localStorage.setItem('vm_token', data.access_token);
      localStorage.setItem('vm_user_email', email);
      
      setSuccess(true);
      setLoading(false);
      
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ REGISTER ERROR:', err);
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
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
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '2rem',
            color: '#22c55e'
          }}>
            ✅
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Registration Successful!
          </h2>
          <p style={{
            fontSize: '1rem',
            marginBottom: '2rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Welcome to VidyāMitra! Redirecting to dashboard...
          </p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #22c55e',
            borderTop: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </div>
    );
  }

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
            🎓 Create Account
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '2rem'
          }}>
            Join VidyāMitra - Your Intelligent Career Agent
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
            <Mail style={{
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
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Registering...
              </>
            ) : (
              <>
                Register
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
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#22c55e', textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
