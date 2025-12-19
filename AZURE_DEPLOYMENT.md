# 🚀 Deploy to Azure (Student Account)

## ✅ Benefits of Azure for Students

- **$100 free credits** for 12 months
- **No credit card required** for student account
- **Unlimited file size** - perfect for ML models
- **Fast performance** with dedicated resources
- **Professional deployment** for portfolio

## 🎯 Quick Deploy (5 minutes)

### Option 1: One-Click Deploy (Recommended)

```bash
# Run the automated deployment script
deploy-azure.bat
```

This will:
1. Login to your Azure account
2. Create a resource group
3. Deploy your app to Azure App Service
4. Give you a live URL

### Option 2: Manual Deployment

#### Step 1: Login to Azure
```bash
az login
```

#### Step 2: Create Resource Group
```bash
az group create --name mutual-fund-rg --location eastus
```

#### Step 3: Deploy to App Service
```bash
cd backend
az webapp up --name mutual-fund-api-demo --resource-group mutual-fund-rg --runtime "PYTHON:3.11" --sku F1
```

## 🌐 Your API URL

After deployment, your API will be available at:
```
https://mutual-fund-api-demo.azurewebsites.net
```

## 🔧 Configure Environment Variables

If needed, add environment variables:
```bash
az webapp config appsettings set --name mutual-fund-api-demo --resource-group mutual-fund-rg --settings HOST=0.0.0.0 PORT=8000 RELOAD=false
```

## 📊 Monitor Your App

### View Logs
```bash
az webapp log tail --name mutual-fund-api-demo --resource-group mutual-fund-rg
```

### Check Status
```bash
az webapp show --name mutual-fund-api-demo --resource-group mutual-fund-rg --query state
```

### Restart App
```bash
az webapp restart --name mutual-fund-api-demo --resource-group mutual-fund-rg
```

## 🎯 Update Frontend

After deployment, update your frontend:

```bash
cd frontend
echo NEXT_PUBLIC_API_URL=https://mutual-fund-api-demo.azurewebsites.net > .env.local
vercel --prod
```

Or use the automated script:
```bash
update-frontend-azure.bat
```

## 💰 Cost Breakdown

### Free Tier (F1)
- **Cost**: FREE
- **CPU**: Shared
- **Memory**: 1 GB
- **Storage**: 1 GB
- **Perfect for**: Demos, hackathons

### Basic Tier (B1) - If needed
- **Cost**: ~$13/month (covered by student credits)
- **CPU**: 1 core
- **Memory**: 1.75 GB
- **Storage**: 10 GB
- **Perfect for**: Production use

## 🚀 Advanced: Docker Deployment

For better performance with ML models:

### Build Docker Image
```bash
cd backend
docker build -t mutual-fund-api .
```

### Push to Azure Container Registry
```bash
# Create container registry
az acr create --name mutualfundacr --resource-group mutual-fund-rg --sku Basic

# Login to registry
az acr login --name mutualfundacr

# Tag and push image
docker tag mutual-fund-api mutualfundacr.azurecr.io/mutual-fund-api:latest
docker push mutualfundacr.azurecr.io/mutual-fund-api:latest
```

### Deploy Container
```bash
az container create --resource-group mutual-fund-rg --name mutual-fund-api --image mutualfundacr.azurecr.io/mutual-fund-api:latest --cpu 1 --memory 2 --registry-login-server mutualfundacr.azurecr.io --registry-username mutualfundacr --registry-password <password> --dns-name-label mutual-fund-api --ports 8000
```

## 🔒 Security Best Practices

### Enable HTTPS Only
```bash
az webapp update --name mutual-fund-api-demo --resource-group mutual-fund-rg --https-only true
```

### Add Custom Domain (Optional)
```bash
az webapp config hostname add --webapp-name mutual-fund-api-demo --resource-group mutual-fund-rg --hostname yourdomain.com
```

## 📈 Scaling

### Scale Up (More Resources)
```bash
az appservice plan update --name <plan-name> --resource-group mutual-fund-rg --sku B1
```

### Scale Out (More Instances)
```bash
az appservice plan update --name <plan-name> --resource-group mutual-fund-rg --number-of-workers 2
```

## 🧹 Cleanup (When Done)

To delete everything and stop charges:
```bash
az group delete --name mutual-fund-rg --yes
```

## 🎉 Success Checklist

- [ ] Azure CLI installed
- [ ] Logged into Azure account
- [ ] Resource group created
- [ ] App deployed successfully
- [ ] API URL working
- [ ] Frontend updated with new URL
- [ ] All features tested
- [ ] Friends can access the app

## 🆘 Troubleshooting

### Deployment Failed
```bash
# Check deployment logs
az webapp log tail --name mutual-fund-api-demo --resource-group mutual-fund-rg
```

### App Not Starting
```bash
# Check app logs
az webapp log download --name mutual-fund-api-demo --resource-group mutual-fund-rg
```

### Out of Memory
- Upgrade to B1 tier (1.75 GB RAM)
- Or use Container Instances with 2 GB RAM

### Slow Performance
- Check if models are loading correctly
- Consider using Azure Container Instances
- Upgrade to higher tier

## 🎯 Expected Performance

- **Startup Time**: 30-60 seconds (loading ML models)
- **Response Time**: <2 seconds for predictions
- **Uptime**: 99.95% SLA
- **Memory Usage**: ~500 MB with all models loaded

## 🌟 Your Full Stack

After deployment:
- **Frontend**: Vercel (https://frontend-zeta-ten-86.vercel.app)
- **Backend**: Azure (https://mutual-fund-api-demo.azurewebsites.net)
- **Database**: CSV files (included in deployment)
- **ML Models**: Real trained models with 789 funds

**Your friends can now access a production-quality AI application! 🚀**