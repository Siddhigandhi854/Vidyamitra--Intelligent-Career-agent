# 🚀 Render Deployment Guide for VidyāMitra

## 📋 Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- All API keys ready (OpenAI, Gemini, Supabase, etc.)

## 🛠️ Step-by-Step Deployment

### **Step 1: Prepare Your Repository**
1. ✅ Ensure all code is pushed to GitHub
2. ✅ Verify `render.yaml` is in root directory
3. ✅ Check `.env.example` exists (don't commit `.env`)

### **Step 2: Deploy Backend Service**

#### **Option A: Using render.yaml (Recommended)**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select `vidyamitra--Intelligent-Career-agent`
5. Render will auto-detect services from `render.yaml`
6. Click "Create Blueprint"

#### **Option B: Manual Setup**
1. Click "New" → "Web Service"
2. Connect GitHub repository
3. **Service Details:**
   - Name: `vidyamitra-backend`
   - Environment: `Python`
   - Region: Choose nearest
   - Branch: `master`
4. **Build Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   ```
   PYTHON_VERSION=3.9.0
   PORT=8000
   OPENAI_API_KEY=your_openai_key
   GOOGLE_API_KEY=your_google_key
   GEMINI_API_KEY=your_gemini_key
   YOUTUBE_API_KEY=your_youtube_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   PEXELS_API_KEY=your_pexels_key
   NEWS_API_KEY=your_news_key
   EXCHANGE_API_KEY=your_exchange_key
   JWT_SECRET=your_jwt_secret
   ```

### **Step 3: Deploy Frontend Service**

#### **Option A: Using render.yaml (Recommended)**
- Frontend will be auto-deployed with backend

#### **Option B: Manual Setup**
1. Click "New" → "Web Service"
2. Connect GitHub repository
3. **Service Details:**
   - Name: `vidyamitra-frontend`
   - Environment: `Static Site`
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://vidyamitra-backend.onrender.com
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### **Step 4: Configure Environment Variables**

#### **Backend Environment Variables**
Go to your backend service → Environment → Add Environment Variable:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ |
| `GOOGLE_API_KEY` | Your Google API key | ✅ |
| `GEMINI_API_KEY` | Your Gemini API key | ✅ |
| `YOUTUBE_API_KEY` | Your YouTube API key | ✅ |
| `SUPABASE_URL` | Your Supabase URL | ✅ |
| `SUPABASE_KEY` | Your Supabase key | ✅ |
| `PEXELS_API_KEY` | Your Pexels API key | ✅ |
| `NEWS_API_KEY` | Your News API key | ✅ |
| `EXCHANGE_API_KEY` | Your Exchange API key | ✅ |
| `JWT_SECRET` | Generate random secret | ✅ |

#### **Frontend Environment Variables**
Go to your frontend service → Environment → Add Environment Variable:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_BASE_URL` | `https://vidyamitra-backend.onrender.com` | ✅ |
| `VITE_SUPABASE_URL` | Your Supabase URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ |

### **Step 5: Deploy and Test**

1. **Trigger Deployment:**
   - Services auto-deploy on push
   - Or click "Manual Deploy" → "Deploy Latest Commit"

2. **Wait for Build:**
   - Backend: ~2-3 minutes
   - Frontend: ~1-2 minutes

3. **Test Services:**
   - Backend: `https://vidyamitra-backend.onrender.com/`
   - Frontend: `https://vidyamitra-frontend.onrender.com/`

4. **Verify Functionality:**
   - ✅ User registration/login
   - ✅ Resume upload and analysis
   - ✅ Training plan generation
   - ✅ Quiz functionality
   - ✅ Mock interviews

## 🔧 Troubleshooting

### **Common Issues**

#### **Backend Fails to Start**
- Check environment variables are correct
- Verify `requirements.txt` has all dependencies
- Check Render logs for specific errors

#### **Frontend Build Fails**
- Ensure `package.json` has correct scripts
- Check TypeScript compilation errors
- Verify API base URL is correct

#### **API Connection Issues**
- Verify CORS settings in backend
- Check frontend API base URL
- Ensure backend is running before frontend

#### **Environment Variable Issues**
- Don't commit `.env` file
- Use Render environment variables
- Check for typos in variable names

### **Debug Tips**

1. **Check Logs:**
   - Go to service → Logs
   - Look for error messages
   - Check build and runtime logs

2. **Health Checks:**
   - Backend: Visit `/` endpoint
   - Frontend: Check if page loads

3. **API Testing:**
   - Test backend endpoints directly
   - Check frontend network requests

## 📊 Monitoring

### **Render Dashboard**
- Monitor service status
- Check resource usage
- View deployment logs

### **Performance**
- Free tier has limited resources
- Consider upgrading for production
- Monitor response times

## 🔄 Continuous Deployment

### **Auto-Deploy**
- Services auto-deploy on GitHub push
- Configure branch settings
- Use pull requests for testing

### **Manual Deploy**
- Trigger specific commits
- Rollback to previous versions
- Pause auto-deployment if needed

## 🎯 Production Tips

1. **Security:**
   - Use HTTPS (automatic on Render)
   - Keep API keys secure
   - Monitor for vulnerabilities

2. **Performance:**
   - Optimize API calls
   - Use caching where possible
   - Monitor resource usage

3. **Scaling:**
   - Start with free tier
   - Upgrade as needed
   - Consider database scaling

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Status Page**: https://status.render.com
- **Community**: https://community.render.com

---

**🎉 Your VidyāMitra application is now live on Render!**
