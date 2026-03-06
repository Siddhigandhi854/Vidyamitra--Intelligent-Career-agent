import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const ResumeUploadSimple: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📄 Uploading resume:', file.name);
      
      // Simulate upload for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        filename: file.name,
        detected_role: 'Software Developer',
        score: 85,
        skills: ['React', 'TypeScript', 'Node.js'],
        strengths: ['Technical expertise', 'Problem-solving'],
        improvements: ['Add more projects', 'Update certifications'],
        recommended_roles: ['Senior Developer', 'Team Lead'],
        experience_level: 'Mid-level'
      };
      
      setResult(mockResult);
      console.log('✅ Resume uploaded successfully:', mockResult);
      
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
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
          📄 Resume Upload & Analysis
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Upload Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: '#fbbf24'
            }}>
              <Upload style={{ marginRight: '0.5rem' }} />
              Upload Resume
            </h2>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px dashed rgba(255,255,255,0.3)',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <FileText style={{
                width: '48px',
                height: '48px',
                marginBottom: '1rem',
                opacity: 0.5
              }} />
              <p style={{
                margin: 0,
                color: 'white',
                fontSize: '1rem'
              }}>
                {file ? file.name : 'Choose a file (PDF, DOC, DOCX)'}
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{
                display: 'none'
              }}
              id="resume-upload"
            />

            <label
              htmlFor="resume-upload"
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                backgroundColor: '#fbbf24',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
              }}
            >
              {loading ? 'Uploading...' : 'Choose File'}
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                backgroundColor: file && !loading ? '#22c55e' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: file && !loading ? 'pointer' : 'not-allowed',
                marginTop: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (file && !loading) {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }
              }}
              onMouseOut={(e) => {
                if (file && !loading) {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                }
              }}
            >
              {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem',
                color: '#ef4444'
              }}>
                <AlertCircle style={{ marginRight: '0.5rem' }} />
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: '#22c55e'
            }}>
              <CheckCircle style={{ marginRight: '0.5rem' }} />
              Analysis Results
            </h2>

            {result ? (
              <div>
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#22c55e',
                    marginBottom: '0.5rem'
                  }}>
                    {result.score}/100
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    color: '#16a34a'
                  }}>
                    Overall Score
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#fbbf24'
                  }}>
                    Detected Role: {result.detected_role}
                  </h3>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#3b82f6'
                  }}>
                    Skills
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {result.skills.map((skill: string, index: number) => (
                      <span key={index} style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: 'white'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#8b5cf6'
                  }}>
                    Strengths
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {result.strengths.map((strength: string, index: number) => (
                      <li key={index} style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        color: 'white'
                      }}>
                        <TrendingUp style={{ marginRight: '0.5rem', width: '16px' }} />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    color: '#f59e0b'
                  }}>
                    Recommendations
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {result.improvements.map((improvement: string, index: number) => (
                      <li key={index} style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        color: 'white'
                      }}>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: 'white',
                opacity: 0.7
              }}>
                <FileText style={{
                  width: '48px',
                  height: '48px',
                  marginBottom: '1rem',
                  opacity: 0.5
                }} />
                <p>Upload your resume to see detailed analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
