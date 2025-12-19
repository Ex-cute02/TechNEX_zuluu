#!/usr/bin/env python3
"""
Download models from GitHub releases or create dummy models for demo
"""
import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def create_dummy_models():
    """Create dummy models for demo purposes"""
    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)
    
    # Create dummy models
    for period in ["1yr", "3yr", "5yr"]:
        model = RandomForestRegressor(n_estimators=10, random_state=42)
        # Fit with dummy data
        X_dummy = np.random.rand(100, 10)
        y_dummy = np.random.rand(100) * 20  # Returns between 0-20%
        model.fit(X_dummy, y_dummy)
        
        model_path = f"models/mutual_fund_model_return_{period}.pkl"
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        print(f"✅ Created dummy model: {model_path}")

def create_dummy_data():
    """Create dummy data for demo"""
    import pandas as pd
    
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Create dummy mutual funds data
    dummy_data = {
        'scheme_name': [f'Fund {i}' for i in range(100)],
        'amc_name': [f'AMC {i//10}' for i in range(100)],
        'category': ['Equity', 'Debt', 'Hybrid'] * 34,
        'return_1yr': np.random.rand(100) * 20,
        'return_3yr': np.random.rand(100) * 15,
        'return_5yr': np.random.rand(100) * 12,
        'expense_ratio': np.random.rand(100) * 2,
        'aum': np.random.rand(100) * 1000
    }
    
    df = pd.DataFrame(dummy_data)
    df.to_csv('data/mutual_funds_cleaned.csv', index=False)
    print("✅ Created dummy data: data/mutual_funds_cleaned.csv")

if __name__ == "__main__":
    print("🚀 Setting up demo models and data...")
    create_dummy_models()
    create_dummy_data()
    print("✅ Demo setup complete!")