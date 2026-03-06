import React from "react";
import { useAuth } from "../../contexts/AuthContextSimple";

export const DashboardWorking: React.FC = () => {
  const { user } = useAuth();

  console.log('🚀 WORKING DASHBOARD - User:', user?.email);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Header */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            🎉 Welcome Back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-green-600">
            You are successfully logged in to VidyāMitra
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 100-4 0m-6 4l2-2m0 0l-2 2m6-2a2 2 0 102 4 0m-6 4l2-2m0 0l-2 2m6-2a2 2 0 102 4 0" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Resume Upload
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Ready
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-6">
              <div className="text-sm">
                <a href="/resume" className="font-medium text-blue-600 hover:text-blue-500">
                  Upload Resume &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Job Roles
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Available
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-6">
              <div className="text-sm">
                <a href="/roles" className="font-medium text-green-600 hover:text-green-500">
                  Explore Jobs &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.747V6.253z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Training
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Start
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-6">
              <div className="text-sm">
                <a href="/training" className="font-medium text-yellow-600 hover:text-yellow-500">
                  Start Training &rarr;
                </a>
              </div>
            </div>
          </div>

        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4">
            User Information
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Email:</strong> {user?.email || 'Loading...'}</p>
            <p><strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Logged In</span></p>
            <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/resume" className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 11.895-2-2h-4a2 2 0 00-2-2v-4a2 2 0 00-2-2H3m18 10l4 4H3" />
              </svg>
              <span className="ml-3 text-base font-medium">Upload Resume</span>
            </a>
            
            <a href="/roles" className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="ml-3 text-base font-medium">Find Jobs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
