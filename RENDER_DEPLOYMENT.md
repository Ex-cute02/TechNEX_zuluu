# 🚀 Deploy Backend to Render (Free)

## Step 1: Push Code to GitHub

Your code is already on GitHub at: https://github.com/Ex-cute02/TechNEX_zuluu

## Step 2: Deploy to Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Create New Web Service**
4. **Connect Repository**: Select `Ex-cute02/TechNEX_zuluu`
5. **Configure Service**:
   - **Name**: `mutual-fund-api`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python run.py`
   - **Plan**: `Free`

6. **Environment Variables**:
   ```
   HOST=0.0.0.0
   PORT=10000
   RELOAD=false
   PYTHON_VERSION=3.11.0
   ```

7. **Click Deploy**

## Step 3: Get Your API URL

After deployment, you'll get a URL like:
```
https://mutual-fund-api.onrender.com
```

## Step 4: Update Frontend

```bash
cd frontend
echo NEXT_PUBLIC_API_URL=https://mutual-fund-api.onrender.com > .env.local
vercel --prod
```

## 🎉 Your Friends Can Access!

- **Frontend**: https://frontend-zeta-ten-86.vercel.app
- **Backend**: https://mutual-fund-api.onrender.com
- **Full App**: Working together in the cloud!

## 📊 Free Tier Limits

- **750 hours/month** (enough for demos)
- **Sleeps after 15 minutes** of inactivity
- **Cold start**: ~30 seconds to wake up
- **Perfect for**: Demos, hackathons, sharing with friends

## 🔧 Alternative: One-Click Deploy

Click this button to deploy directly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ex-cute02/TechNEX_zuluu)