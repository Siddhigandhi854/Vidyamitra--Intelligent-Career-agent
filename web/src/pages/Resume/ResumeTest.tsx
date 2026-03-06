import React from "react";
import { Card, CardContent, CardTitle } from "../../components/ui";
import { Button } from "../../components/ui";

export const ResumeTest: React.FC = () => {
  const [testResult, setTestResult] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing backend connection...');
    
    try {
      console.log('🌐 Testing backend connection...');
      
      // Test 1: Basic backend health check
      const healthResponse = await fetch('https://vidyamitra-backend-uprd.onrender.com/');
      console.log('Health check:', healthResponse.status, healthResponse.statusText);
      
      // Test 2: Test resume endpoint directly
      const formData = new FormData();
      formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');
      
      const uploadResponse = await fetch('https://vidyamitra-backend-uprd.onrender.com/resume/parse', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload test:', uploadResponse.status, uploadResponse.statusText);
      
      const uploadResult = await uploadResponse.text();
      console.log('Upload response:', uploadResult);
      
      setTestResult(`
        Health Check: ${healthResponse.status} - ${healthResponse.statusText}
        Upload Test: ${uploadResponse.status} - ${uploadResponse.statusText}
        Response: ${uploadResult}
      `);
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardTitle>Backend Connection Test</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  This will test the exact backend connection and resume upload functionality.
                </p>
                <Button 
                  onClick={testBackendConnection}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Testing...' : 'Test Backend Connection'}
                </Button>
              </div>
              
              {testResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Test Results:</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
