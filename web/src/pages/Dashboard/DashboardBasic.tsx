import React from "react";

export const DashboardBasic: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          🎉 Welcome to VidyāMitra!
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: '#4b5563'
        }}>
          Your intelligent career agent is ready to help you succeed.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              📄 Resume Upload
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Upload your resume for ATS scoring and job matching
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              💼 Job Roles
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Explore career opportunities based on your profile
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              🎓 Training Plan
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Personalized learning paths to enhance your skills
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              📊 Progress Tracking
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Monitor your learning journey and achievements
            </p>
          </div>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#10b981',
          borderRadius: '8px',
          border: '1px solid #059669'
        }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'white'
            }}>
              🚀 Ready for Production
            </h3>
            <p style={{ color: '#f3f4f5', marginBottom: '1rem' }}>
              All components are working and ready for deployment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
