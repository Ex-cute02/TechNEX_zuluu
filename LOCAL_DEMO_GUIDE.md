# 🚀 Local Backend + Deployed Frontend Demo Guide

## 🎯 Architecture
```
Internet → Vercel Frontend → ngrok tunnel → Your Local Backend
```

## ✅ What's Already Done
- ✅ Frontend deployed to Vercel: https://frontend-zeta-ten-86.vercel.app
- ✅ Backend CORS configured for your frontend
- ✅ All TypeScript errors fixed
- ✅ Shadcn pie chart integrated
- ✅ ngrok installed for tunneling

## 🚀 Quick Start (3 minutes)

### Step 1: Start the Demo
```bash
start-demo.bat
```
This will:
- Start your backend on http://localhost:8000
- Start ngrok tunnel to expose it to the internet
- Open both in separate windows

### Step 2: Get ngrok URL
1. Look at the ngrok window
2. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
3. **Important**: Use the HTTPS URL, not HTTP

### Step 3: Update Frontend
```bash
update-frontend-api.bat
```
1. Paste your ngrok HTTPS URL when prompted
2. Script will update environment and redeploy frontend
3. Wait for deployment to complete

### Step 4: Test Your App
1. Visit: https://frontend-zeta-ten-86.vercel.app
2. Navigate to Dashboard - should show live data
3. Try the recommendation engine
4. Check the pie chart with real data

## 🔧 Manual Setup (if scripts don't work)

### Start Backend
```bash
cd backend
python run.py
```

### Start ngrok
```bash
ngrok http 8000
```

### Update Frontend Environment
```bash
cd frontend
echo NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io > .env.local
vercel --prod
```

## 🎪 Demo Features to Show

### 1. Dashboard Analytics
- **URL**: `/dashboard`
- **Features**: Market overview, performance pie chart, top performers
- **Data**: Live from your local ML models

### 2. Fund Recommendations
- **URL**: `/recommend`
- **Features**: AI-powered recommendations based on risk/amount/tenure
- **Demo**: Try different inputs to see ML predictions

### 3. Fund Explorer
- **URL**: `/funds`
- **Features**: Search and filter 789+ mutual funds
- **Demo**: Search for specific AMCs or fund types

### 4. What-If Analysis
- **URL**: `/what-if`
- **Features**: Compare investment scenarios
- **Demo**: Show growth projections

### 5. Theme Switching
- **Feature**: Light/Dark theme toggle in navigation
- **Demo**: Switch themes to show responsive design

## 🔍 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8000

# Expected response:
{"message":"Mutual Fund AI/ML API is running","status":"healthy","models_loaded":true}
```

### ngrok Issues
```bash
# Check ngrok status
ngrok status

# Restart ngrok
ngrok http 8000
```

### Frontend Issues
```bash
# Check environment variable
cd frontend
type .env.local

# Should show: NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io
```

### CORS Issues
If you get CORS errors:
1. Make sure you're using the HTTPS ngrok URL
2. Check that the URL is added to backend CORS settings
3. Restart backend after URL changes

## 📊 Performance Monitoring

### Backend Logs
- Watch the backend terminal for API requests
- Each request shows timing and response codes

### ngrok Dashboard
- Visit: http://localhost:4040
- See all requests going through the tunnel
- Monitor response times and errors

## 🎯 Demo Script for Presentations

### Opening (30 seconds)
"This is a full-stack AI-powered mutual fund recommendation system. The frontend is deployed on Vercel, and the backend with ML models runs locally, connected via ngrok."

### Dashboard Demo (1 minute)
1. Show market overview with 789 funds
2. Highlight the interactive pie chart (your shadcn integration!)
3. Point out the theme switching capability
4. Show real-time data from ML models

### Recommendation Engine (2 minutes)
1. Navigate to `/recommend`
2. Enter sample data: ₹50,000, 3 years, moderate risk
3. Show AI predictions and fund recommendations
4. Explain the ML models behind the scenes

### Technical Architecture (1 minute)
1. Show the ngrok tunnel in action
2. Demonstrate local backend serving the deployed frontend
3. Highlight the scalability and development benefits

### Closing (30 seconds)
"This demonstrates a production-ready architecture with local development flexibility, perfect for rapid iteration and demos."

## 💡 Pro Tips

### For Demos
- Keep the backend and ngrok windows visible
- Have sample data ready for quick input
- Test all features before presenting
- Have backup ngrok URLs ready

### For Development
- Use `start-demo.bat` for quick setup
- Monitor both frontend and backend logs
- Test API endpoints directly at your ngrok URL
- Use ngrok's web interface for debugging

### For Production
- This setup is perfect for hackathons and demos
- For production, consider AWS/Railway deployment
- Keep ngrok running during entire demo session

## 🎉 Success Metrics

After setup, you should have:
- ✅ Backend running locally with ML models loaded
- ✅ ngrok tunnel exposing backend to internet
- ✅ Frontend deployed on Vercel connecting to local backend
- ✅ All features working end-to-end
- ✅ Real-time data flow from local ML models to deployed UI

**Your hybrid local-cloud architecture is ready for demo! 🚀**