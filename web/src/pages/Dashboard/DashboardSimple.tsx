import React, { useEffect, useState } from "react";
import { fetchResumeSummary } from "../../services/resume";
import { fetchTrainingPlan } from "../../services/training";
import { fetchProgressOverview } from "../../services/progress";
import { fetchJobRecommendations } from "../../services/jobs";

export const DashboardSimple: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [jobs, setJobs] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Load from localStorage first
        const savedResume = localStorage.getItem('vm_last_resume_result');
        if (savedResume) {
          setResume(JSON.parse(savedResume));
        }

        const [r, t, p, j] = await Promise.all([
          fetchResumeSummary(),
          fetchTrainingPlan(),
          fetchProgressOverview(),
          fetchJobRecommendations(),
        ]);
        setResume(r || (savedResume ? JSON.parse(savedResume) : null));
        setTraining(t);
        setProgress(p);
        setJobs(j);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Listen for resume updates
    const handleResumeUpdate = (event: CustomEvent) => {
      console.log('📊 Dashboard received resume update:', event.detail);
      setResume(event.detail);
    };

    window.addEventListener('resume-updated', handleResumeUpdate as EventListener);

    return () => {
      window.removeEventListener('resume-updated', handleResumeUpdate as EventListener);
    };
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
          <h2>Loading Dashboard...</h2>
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
          🚀 VidyāMitra Dashboard
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
          Your Career Analytics Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Resume Card */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease',
          border: 'none'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            📊 Resume Score
          </h3>
          {resume ? (
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#3182ce',
                marginBottom: '10px'
              }}>
                {resume.overall_score}/100
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {resume.strengths?.map((s: string) => (
                  <span key={s} style={{
                    background: '#e6fffa',
                    color: '#047857',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    border: '1px solid #a7f3d0'
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No resume insights yet.</p>
          )}
        </div>

        {/* Training Card */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            📚 Training Plan
          </h3>
          {training && training.modules?.length > 0 ? (
            <div>
              <span style={{
                background: '#fef3c7',
                color: '#d97706',
                padding: '8px 15px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                Target: {training.target_role}
              </span>
              <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '10px' }}>
                {training.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {training.modules?.slice(0, 3).map((m: any) => (
                  <span key={m.title} style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem'
                  }}>
                    {m.title}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No training plan yet.</p>
          )}
        </div>

        {/* Progress Card */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            🎯 Progress
          </h3>
          {progress ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Quizzes
                </span>
                <span style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: '#166534',
                  marginLeft: '10px'
                }}>
                  {progress.avg_quiz_score}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                {progress.quizzes_taken} quizzes taken
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{
                  background: '#fce7f3',
                  color: '#d97706',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Interviews
                </span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginLeft: '10px'
                }}>
                  {progress.interviews_completed}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No progress yet.</p>
          )}
        </div>

        {/* Jobs Card */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease'
        }}>
          <h3 style={{
            color: '#2d3748',
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            💼 Job Recommendations
          </h3>
          {jobs ? (
            <div>
              <span style={{
                background: '#ede9fe',
                color: '#7c3aed',
                padding: '8px 15px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                Target: {jobs.target_role}
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {jobs.recommendations?.slice(0, 3).map((j: any) => (
                  <li key={j.id} style={{
                    fontSize: '1rem',
                    marginBottom: '10px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '3px solid #7c3aed'
                  }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1a202c', fontSize: '1.1rem' }}>{j.title}</strong>
                      <div style={{ color: '#374151', fontSize: '0.9rem', marginTop: '4px' }}>
                        at {j.company} · {j.location}
                      </div>
                      <div style={{ 
                        color: '#7c3aed', 
                        fontWeight: 'bold', 
                        fontSize: '1rem',
                        marginTop: '4px',
                        background: '#e0e7ff',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        display: 'inline-block'
                      }}>
                        {j.match_score}% match
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No recommendations yet.</p>
          )}
        </div>
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
