'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, DollarSign, Calendar, Shield, Star, Building } from 'lucide-react';

interface AMC {
  amcs: string[];
}

interface Category {
  categories: Array<{ name: string; count: number }>;
}

interface Recommendation {
  scheme_name: string;
  amc_name: string;
  predicted_return: string;
  suggested_allocation: string;
  risk_level: string;
  rating: string;
  allocation_percentage: string;
  comprehensive_score: string;
}

interface RecommendationResponse {
  status: string;
  message: string;
  recommendations: Recommendation[];
  investment_summary: {
    total_amount: number;
    investment_horizon: string;
    risk_tolerance: string;
    category_preference?: string;
  };
}

export default function RecommendPage() {
  const [amcs, setAMCs] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amc_name: '',
    category: '',
    amount: 50000,
    tenure: 3,
    risk_tolerance: 'moderate'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [amcRes, catRes] = await Promise.all([
          api.getAMCs(),
          api.getCategories()
        ]);
        
        setAMCs(amcRes.amcs);
        setCategories(catRes.categories);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load dropdown data');
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getRecommendations(formData);
      setRecommendations(response as RecommendationResponse);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Fund Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized mutual fund recommendations based on your investment criteria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Investment Preferences
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* AMC Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Preferred AMC (Optional)
                  </label>
                  <select 
                    value={formData.amc_name}
                    onChange={(e) => setFormData({...formData, amc_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any AMC</option>
                    {amcs.map(amc => (
                      <option key={amc} value={amc}>{amc}</option>
                    ))}
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Fund Category (Optional)
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Category</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name} ({cat.count} funds)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Investment Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="100"
                    max="10000000"
                    step="1000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum: ₹100 • Maximum: ₹1 Crore
                  </p>
                </div>

                {/* Investment Tenure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Investment Tenure
                  </label>
                  <select 
                    value={formData.tenure}
                    onChange={(e) => setFormData({...formData, tenure: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 Year</option>
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years</option>
                  </select>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Risk Tolerance
                  </label>
                  <select 
                    value={formData.risk_tolerance}
                    onChange={(e) => setFormData({...formData, risk_tolerance: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="conservative">Conservative (Low Risk)</option>
                    <option value="moderate">Moderate (Medium Risk)</option>
                    <option value="aggressive">Aggressive (High Risk)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {recommendations && (
              <div className="space-y-6">
                {/* Investment Summary */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Investment Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(recommendations.investment_summary.total_amount)}
                      </div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {recommendations.investment_summary.investment_horizon}
                      </div>
                      <div className="text-sm text-gray-600">Tenure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 capitalize">
                        {recommendations.investment_summary.risk_tolerance}
                      </div>
                      <div className="text-sm text-gray-600">Risk Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {recommendations.recommendations.length}
                      </div>
                      <div className="text-sm text-gray-600">Recommendations</div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`p-4 rounded-lg ${
                  recommendations.status === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className={`text-sm ${
                    recommendations.status === 'success' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {recommendations.message}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Recommended Funds
                  </h3>
                  
                  {recommendations.recommendations.map((fund, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {fund.scheme_name}
                          </h4>
                          <p className="text-gray-600">{fund.amc_name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {fund.predicted_return}
                          </div>
                          <div className="text-sm text-gray-600">Predicted Return</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <div className="font-semibold">{fund.suggested_allocation}</div>
                            <div className="text-sm text-gray-600">Allocation</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-orange-500 mr-2" />
                          <div>
                            <div className="font-semibold">{fund.risk_level}</div>
                            <div className="text-sm text-gray-600">Risk Level</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <div>
                            <div className="font-semibold">{fund.rating}</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                          <div>
                            <div className="font-semibold">{fund.allocation_percentage}</div>
                            <div className="text-sm text-gray-600">Portfolio %</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">
                          <strong>Comprehensive Score:</strong> {fund.comprehensive_score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!recommendations && !loading && (
              <div className="bg-white p-12 rounded-lg shadow-lg text-center">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready for Recommendations
                </h3>
                <p className="text-gray-600">
                  Fill out the form on the left to get personalized mutual fund recommendations powered by AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}