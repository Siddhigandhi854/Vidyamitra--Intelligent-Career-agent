# 🚀 Manual Render Deployment Guide

## 📋 Step-by-Step Manual Setup

### **Step 1: Delete Existing Services**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Delete both existing services:
   - `vidyamitra-backend`
   - `vidyamitra-frontend`

### **Step 2: Deploy Backend Service**

1. **Create New Web Service**
   - Click **"New"** → **"Web Service"**
   - Connect GitHub repository
   - Select `Vidyamitra--Intelligent-Career-agent`

2. **Service Configuration**
   ```
   Name: vidyamitra-backend
   Environment: Python
   Region: (choose nearest)
   Branch: master
   Root Directory: (leave empty)
   ```

3. **Build Settings**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**
   ```
   PYTHON_VERSION = 3.9.0
   PORT = 8000
   OPENAI_API_KEY = (your key)
   GOOGLE_API_KEY = (your key)
   GEMINI_API_KEY = (your key)
   YOUTUBE_API_KEY = (your key)
   SUPABASE_URL = (your key)
   SUPABASE_KEY = (your key)
   PEXELS_API_KEY = (your key)
   NEWS_API_KEY = (your key)
   EXCHANGE_API_KEY = (your key)
   JWT_SECRET = (generate random)
   ```

5. **Click "Create Web Service"**

### **Step 3: Deploy Frontend Service**

1. **Create New Web Service**
   - Click **"New"** → **"Web Service"**
   - Connect same GitHub repository
   - Select `Vidyamitra--Intelligent-Career-agent`

2. **Service Configuration**
   ```
   Name: vidyamitra-frontend
   Environment: Node
   Region: (same as backend)
   Branch: master
   Root Directory: web
   ```

3. **Build Settings**
   ```
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

4. **Environment Variables**
   ```
   VITE_API_BASE_URL = https://vidyamitra-backend.onrender.com
   VITE_SUPABASE_URL = (your supabase url)
   VITE_SUPABASE_ANON_KEY = (your supabase anon key)
   ```

5. **Click "Create Web Service"**

### **Step 4: Wait for Deployment**

1. **Backend**: Should take 2-3 minutes
2. **Frontend**: Should take 1-2 minutes
3. **Status**: Both should turn green

### **Step 5: Test Your Application**

1. **Backend URL**: https://vidyamitra-backend.onrender.com
2. **Frontend URL**: https://vidyamitra-frontend.onrender.com

3. **Test Features**:
   - ✅ User registration/login
   - ✅ Resume upload
   - ✅ Training plan
   - ✅ Quiz (10 questions)
   - ✅ Mock interview

## 🔧 Troubleshooting

### **If Backend Fails**
- Check all environment variables are set
- Verify requirements.txt exists
- Check build logs for specific errors

### **If Frontend Fails**
- Check Node version compatibility
- Verify package.json scripts
- Check build logs

### **If Connection Fails**
- Verify CORS settings
- Check API base URL
- Ensure backend is running first

## 🎯 Success Indicators

✅ Both services show "Live" status
✅ Backend responds at root URL
✅ Frontend loads application
✅ All features work correctly

---

**Your VidyāMitra application should now be live!**
