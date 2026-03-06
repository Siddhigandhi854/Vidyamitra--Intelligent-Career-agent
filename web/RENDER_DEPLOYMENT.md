# Render Deployment Configuration

## Environment Variables

Add these environment variables in your Render dashboard:

### Frontend Service (vidyamitra-frontend-uqfo)

```
VITE_API_URL=https://vidyamitra-backend-uprd.onrender.com
VITE_SUPABASE_URL=https://ilmwebrpykhijzkxfimc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXdlYnJweWtoaWp6a3hmaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzYwNDksImV4cCI6MjA4NzQxMjA0OX0.CXp8wUsuV4R2_-kUkGhJ9vH159fCGgnIfVTQkTxDNRo
```

### Backend Service (vidyamitra-backend-uprd)

```
SUPABASE_URL=https://ilmwebrpykhijzkxfimc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXdlYnJweWtoaJp6a3hmaW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzYwNDksImV4cCI6MjA4NzQxMjA0OX0.CXp8wUsuV4R2_-kUkGhJ9vH159fCGgnIfVTQkTxDNRo
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

## Build Configuration

### Frontend Build Command
```
npm run build
```

### Backend Build Command
```
pip install -r requirements.txt
```

### Backend Start Command
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Deployment URLs

- Frontend: https://vidyamitra-frontend-uqfo.onrender.com
- Backend: https://vidyamitra-backend-uprd.onrender.com
- API Docs: https://vidyamitra-backend-uprd.onrender.com/docs

## Troubleshooting

### 1. Environment Variables Not Loading
- Ensure all environment variables are set in Render dashboard
- Check that they start with `VITE_` for frontend
- Restart the service after adding environment variables

### 2. CORS Issues
- Backend CORS is configured to allow frontend domain
- Check backend logs for CORS errors

### 3. API Connection Issues
- Verify backend is running and accessible
- Check API URL in environment variables
- Test API endpoints directly

### 4. Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are installed
- Verify build command is correct
