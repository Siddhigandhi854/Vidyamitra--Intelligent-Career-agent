import React, { useEffect, useState } from "react";
import { fetchResumeSummary } from "../../services/resume";
import { fetchTrainingPlan } from "../../services/training";
import { fetchProgressOverview } from "../../services/progress";
import { fetchJobRecommendations } from "../../services/jobs";
import { Card, CardContent, CardTitle } from "../../components/ui";
import { Button } from "../../components/ui";
import { BarChart3, TrendingUp, Award, Target, BookOpen, Brain, Users } from 'lucide-react';

export const DashboardModern: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [jobs, setJobs] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, t, p, j] = await Promise.all([
          fetchResumeSummary(),
          fetchTrainingPlan(),
          fetchProgressOverview(),
          fetchJobRecommendations(),
        ]);
        setResume(r);
        setTraining(t);
        setProgress(p);
        setJobs(j);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Analytics Dashboard</h1>
        <p className="text-gray-600 text-lg">Track your progress and achieve your career goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Resume Score</CardTitle>
            <div className="text-3xl font-bold text-blue-600">
              {resume ? `${resume.overall_score}/100` : '--'}
            </div>
            <p className="text-sm text-gray-600">Overall evaluation</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Skills</CardTitle>
            <div className="text-3xl font-bold text-green-600">
              {resume?.strengths?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Key strengths</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Quizzes</CardTitle>
            <div className="text-3xl font-bold text-purple-600">
              {progress?.quizzes_taken || 0}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Interviews</CardTitle>
            <div className="text-3xl font-bold text-orange-600">
              {progress?.interviews_completed || 0}
            </div>
            <p className="text-sm text-gray-600">Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover glass>
          <CardTitle>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Training Plan
            </div>
          </CardTitle>
          <CardContent>
            {training ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Target Role</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {training.target_role}
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{training.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {training.modules?.slice(0, 3).map((module: any) => (
                    <span key={module.title} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {module.title}
                    </span>
                  ))}
                </div>
                <button
                onClick={() => alert('View Full Training Plan')}
                style={{
                  background: 'transparent',
                  color: '#3182ce',
                  border: '2px solid #3182ce',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#3182ce';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#3182ce';
                }}
              >
                View Full Plan
              </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No training plan yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card hover glass>
          <CardTitle>
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Progress Timeline
            </div>
          </CardTitle>
          <CardContent>
            {progress && timeline.length > 0 ? (
              <div className="space-y-3">
                {timeline.map((item: any, index: number) => (
                  <div key={item.label} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.type}</p>
                    </div>
                    {typeof item.score === "number" && (
                      <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Score: {item.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No progress yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
