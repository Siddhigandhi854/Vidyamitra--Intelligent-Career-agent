import React from 'react';
import { Briefcase, MapPin, TrendingUp, Users } from 'lucide-react';

export const JobRolesSimple: React.FC = () => {
  const jobs = [
    {
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      match: '95%',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $130k',
      match: '88%',
      skills: ['JavaScript', 'Python', 'AWS']
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80k - $100k',
      match: '82%',
      skills: ['HTML', 'CSS', 'React']
    },
    {
      title: 'Software Developer',
      company: 'Enterprise Corp',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$90k - $110k',
      match: '79%',
      skills: ['Java', 'Spring', 'Docker']
    }
  ];

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
          💼 Job Recommendations
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {jobs.map((job, index) => (
            <div key={index} style={{
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
                    {job.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    opacity: 0.8,
                    fontSize: '0.9rem'
                  }}>
                    <Briefcase style={{ marginRight: '0.5rem', width: '16px' }} />
                    {job.company}
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#22c55e'
                }}>
                  {job.match}% Match
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                color: 'white',
                opacity: 0.8
              }}>
                <MapPin style={{ marginRight: '0.5rem', width: '16px' }} />
                {job.location}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                color: 'white',
                opacity: 0.8
              }}>
                <Users style={{ marginRight: '0.5rem', width: '16px' }} />
                {job.type}
              </div>

              <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#22c55e',
                marginBottom: '1rem'
              }}>
                {job.salary}
              </div>

              <div>
                <h4 style={{
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                  color: '#3b82f6'
                }}>
                  Required Skills
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {job.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      {skill}
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
            ✅ Job Recommendations Ready!
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            margin: 0, 
            color: '#16a34a',
            lineHeight: '1.6'
          }}>
            Based on your resume analysis and skills,<br/>
            these are the best career opportunities for you.
          </p>
        </div>
      </div>
    </div>
  );
};
