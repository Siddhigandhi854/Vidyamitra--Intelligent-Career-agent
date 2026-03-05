import React, { useEffect, useState } from "react";
import { fetchProgressOverview, fetchProgressTimeline } from "../../services/progress";
import { Card, CardContent, CardTitle } from "../../components/ui";
import { Button } from "../../components/ui";
import { TrendingUp, Award, Calendar, Target, Clock, CheckCircle } from 'lucide-react';

export const ProgressModern: React.FC = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading Progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
        <p className="text-gray-600 text-lg">Monitor your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Resume Score</CardTitle>
            <div className="text-3xl font-bold text-blue-600">
              {overview ? `${overview.resume_score}/100` : '--'}
            </div>
            <p className="text-sm text-gray-600">Overall evaluation</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Quiz Average</CardTitle>
            <div className="text-3xl font-bold text-green-600">
              {overview ? overview.avg_quiz_score : '--'}
            </div>
            <p className="text-sm text-gray-600">Average score</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Interviews</CardTitle>
            <div className="text-3xl font-bold text-purple-600">
              {overview ? overview.interviews_completed : '--'}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card hover glass>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Training</CardTitle>
            <div className="text-3xl font-bold text-orange-600">
              {overview ? overview.training_modules_completed : '--'}
            </div>
            <p className="text-sm text-gray-600">Modules</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card hover glass>
        <CardTitle>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Learning Timeline
          </div>
        </CardTitle>
        <CardContent>
          {timeline.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities yet. Start your learning journey!</p>
              <button
                onClick={() => alert('Get Started clicked!')}
                style={{
                  background: 'linear-gradient(135deg, #3182ce 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(49, 130, 206, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(49, 130, 206, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(49, 130, 206, 0.3)';
                }}
              >
                🚀 Get Started
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((item: any, index: number) => (
                <div key={item.label} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.label}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                    {typeof item.score === "number" && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Score: {item.score}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
