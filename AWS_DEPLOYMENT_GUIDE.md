# 🚀 AWS Lambda Deployment Guide

## Prerequisites

✅ AWS CLI installed (already done)
✅ Serverless Framework installed (already done)
✅ Node.js and npm installed (already done)

## Step 1: Configure AWS Credentials

You need an AWS account and IAM user with appropriate permissions.

### Option A: Use AWS Configure (Recommended)
```bash
aws configure
```

Enter when prompted:
- **AWS Access Key ID**: Your IAM user access key
- **AWS Secret Access Key**: Your IAM user secret key
- **Default region name**: `us-east-1`
- **Default output format**: `json`

### Option B: Use Environment Variables
```bash
set AWS_ACCESS_KEY_ID=your-access-key
set AWS_SECRET_ACCESS_KEY=your-secret-key
set AWS_DEFAULT_REGION=us-east-1
```

## Step 2: Create AWS IAM User (If needed)

1. Go to AWS Console → IAM → Users
2. Create new user: `mutual-fund-api-deployer`
3. Attach policies:
   - `AWSLambdaFullAccess`
   - `IAMFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `CloudFormationFullAccess`
   - `AmazonS3FullAccess`

## Step 3: Deploy to AWS

### Quick Deploy
```bash
cd backend
deploy.bat
```

### Manual Deploy
```bash
cd backend
serverless deploy --verbose
```

## Step 4: Update Frontend

After deployment, you'll get an API Gateway URL like:
```
https://abc123def4.execute-api.us-east-1.amazonaws.com/prod
```

Update your frontend environment variable:
```bash
# In Vercel dashboard or .env.local
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

## Step 5: Redeploy Frontend

```bash
cd frontend
vercel --prod
```

## 🔧 Troubleshooting

### Common Issues

1. **"Unable to import module 'lambda_handler'"**
   - Check that all dependencies are in requirements.txt
   - Verify lambda_handler.py is in the root directory

2. **"Task timed out after 30.00 seconds"**
   - Increase timeout in serverless.yml
   - Optimize model loading (use smaller models)

3. **"Memory limit exceeded"**
   - Increase memorySize in serverless.yml (max 10240 MB)
   - Consider using EFS for large model files

4. **CORS errors**
   - Verify frontend URL in serverless.yml cors settings
   - Check API Gateway CORS configuration

### Performance Optimization

1. **Cold Start Optimization**
   ```python
   # In lambda_handler.py
   import os
   os.environ['MPLCONFIGDIR'] = '/tmp'
   ```

2. **Model Caching**
   ```python
   # Use global variables for model caching
   _models_cache = None
   
   def get_models():
       global _models_cache
       if _models_cache is None:
           _models_cache = load_models()
       return _models_cache
   ```

## 📊 Monitoring

### CloudWatch Logs
- View logs: AWS Console → CloudWatch → Log Groups
- Log group: `/aws/lambda/mutual-fund-api-prod-api`

### API Gateway Metrics
- AWS Console → API Gateway → Your API → Monitoring
- Track requests, latency, errors

### Cost Monitoring
- AWS Console → Billing → Cost Explorer
- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$3.50 per 1M requests

## 🔒 Security Best Practices

1. **API Keys** (Optional)
   ```yaml
   # In serverless.yml
   functions:
     api:
       events:
         - http:
             private: true
   ```

2. **Rate Limiting**
   ```yaml
   # In serverless.yml
   provider:
     apiGateway:
       throttle:
         rateLimit: 100
         burstLimit: 200
   ```

3. **Environment Variables**
   ```yaml
   # In serverless.yml
   provider:
     environment:
       SECRET_KEY: ${env:SECRET_KEY}
   ```

## 🚀 Production Checklist

- [ ] AWS credentials configured
- [ ] Serverless deployment successful
- [ ] API Gateway URL obtained
- [ ] Frontend environment updated
- [ ] Frontend redeployed
- [ ] CORS working correctly
- [ ] All API endpoints responding
- [ ] Error handling working
- [ ] Monitoring set up

## 💰 Cost Estimation

**Monthly costs for moderate usage:**
- Lambda: $5-20 (depending on requests)
- API Gateway: $10-30
- CloudWatch Logs: $1-5
- **Total: ~$16-55/month**

**Free tier includes:**
- 1M Lambda requests/month
- 1M API Gateway requests/month

## 🔄 CI/CD Pipeline (Optional)

```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Serverless
        run: npm install -g serverless
      - name: Deploy
        run: |
          cd backend
          serverless deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## 🎯 Quick Start Commands

```bash
# 1. Configure AWS
aws configure

# 2. Deploy backend
cd backend
serverless deploy

# 3. Update frontend
# Copy API Gateway URL and update NEXT_PUBLIC_API_URL

# 4. Redeploy frontend
cd frontend
vercel --prod
```

**Your full-stack app will be live on AWS + Vercel! 🚀**