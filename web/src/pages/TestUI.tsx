import React from 'react';
import { Button } from '../components/ui';
import { Card, CardContent, CardTitle } from '../components/ui';
import { Input } from '../components/ui';
import { Zap, Shield, Sparkles } from 'lucide-react';

export const TestUI: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="hover:scale-105">
          <CardTitle>UI Components Test</CardTitle>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Fast</h3>
                <p className="text-sm text-gray-600">Optimized performance</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Secure</h3>
                <p className="text-sm text-gray-600">Protected data</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Beautiful</h3>
                <p className="text-sm text-gray-600">Modern design</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Test Input"
                placeholder="Type something..."
                icon="email"
              />
              
              <div className="flex space-x-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button loading={true}>Loading</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
