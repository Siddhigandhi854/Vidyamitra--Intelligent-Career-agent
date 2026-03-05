import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "../../components/ui";

export const ProgressWorking: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>({
    resume_score: 85,
    avg_quiz_score: 78,
    quizzes_taken: 5,
    interviews_completed: 3,
    training_modules_completed: 8
  });

  const [timeline, setTimeline] = useState<any[]>([
    {
      label: "Resume Uploaded",
      type: "Document Analysis",
      score: 85
    },
    {
      label: "First Quiz Completed",
      type: "Assessment",
      score: 72
    },
    {
      label: "Interview Practice #1",
      type: "Mock Interview",
      score: 80
    },
    {
      label: "Training Module 1",
      type: "Learning",
      score: 90
    },
    {
      label: "Second Quiz Completed",
      type: "Assessment",
      score: 85
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Simulate real-time updates
      const interval = setInterval(() => {
        setProgress((prev: any) => ({
          ...prev,
          avg_quiz_score: Math.min(100, prev.avg_quiz_score + Math.random() * 2),
          quizzes_taken: prev.quizzes_taken + 1,
          interviews_completed: Math.random() > 0.7 ? prev.interviews_completed + 1 : prev.interviews_completed,
          training_modules_completed: Math.random() > 0.6 ? prev.training_modules_completed + 1 : prev.training_modules_completed
        }));
      }, 3000);

      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timer);
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
          <h2>Loading Progress Tracking...</h2>
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
          color: '#1a202c',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          📈 Live Progress Tracking
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          color: '#374151', 
          fontWeight: '500',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Real-time progress monitoring
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
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#1a202c',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            📄 Resume Score
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#0d6efd',
            marginBottom: '10px',
            transition: 'all 0.5s ease',
            textShadow: '2px 2px 4px rgba(13, 110, 253, 0.2)'
          }}>
            {progress.resume_score}/100
          </div>
          <p style={{ 
            color: '#374151', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Overall evaluation score
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#1a202c',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            🎯 Quiz Average
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '10px',
            transition: 'all 0.5s ease',
            textShadow: '2px 2px 4px rgba(16, 185, 129, 0.2)'
          }}>
            {Math.round(progress.avg_quiz_score)}
          </div>
          <p style={{ 
            color: '#374151', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Across {progress.quizzes_taken} quizzes
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#1a202c',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            🎪 Interviews
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#f59e0b',
            marginBottom: '10px',
            transition: 'all 0.5s ease',
            textShadow: '2px 2px 4px rgba(245, 158, 11, 0.2)'
          }}>
            {progress.interviews_completed}
          </div>
          <p style={{ 
            color: '#374151', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Sessions completed
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#1a202c',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            📚 Training
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#84cc16',
            marginBottom: '10px',
            transition: 'all 0.5s ease',
            textShadow: '2px 2px 4px rgba(132, 204, 22, 0.2)'
          }}>
            {progress.training_modules_completed}
          </div>
          <p style={{ 
            color: '#374151', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Modules completed
          </p>
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
          color: '#1a202c',
          marginBottom: '20px',
          fontSize: '1.5rem',
          fontWeight: '600',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          📅 Live Activity Timeline
        </h2>
        <div style={{ marginBottom: '20px' }}>
          {timeline.map((item: any, index: number) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              background: '#f8fafc',
              borderRadius: '10px',
              marginBottom: '15px',
              borderLeft: '4px solid #3182ce',
              transition: 'all 0.3s ease',
              transform: 'translateX(0)'
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
                  color: '#1a202c',
                  marginBottom: '5px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {item.label}
                </h4>
                <p style={{
                  color: '#6b7280',
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
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `
      }} />
    </div>
  );
};
