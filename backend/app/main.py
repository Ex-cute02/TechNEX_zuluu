from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
from .diversified_portfolio_system import DiversifiedMutualFundSystem
from .model_loader_utility import MutualFundModelLoader
import json
import warnings
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import base64
import io
warnings.filterwarnings('ignore')

# Initialize FastAPI app
app = FastAPI(
    title="Mutual Fund AI/ML API",
    description="AI-powered mutual fund analysis and recommendation system",
    version="1.0.0"
)

# Add CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models and data
ml_system = None
model_loader = None
funds_data = None

@app.on_event("startup")
async def startup_event():
    """Initialize ML models and load data on startup"""
    global ml_system, model_loader, funds_data
    
    try:
        # Load ML system
        ml_system = DiversifiedMutualFundSystem(load_from_pickle=True)
        
        # Load individual models
        model_loader = MutualFundModelLoader()
        model_loader.load_all_models()
        
        # Load funds data
        import os
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'mutual_funds_cleaned.csv')
        funds_data = pd.read_csv(data_path)
        
        print("✅ ML models and data loaded successfully")
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        raise e

# Pydantic models for request/response
class RecommendationRequest(BaseModel):
    amc_name: Optional[str] = None
    category: Optional[str] = None
    amount: int
    tenure: int  # in years
    risk_tolerance: str = "moderate"

class FundFilterRequest(BaseModel):
    amc_name: Optional[str] = None
    category: Optional[str] = None
    risk_level: Optional[int] = None
    min_rating: Optional[int] = None
    limit: int = 50

class ForecastRequest(BaseModel):
    fund_name: str
    horizon: int = 5

class AnalysisRequest(BaseModel):
    analysis_type: str  # 'correlation', 'pca', 'trends', 'performance'
    category: Optional[str] = None
    amc_name: Optional[str] = None

class ComparisonRequest(BaseModel):
    fund_names: List[str]
    metrics: List[str] = ["return_1yr", "return_3yr", "return_5yr", "risk_level", "expense_ratio"]

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Mutual Fund AI/ML API is running",
        "status": "healthy",
        "models_loaded": ml_system is not None and model_loader is not None
    }

@app.get("/api/descriptive-analysis")
async def get_descriptive_analysis():
    """Get comprehensive descriptive analysis of mutual funds data"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        # Basic statistics
        total_funds = len(funds_data)
        unique_amcs = funds_data['amc_name'].nunique()
        
        # Category distribution
        category_cols = [col for col in funds_data.columns if col.startswith('category_')]
        category_dist = {}
        for col in category_cols:
            category_name = col.replace('category_', '')
            count = funds_data[funds_data[col] == True].shape[0]
            if count > 0:
                category_dist[category_name] = count
        
        # Risk level distribution
        risk_dist = funds_data['risk_level'].value_counts().to_dict()
        
        # Rating distribution
        rating_dist = funds_data['rating'].value_counts().to_dict()
        
        # Return statistics
        return_stats = {
            '1_year': {
                'mean': float(funds_data['return_1yr'].mean()),
                'median': float(funds_data['return_1yr'].median()),
                'std': float(funds_data['return_1yr'].std()),
                'min': float(funds_data['return_1yr'].min()),
                'max': float(funds_data['return_1yr'].max())
            },
            '3_year': {
                'mean': float(funds_data['return_3yr'].mean()),
                'median': float(funds_data['return_3yr'].median()),
                'std': float(funds_data['return_3yr'].std()),
                'min': float(funds_data['return_3yr'].min()),
                'max': float(funds_data['return_3yr'].max())
            },
            '5_year': {
                'mean': float(funds_data['return_5yr'].mean()),
                'median': float(funds_data['return_5yr'].median()),
                'std': float(funds_data['return_5yr'].std()),
                'min': float(funds_data['return_5yr'].min()),
                'max': float(funds_data['return_5yr'].max())
            }
        }
        
        # Top performing AMCs
        amc_performance = funds_data.groupby('amc_name')['return_3yr'].mean().sort_values(ascending=False).head(10)
        top_amcs = {amc: float(performance) for amc, performance in amc_performance.items()}
        
        # Expense ratio analysis
        expense_stats = {
            'mean': float(funds_data['expense_ratio'].mean()),
            'median': float(funds_data['expense_ratio'].median()),
            'low_cost_funds': int((funds_data['expense_ratio'] < 1.0).sum()),
            'high_cost_funds': int((funds_data['expense_ratio'] > 2.0).sum())
        }
        
        return {
            "summary": {
                "total_funds": total_funds,
                "unique_amcs": unique_amcs,
                "data_points": total_funds * len(funds_data.columns)
            },
            "category_distribution": category_dist,
            "risk_distribution": risk_dist,
            "rating_distribution": rating_dist,
            "return_statistics": return_stats,
            "top_performing_amcs": top_amcs,
            "expense_analysis": expense_stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")

@app.get("/api/amcs")
async def get_amcs():
    """Get list of all AMC names"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        amcs = sorted(funds_data['amc_name'].unique().tolist())
        return {"amcs": amcs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching AMCs: {str(e)}")

@app.get("/api/categories")
async def get_categories():
    """Get list of all fund categories"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        category_cols = [col for col in funds_data.columns if col.startswith('category_')]
        categories = []
        
        for col in category_cols:
            category_name = col.replace('category_', '')
            count = funds_data[funds_data[col] == True].shape[0]
            if count > 0:
                categories.append({
                    "name": category_name,
                    "count": count
                })
        
        return {"categories": sorted(categories, key=lambda x: x['count'], reverse=True)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@app.post("/api/funds")
async def get_funds(filter_request: FundFilterRequest):
    """Get filtered list of funds based on criteria"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        df_filtered = funds_data.copy()
        
        # Apply filters
        if filter_request.amc_name:
            df_filtered = df_filtered[df_filtered['amc_name'] == filter_request.amc_name]
        
        if filter_request.category:
            category_col = f'category_{filter_request.category}'
            if category_col in df_filtered.columns:
                df_filtered = df_filtered[df_filtered[category_col] == True]
        
        if filter_request.risk_level:
            df_filtered = df_filtered[df_filtered['risk_level'] == filter_request.risk_level]
        
        if filter_request.min_rating:
            df_filtered = df_filtered[df_filtered['rating'] >= filter_request.min_rating]
        
        # Limit results
        df_filtered = df_filtered.head(filter_request.limit)
        
        # Prepare response
        funds = []
        for _, fund in df_filtered.iterrows():
            funds.append({
                "scheme_name": fund['scheme_name'],
                "amc_name": fund['amc_name'],
                "return_1yr": float(fund['return_1yr']),
                "return_3yr": float(fund['return_3yr']),
                "return_5yr": float(fund['return_5yr']),
                "risk_level": int(fund['risk_level']),
                "rating": int(fund['rating']),
                "expense_ratio": float(fund['expense_ratio']),
                "fund_size": float(fund['fund_size']),
                "fund_age": float(fund['fund_age'])
            })
        
        return {
            "funds": funds,
            "total_found": len(df_filtered),
            "filters_applied": {
                "amc_name": filter_request.amc_name,
                "category": filter_request.category,
                "risk_level": filter_request.risk_level,
                "min_rating": filter_request.min_rating
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering funds: {str(e)}")

@app.post("/api/recommend")
async def get_recommendations(request: RecommendationRequest):
    """Get AI-powered fund recommendations based on specific inputs"""
    
    if ml_system is None:
        raise HTTPException(status_code=500, detail="ML system not loaded")
    
    try:
        # Map category to our system's format
        category_mapping = {
            "Equity": "Equity",
            "Hybrid": "Hybrid", 
            "Debt": "Debt",
            "Other": "Other"
        }
        
        category_preference = category_mapping.get(request.category) if request.category else None
        
        # Generate recommendations
        plan = ml_system.generate_investment_plan(
            investment_amount=request.amount,
            horizon=request.tenure,
            risk_tolerance=request.risk_tolerance,
            category_preference=category_preference
        )
        
        if plan['status'] != 'success':
            raise HTTPException(status_code=400, detail=plan['message'])
        
        # Filter by AMC if specified
        recommendations = plan['recommendations']
        if request.amc_name:
            recommendations = [rec for rec in recommendations if rec['amc_name'] == request.amc_name]
            
            if not recommendations:
                # If no recommendations for specific AMC, get alternative suggestions
                alternative_plan = ml_system.generate_investment_plan(
                    investment_amount=request.amount,
                    horizon=request.tenure,
                    risk_tolerance=request.risk_tolerance,
                    category_preference=category_preference
                )
                
                return {
                    "status": "partial_match",
                    "message": f"No suitable funds found for {request.amc_name}. Showing alternative recommendations.",
                    "recommendations": alternative_plan['recommendations'],
                    "investment_summary": alternative_plan['investment_summary']
                }
        
        return {
            "status": "success",
            "message": plan['message'],
            "recommendations": recommendations,
            "investment_summary": plan['investment_summary'],
            "diversification_analysis": plan.get('diversification_analysis', {})
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.post("/api/forecast")
async def get_fund_forecast(request: ForecastRequest):
    """Get future performance forecast for a specific fund"""
    
    if model_loader is None or funds_data is None:
        raise HTTPException(status_code=500, detail="Models or data not loaded")
    
    try:
        # Find the fund
        fund_data = funds_data[funds_data['scheme_name'] == request.fund_name]
        
        if fund_data.empty:
            raise HTTPException(status_code=404, detail="Fund not found")
        
        fund_row = fund_data.iloc[0]
        
        # Generate predictions for different horizons
        predictions = {}
        
        for horizon in [1, 3, 5]:
            try:
                predicted_return = model_loader.predict_fund_return(fund_row.to_dict(), horizon)
                predictions[f"{horizon}_year"] = {
                    "predicted_return": float(predicted_return),
                    "historical_return": float(fund_row[f'return_{horizon}yr']),
                    "confidence": "high" if horizon == 3 else "medium"  # 3-year has highest accuracy
                }
            except Exception as e:
                predictions[f"{horizon}_year"] = {
                    "error": f"Prediction failed: {str(e)}"
                }
        
        # Generate monthly projections for requested horizon
        monthly_projections = []
        if request.horizon in [1, 3, 5]:
            annual_return = predictions[f"{request.horizon}_year"]["predicted_return"]
            monthly_return = annual_return / 12
            
            for month in range(1, request.horizon * 12 + 1):
                projected_value = 100 * ((1 + monthly_return/100) ** month)
                monthly_projections.append({
                    "month": month,
                    "projected_value": round(projected_value, 2),
                    "return_percentage": round(projected_value - 100, 2)
                })
        
        return {
            "fund_name": request.fund_name,
            "amc_name": fund_row['amc_name'],
            "current_metrics": {
                "risk_level": int(fund_row['risk_level']),
                "rating": int(fund_row['rating']),
                "expense_ratio": float(fund_row['expense_ratio']),
                "fund_size": float(fund_row['fund_size']),
                "fund_age": float(fund_row['fund_age'])
            },
            "predictions": predictions,
            "monthly_projections": monthly_projections[:12] if monthly_projections else [],  # First year only
            "forecast_horizon": request.horizon
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")

@app.get("/api/enhanced-analysis")
async def get_enhanced_analysis():
    """Get enhanced descriptive analysis with correlations, trends, and patterns"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        # Correlation Analysis
        numeric_cols = ['return_1yr', 'return_3yr', 'return_5yr', 'risk_level', 
                       'expense_ratio', 'fund_size', 'fund_age', 'rating', 
                       'sharpe', 'sortino', 'alpha', 'beta']
        
        correlation_matrix = funds_data[numeric_cols].corr()
        
        # Convert to dict for JSON serialization
        correlations = {}
        for col1 in numeric_cols:
            correlations[col1] = {}
            for col2 in numeric_cols:
                correlations[col1][col2] = float(correlation_matrix.loc[col1, col2])
        
        # Key insights from correlations
        strong_correlations = []
        for i, col1 in enumerate(numeric_cols):
            for col2 in numeric_cols[i+1:]:
                corr_value = correlation_matrix.loc[col1, col2]
                if abs(corr_value) > 0.5:
                    strong_correlations.append({
                        "feature1": col1,
                        "feature2": col2,
                        "correlation": float(corr_value),
                        "strength": "strong" if abs(corr_value) > 0.7 else "moderate"
                    })
        
        # Performance Trends by Category
        category_cols = [col for col in funds_data.columns if col.startswith('category_')]
        category_trends = {}
        
        for col in category_cols:
            category_name = col.replace('category_', '')
            category_funds = funds_data[funds_data[col] == True]
            
            if not category_funds.empty:
                category_trends[category_name] = {
                    "count": len(category_funds),
                    "avg_return_1yr": float(category_funds['return_1yr'].mean()),
                    "avg_return_3yr": float(category_funds['return_3yr'].mean()),
                    "avg_return_5yr": float(category_funds['return_5yr'].mean()),
                    "avg_risk": float(category_funds['risk_level'].mean()),
                    "avg_expense": float(category_funds['expense_ratio'].mean()),
                    "top_performer": category_funds.nlargest(1, 'return_3yr').iloc[0]['scheme_name']
                }
        
        # Risk-Return Analysis
        risk_return_buckets = []
        for risk_level in range(1, 7):
            risk_funds = funds_data[funds_data['risk_level'] == risk_level]
            if not risk_funds.empty:
                risk_return_buckets.append({
                    "risk_level": risk_level,
                    "fund_count": len(risk_funds),
                    "avg_return_1yr": float(risk_funds['return_1yr'].mean()),
                    "avg_return_3yr": float(risk_funds['return_3yr'].mean()),
                    "avg_return_5yr": float(risk_funds['return_5yr'].mean()),
                    "return_volatility": float(risk_funds['return_3yr'].std())
                })
        
        # Expense Ratio Impact Analysis
        expense_buckets = {
            "low_cost": funds_data[funds_data['expense_ratio'] < 1.0],
            "medium_cost": funds_data[(funds_data['expense_ratio'] >= 1.0) & (funds_data['expense_ratio'] < 2.0)],
            "high_cost": funds_data[funds_data['expense_ratio'] >= 2.0]
        }
        
        expense_impact = {}
        for bucket_name, bucket_data in expense_buckets.items():
            if not bucket_data.empty:
                expense_impact[bucket_name] = {
                    "count": len(bucket_data),
                    "avg_return_3yr": float(bucket_data['return_3yr'].mean()),
                    "avg_expense": float(bucket_data['expense_ratio'].mean())
                }
        
        # Fund Age vs Performance
        age_performance = []
        age_bins = [(0, 3), (3, 5), (5, 10), (10, 20)]
        for min_age, max_age in age_bins:
            age_funds = funds_data[(funds_data['fund_age'] >= min_age) & (funds_data['fund_age'] < max_age)]
            if not age_funds.empty:
                age_performance.append({
                    "age_range": f"{min_age}-{max_age} years",
                    "count": len(age_funds),
                    "avg_return_3yr": float(age_funds['return_3yr'].mean()),
                    "avg_stability": float(age_funds['stability_score'].mean())
                })
        
        # Statistical Distribution Analysis
        distribution_analysis = {
            "returns_1yr": {
                "mean": float(funds_data['return_1yr'].mean()),
                "median": float(funds_data['return_1yr'].median()),
                "std": float(funds_data['return_1yr'].std()),
                "skewness": float(stats.skew(funds_data['return_1yr'].dropna())),
                "kurtosis": float(stats.kurtosis(funds_data['return_1yr'].dropna())),
                "percentiles": {
                    "25th": float(funds_data['return_1yr'].quantile(0.25)),
                    "50th": float(funds_data['return_1yr'].quantile(0.50)),
                    "75th": float(funds_data['return_1yr'].quantile(0.75)),
                    "90th": float(funds_data['return_1yr'].quantile(0.90))
                }
            },
            "returns_3yr": {
                "mean": float(funds_data['return_3yr'].mean()),
                "median": float(funds_data['return_3yr'].median()),
                "std": float(funds_data['return_3yr'].std()),
                "skewness": float(stats.skew(funds_data['return_3yr'].dropna())),
                "kurtosis": float(stats.kurtosis(funds_data['return_3yr'].dropna())),
                "percentiles": {
                    "25th": float(funds_data['return_3yr'].quantile(0.25)),
                    "50th": float(funds_data['return_3yr'].quantile(0.50)),
                    "75th": float(funds_data['return_3yr'].quantile(0.75)),
                    "90th": float(funds_data['return_3yr'].quantile(0.90))
                }
            }
        }
        
        return {
            "correlation_analysis": {
                "correlation_matrix": correlations,
                "strong_correlations": strong_correlations,
                "key_insights": [
                    "Risk level strongly correlates with return volatility",
                    "Fund size shows moderate correlation with stability",
                    "Expense ratio has negative correlation with net returns"
                ]
            },
            "category_trends": category_trends,
            "risk_return_analysis": risk_return_buckets,
            "expense_impact": expense_impact,
            "age_performance": age_performance,
            "distribution_analysis": distribution_analysis,
            "market_insights": {
                "total_aum": float(funds_data['fund_size'].sum()),
                "avg_fund_age": float(funds_data['fund_age'].mean()),
                "high_performers_count": int((funds_data['return_3yr'] > 20).sum()),
                "low_cost_funds_count": int((funds_data['expense_ratio'] < 1.0).sum())
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating enhanced analysis: {str(e)}")

@app.post("/api/compare-funds")
async def compare_funds(request: ComparisonRequest):
    """Compare multiple funds side by side"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        comparison_data = []
        
        for fund_name in request.fund_names:
            fund = funds_data[funds_data['scheme_name'] == fund_name]
            
            if fund.empty:
                comparison_data.append({
                    "fund_name": fund_name,
                    "error": "Fund not found"
                })
                continue
            
            fund_row = fund.iloc[0]
            fund_info = {
                "fund_name": fund_name,
                "amc_name": fund_row['amc_name']
            }
            
            # Add requested metrics
            for metric in request.metrics:
                if metric in fund_row:
                    fund_info[metric] = float(fund_row[metric])
            
            # Add predictions if model_loader is available
            if model_loader is not None:
                try:
                    predictions = {}
                    for horizon in [1, 3, 5]:
                        pred = model_loader.predict_fund_return(fund_row.to_dict(), horizon)
                        predictions[f"predicted_{horizon}yr"] = float(pred)
                    fund_info["predictions"] = predictions
                except:
                    pass
            
            comparison_data.append(fund_info)
        
        # Calculate relative rankings
        if len(comparison_data) > 1:
            for metric in request.metrics:
                values = [f.get(metric, 0) for f in comparison_data if metric in f]
                if values:
                    max_val = max(values)
                    for fund in comparison_data:
                        if metric in fund:
                            fund[f"{metric}_rank"] = int(values.index(fund[metric]) + 1)
        
        return {
            "comparison": comparison_data,
            "metrics_compared": request.metrics,
            "total_funds": len(request.fund_names)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing funds: {str(e)}")

@app.get("/api/market-trends")
async def get_market_trends():
    """Get market-wide trends and patterns"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        # Performance distribution across market
        performance_distribution = {
            "excellent": int((funds_data['return_3yr'] > 25).sum()),
            "good": int(((funds_data['return_3yr'] > 15) & (funds_data['return_3yr'] <= 25)).sum()),
            "average": int(((funds_data['return_3yr'] > 10) & (funds_data['return_3yr'] <= 15)).sum()),
            "below_average": int((funds_data['return_3yr'] <= 10).sum())
        }
        
        # Risk appetite in market
        risk_appetite = {
            "conservative": int((funds_data['risk_level'] <= 2).sum()),
            "moderate": int(((funds_data['risk_level'] > 2) & (funds_data['risk_level'] <= 4)).sum()),
            "aggressive": int((funds_data['risk_level'] > 4).sum())
        }
        
        # AMC market share (by fund count)
        top_amcs = funds_data['amc_name'].value_counts().head(10)
        amc_market_share = {amc: int(count) for amc, count in top_amcs.items()}
        
        # Category-wise AUM distribution
        category_cols = [col for col in funds_data.columns if col.startswith('category_')]
        category_aum = {}
        
        for col in category_cols:
            category_name = col.replace('category_', '')
            category_funds = funds_data[funds_data[col] == True]
            if not category_funds.empty:
                category_aum[category_name] = float(category_funds['fund_size'].sum())
        
        # Expense ratio trends
        expense_trends = {
            "market_average": float(funds_data['expense_ratio'].mean()),
            "equity_avg": float(funds_data[funds_data['category_Equity'] == True]['expense_ratio'].mean()),
            "debt_avg": float(funds_data[funds_data['category_Debt'] == True]['expense_ratio'].mean()) if 'category_Debt' in funds_data.columns else 0,
            "hybrid_avg": float(funds_data[funds_data['category_Hybrid'] == True]['expense_ratio'].mean())
        }
        
        # Rating distribution
        rating_distribution = funds_data['rating'].value_counts().sort_index().to_dict()
        rating_distribution = {int(k): int(v) for k, v in rating_distribution.items()}
        
        # Sharpe ratio analysis (risk-adjusted returns)
        sharpe_analysis = {
            "market_avg_sharpe": float(funds_data['sharpe'].mean()),
            "high_sharpe_funds": int((funds_data['sharpe'] > 1.5).sum()),
            "negative_sharpe_funds": int((funds_data['sharpe'] < 0).sum())
        }
        
        return {
            "performance_distribution": performance_distribution,
            "risk_appetite": risk_appetite,
            "amc_market_share": amc_market_share,
            "category_aum": category_aum,
            "expense_trends": expense_trends,
            "rating_distribution": rating_distribution,
            "sharpe_analysis": sharpe_analysis,
            "market_summary": {
                "total_funds": len(funds_data),
                "total_aum": float(funds_data['fund_size'].sum()),
                "avg_3yr_return": float(funds_data['return_3yr'].mean()),
                "market_volatility": float(funds_data['standard_deviation'].mean())
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating market trends: {str(e)}")

@app.get("/api/top-performers")
async def get_top_performers(
    metric: str = "return_3yr",
    category: Optional[str] = None,
    limit: int = 10
):
    """Get top performing funds by various metrics"""
    
    if funds_data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    try:
        df_filtered = funds_data.copy()
        
        # Filter by category if specified
        if category:
            category_col = f'category_{category}'
            if category_col in df_filtered.columns:
                df_filtered = df_filtered[df_filtered[category_col] == True]
        
        # Get top performers
        if metric not in df_filtered.columns:
            raise HTTPException(status_code=400, detail=f"Invalid metric: {metric}")
        
        top_funds = df_filtered.nlargest(limit, metric)
        
        performers = []
        for _, fund in top_funds.iterrows():
            performers.append({
                "rank": len(performers) + 1,
                "scheme_name": fund['scheme_name'],
                "amc_name": fund['amc_name'],
                "metric_value": float(fund[metric]),
                "return_1yr": float(fund['return_1yr']),
                "return_3yr": float(fund['return_3yr']),
                "return_5yr": float(fund['return_5yr']),
                "risk_level": int(fund['risk_level']),
                "rating": int(fund['rating']),
                "expense_ratio": float(fund['expense_ratio'])
            })
        
        return {
            "metric": metric,
            "category": category or "All",
            "top_performers": performers,
            "total_evaluated": len(df_filtered)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top performers: {str(e)}")

@app.get("/api/dashboard-data")
async def get_dashboard_data():
    """Get summary data for dashboard overview"""
    
    if funds_data is None or model_loader is None:
        raise HTTPException(status_code=500, detail="Data or models not loaded")
    
    try:
        # Market overview
        market_overview = {
            "total_funds": len(funds_data),
            "total_amcs": funds_data['amc_name'].nunique(),
            "avg_1yr_return": float(funds_data['return_1yr'].mean()),
            "avg_3yr_return": float(funds_data['return_3yr'].mean()),
            "avg_5yr_return": float(funds_data['return_5yr'].mean()),
            "total_aum": float(funds_data['fund_size'].sum())  # Approximate
        }
        
        # Top performers by category
        category_cols = [col for col in funds_data.columns if col.startswith('category_')]
        top_performers = {}
        
        for col in category_cols:
            category_name = col.replace('category_', '')
            category_funds = funds_data[funds_data[col] == True]
            
            if not category_funds.empty:
                top_fund = category_funds.nlargest(1, 'return_3yr').iloc[0]
                top_performers[category_name] = {
                    "fund_name": top_fund['scheme_name'],
                    "amc_name": top_fund['amc_name'],
                    "return_3yr": float(top_fund['return_3yr']),
                    "risk_level": int(top_fund['risk_level']),
                    "rating": int(top_fund['rating'])
                }
        
        # Model performance metrics
        model_performance = {
            "1_year_model": {"accuracy": "51.8%", "rmse": 3.918},
            "3_year_model": {"accuracy": "96.4%", "rmse": 2.303},
            "5_year_model": {"accuracy": "78.8%", "rmse": 1.685}
        }
        
        return {
            "market_overview": market_overview,
            "top_performers": top_performers,
            "model_performance": model_performance,
            "last_updated": "2025-12-18"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating dashboard data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)