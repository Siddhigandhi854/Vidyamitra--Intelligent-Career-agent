#!/bin/bash

# Build script for Render deployment
echo "🔧 Building VidyāMitra Frontend for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Frontend ready for deployment"
