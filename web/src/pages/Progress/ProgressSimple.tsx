import React, { useEffect, useState } from "react";
import { fetchProgressOverview, fetchProgressTimeline } from "../../services/progress";

export const ProgressSimple: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, t] = await Promise.all([
          fetchProgressOverview(),
          fetchProgressTimeline(),
        ]);
        setOverview(o);
        setTimeline(t.items || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid white',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>Loading Progress...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: '10px'
        }}>
          📈 Progress Tracking
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
          Monitor Your Learning Journey
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            📄 Resume Score
          </h3>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3182ce'
          }}>
            {overview ? `${overview.resume_score}/100` : '--'}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            🎯 Quiz Average
          </h3>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#38a169'
          }}>
            {overview ? overview.avg_quiz_score : '--'}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            🎪 Interviews
          </h3>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#805ad5'
          }}>
            {overview ? overview.interviews_completed : '--'}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            📚 Training
          </h3>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#d69e2e'
          }}>
            {overview ? overview.training_modules_completed : '--'}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          color: '#2d3748',
          marginBottom: '20px',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          📅 Learning Timeline
        </h2>
        {timeline.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px'
            }}>
              🚀
            </div>
            <h3 style={{ color: '#4a5568', marginBottom: '10px' }}>
              Start Your Learning Journey!
            </h3>
            <p style={{ color: '#718096' }}>
              No activities yet. Begin by uploading your resume or taking a quiz.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '15px' }}>
            {timeline.map((item: any, index: number) => (
              <div key={item.label} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: '#f8fafc',
                borderRadius: '10px',
                marginBottom: '15px',
                borderLeft: '4px solid #3182ce'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#3182ce',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '20px',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    color: '#2d3748',
                    marginBottom: '5px',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {item.label}
                  </h4>
                  <p style={{
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    marginBottom: '5px'
                  }}>
                    {item.type}
                  </p>
                  {typeof item.score === "number" && (
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      ✅ Score: {item.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};
