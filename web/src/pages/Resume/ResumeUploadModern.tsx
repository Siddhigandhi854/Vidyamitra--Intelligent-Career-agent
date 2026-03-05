import React, { useState, useEffect } from "react";
import { uploadResume } from "../../services/resume";
import { Card, CardContent, CardTitle } from "../../components/ui";
import { Button } from "../../components/ui";
import { FileText, Upload, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const ResumeUploadModern: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [uploadedResumes, setUploadedResumes] = useState<any[]>([]);

  // Load existing resumes on mount
  useEffect(() => {
    const savedResumes = localStorage.getItem('vm_uploaded_resumes');
    const lastResult = localStorage.getItem('vm_last_resume_result');
    
    if (savedResumes) {
      setUploadedResumes(JSON.parse(savedResumes));
    }
    
    if (lastResult) {
      setResult(JSON.parse(lastResult));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = [".pdf", ".doc", ".docx", ".txt"];
    const ok = allowed.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!ok) {
      setError("Unsupported file type. Use PDF, DOC, DOCX, or TXT.");
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      console.log('📄 Uploading resume:', file.name);
      const data = await uploadResume(file);
      
      console.log('✅ Resume analysis result:', data);
      setResult(data);
      
      // Save to localStorage for persistence
      localStorage.setItem("vm_last_resume_result", JSON.stringify(data));
      localStorage.setItem("vm_last_role", data.detected_role);
      
      // Add to uploaded resumes list
      const newResume = {
        id: Date.now(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        detectedRole: data.detected_role,
        score: data.score,
        skills: data.skills
      };
      
      const updatedResumes = [...uploadedResumes, newResume];
      setUploadedResumes(updatedResumes);
      localStorage.setItem('vm_uploaded_resumes', JSON.stringify(updatedResumes));
      
      // Trigger dashboard update
      window.dispatchEvent(new CustomEvent('resume-updated', { detail: data }));
      
      console.log('💾 Resume data saved and dashboard updated');
      
    } catch (err: any) {
      console.error('❌ Resume upload error:', err);
      setError(err?.response?.data?.detail || "Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = (resumeId: number) => {
    const updatedResumes = uploadedResumes.filter(r => r.id !== resumeId);
    setUploadedResumes(updatedResumes);
    localStorage.setItem('vm_uploaded_resumes', JSON.stringify(updatedResumes));
    
    if (updatedResumes.length === 0) {
      setResult(null);
      localStorage.removeItem('vm_last_resume_result');
      localStorage.removeItem('vm_last_role');
    }
  };

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
          📄 Resume Evaluation
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#374151', 
          fontWeight: '500'
        }}>
          Upload your resume to extract skills, infer target role, and compute ATS score
        </p>
      </div>

      {/* Upload Section */}
      <Card hover glass>
        <CardTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            Upload Resume
          </div>
        </CardTitle>
        <CardContent>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Resume File
            </label>
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              background: '#f8fafc',
              transition: 'all 0.3s ease'
            }}>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                style={{
                  display: 'none'
                }}
                id="resume-file"
              />
              <label
                htmlFor="resume-file"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#3182ce',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#3182ce';
                }}
              >
                Choose File
              </label>
              {file && (
                <div style={{ marginTop: '10px', color: '#374151' }}>
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              background: file && !loading ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: file && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: file && !loading ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
            onMouseOver={(e) => {
              if (file && !loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (file && !loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></div>
                Analyzing Resume...
              </span>
            ) : (
              'Upload & Analyze'
            )}
          </button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1a202c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Resume Analysis Results
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <Card hover glass>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  ATS Score
                </div>
              </CardTitle>
              <CardContent>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444',
                    marginBottom: '10px'
                  }}>
                    {result.score}/100
                  </div>
                  <div style={{
                    background: result.score >= 80 ? '#dcfce7' : result.score >= 60 ? '#fef3c7' : '#fef2f2',
                    color: result.score >= 80 ? '#166534' : result.score >= 60 ? '#92400e' : '#dc2626',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    display: 'inline-block'
                  }}>
                    {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover glass>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Detected Role
                </div>
              </CardTitle>
              <CardContent>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#7c3aed',
                    marginBottom: '10px'
                  }}>
                    {result.detected_role}
                  </div>
                  <div style={{
                    background: '#ede9fe',
                    color: '#7c3aed',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    display: 'inline-block'
                  }}>
                    Target Role
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover glass>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Detected Skills
                </div>
              </CardTitle>
              <CardContent>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.skills?.map((skill: string) => (
                    <span key={skill} style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Uploaded Resumes History */}
      {uploadedResumes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '20px'
          }}>
            📋 Upload History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {uploadedResumes.map((resume) => (
              <div key={resume.id} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a202c' }}>{resume.fileName}</div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {resume.detectedRole} • Score: {resume.score}/100 • 
                    {new Date(resume.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
