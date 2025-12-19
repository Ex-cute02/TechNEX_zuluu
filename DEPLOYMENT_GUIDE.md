# 🚀 Complete Deployment Guide

## 🎯 Quick Deploy (Recommended for Hackathon)

### Option 1: Separate Services (Easiest)

**Backend on Railway:**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
# Note your API URL: https://your-app.railway.app
```

**Frontend on Vercel:**
```bash
cd frontend
npm install -g vercel
# Update API URL in lib/api.ts to your Railway URL
vercel --prod
```

### Option 2: Full Docker Stack

**Deploy everything together:**
```bash
# Build and run full stack
docker-compose -f docker-compose.full.yml up --build -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Production: Configure nginx for domain
```

## 🌐 Cloud Deployment Options

### 1. Railway (Backend) + Vercel (Frontend)
**Pros:** Free tiers, easy setup, great for demos
**Time:** 10 minutes

### 2. Render (Full Stack)
**Pros:** Can host both services, free tier
**Time:** 15 minutes

### 3. AWS/GCP/Azure
**Pros:** Production ready, scalable
**Time:** 30+ minutes

### 4. DigitalOcean App Platform
**Pros:** Simple, cost-effective
**Time:** 20 minutes

## 📋 Pre-Deployment Checklist

- ✅ Backend running locally (port 8000)
- ✅ Frontend running locally (port 3000)
- ✅ API calls working between frontend/backend
- ✅ All dependencies in requirements.txt/package.json
- ✅ Environment variables configured
- ✅ CORS settings updated for production URLs

## 🔧 Environment Configuration

### Backend (.env)
```bash
HOST=0.0.0.0
PORT=8000
RELOAD=false
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🚀 Step-by-Step: Railway + Vercel

### Step 1: Deploy Backend to Railway

1. **Prepare backend:**
   ```bash
   cd backend
   # Ensure requirements.txt is complete
   pip freeze > requirements.txt
   ```

2. **Deploy to Railway:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Configure Railway:**
   - Set environment variables in Railway dashboard
   - Note your API URL: `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Update API URL:**
   ```typescript
   // In frontend/src/lib/api.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-app.railway.app';
   ```

2. **Deploy to Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Vercel:**
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://your-app.railway.app`

### Step 3: Update CORS

Update backend CORS settings:
```python
# In backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app"  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 Testing Deployment

### Health Checks
```bash
# Backend health
curl https://your-backend-url.com/

# Frontend access
curl -I https://your-frontend-url.com/

# API integration test
curl -X POST https://your-backend-url.com/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "tenure": 3, "risk_tolerance": "moderate"}'
```

## 🔒 Production Security

### Backend Security
- [ ] Add API rate limiting
- [ ] Implement authentication
- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Add request logging

### Frontend Security
- [ ] Environment variables for sensitive data
- [ ] Content Security Policy headers
- [ ] HTTPS enforcement
- [ ] Input sanitization

## 📊 Monitoring & Analytics

### Backend Monitoring
```python
# Add to main.py
import logging
logging.basicConfig(level=logging.INFO)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
    return response
```

### Frontend Analytics
```typescript
// Add Google Analytics or similar
// In _app.tsx or layout.tsx
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update backend CORS origins
   - Check frontend API URL

2. **Build Failures**
   - Verify all dependencies
   - Check Node.js/Python versions

3. **API Connection Issues**
   - Verify environment variables
   - Check network policies

4. **Model Loading Errors**
   - Ensure model files are included
   - Check file paths and permissions

## 📈 Performance Optimization

### Backend
- Use multiple workers: `uvicorn --workers 4`
- Enable gzip compression
- Implement caching for frequent requests
- Optimize model loading

### Frontend
- Enable Next.js optimizations
- Use CDN for static assets
- Implement lazy loading
- Optimize images

## 🎉 Success Metrics

After deployment, verify:
- ✅ Frontend loads in <3 seconds
- ✅ API responses in <2 seconds
- ✅ All features working
- ✅ Mobile responsive
- ✅ Error handling works
- ✅ Analytics tracking

## 🔄 CI/CD Pipeline (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy Full Stack
on:
  push:
    branches: [main]
jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up --service backend
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🎯 Recommended Deployment Plan

**For Hackathon Demo (15 minutes):**
1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Update CORS and API URLs
4. Test all features

**For Production (1 hour):**
1. Set up Docker containers
2. Configure nginx reverse proxy
3. Add SSL certificates
4. Set up monitoring
5. Implement security measures

**Your app is ready to impress! 🚀**