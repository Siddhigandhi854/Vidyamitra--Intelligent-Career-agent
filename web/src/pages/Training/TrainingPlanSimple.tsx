import React from 'react';
import { BookOpen, Clock, Award, Target } from 'lucide-react';

export const TrainingPlanSimple: React.FC = () => {
  const modules = [
    {
      id: 1,
      title: 'React Fundamentals Mastery',
      description: 'Deep dive into React hooks, state management, and component patterns',
      duration: '4 weeks',
      difficulty: 'Intermediate',
      progress: 75,
      status: 'in-progress',
      topics: ['Hooks', 'Context API', 'Performance', 'Testing']
    },
    {
      id: 2,
      title: 'Advanced TypeScript',
      description: 'Master TypeScript for large-scale applications',
      duration: '6 weeks',
      difficulty: 'Advanced',
      progress: 40,
      status: 'not-started',
      topics: ['Generics', 'Decorators', 'Modules', 'Type Guards']
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      description: 'Build scalable server-side applications',
      duration: '5 weeks',
      difficulty: 'Intermediate',
      progress: 0,
      status: 'not-started',
      topics: ['Express', 'Databases', 'Authentication', 'Deployment']
    },
    {
      id: 4,
      title: 'Cloud Architecture',
      description: 'Learn AWS, Docker, and Kubernetes',
      duration: '8 weeks',
      difficulty: 'Advanced',
      progress: 0,
      status: 'not-started',
      topics: ['AWS Services', 'Docker', 'Kubernetes', 'CI/CD']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#22c55e';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎓 Training Plan
        </h1>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: '#22c55e'
          }}>
            <Target style={{ marginRight: '0.5rem' }} />
            Your Learning Path
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'white',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Personalized training modules designed to enhance your skills and advance your career.
            Based on your resume analysis, we've created a learning path that focuses on your growth areas.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {modules.map((module) => (
            <div key={module.id} style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    marginBottom: '0.5rem',
                    color: '#fbbf24'
                  }}>
                    {module.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'white',
                    opacity: 0.8,
                    lineHeight: '1.5'
                  }}>
                    {module.description}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    backgroundColor: getStatusColor(module.status),
                    padding: '0.4rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase'
                  }}>
                    {module.status.replace('-', ' ')}
                  </span>
                  <span style={{
                    backgroundColor: getDifficultyColor(module.difficulty),
                    padding: '0.4rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: 'white'
                  }}>
                    {module.difficulty}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                color: 'white',
                opacity: 0.8
              }}>
                <Clock style={{ marginRight: '0.5rem', width: '16px' }} />
                {module.duration}
              </div>

              <div style={{
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    color: '#3b82f6',
                    margin: 0
                  }}>
                    Progress
                  </h4>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#22c55e'
                  }}>
                    {module.progress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${module.progress}%`,
                    height: '100%',
                    backgroundColor: '#22c55e',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                  color: '#8b5cf6'
                }}>
                  <BookOpen style={{ marginRight: '0.5rem', width: '16px' }} />
                  Topics
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {module.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <h2 style={{
            marginBottom: '1rem',
            color: '#22c55e'
          }}>
            <Award style={{ marginRight: '0.5rem' }} />
            Your Learning Journey
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            margin: 0, 
            color: '#16a34a',
            lineHeight: '1.6'
          }}>
            Complete these modules to enhance your skills<br/>
            and advance your career to the next level!
          </p>
        </div>
      </div>
    </div>
  );
};
