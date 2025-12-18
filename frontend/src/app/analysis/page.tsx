'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3, PieChart, Activity, Info } from 'lucide-react';

interface EnhancedAnalysis {
  correlation_analysis: {
    correlation_matrix: Record<string, Record<string, number>>;
    strong_correlations: Array<{
      feature1: string;
      feature2: string;
      correlation: number;
      strength: string;
    }>;
    key_insights: string[];
  };
  category_trends: Record<string, {
    count: number;
    avg_return_1yr: number;
    avg_return_3yr: number;
    avg_return_5yr: number;
    avg_risk: number;
    avg_expense: number;
    top_performer: string;
  }>;
  risk_return_analysis: Array<{
    risk_level: number;
    fund_count: number;
    avg_return_1yr: number;
    avg_return_3yr: number;
    avg_return_5yr: number;
    return_volatility: number;
  }>;
  expense_impact: Record<string, {
    count: number;
    avg_return_3yr: number;
    avg_expense: number;
  }>;
  distribution_analysis: {
    returns_1yr: {
      mean: number;
      median: number;
      std: number;
      skewness: number;
      kurtosis: number;
      percentiles: Record<string, number>;
    };
    returns_3yr: {
      mean: number;
      median: number;
      std: number;
      skewness: number;
      kurtosis: number;
      percentiles: Record<string, number>;
    };
  };
  market_insights: {
    total_aum: number;
    high_performers_count: number;
    avg_fund_age: number;
    low_cost_funds_count: number;
  };
}

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<EnhancedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('correlations');

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        setLoading(true);
        const response = await api.getEnhancedAnalysis();
        setAnalysisData(response as EnhancedAnalysis);
      } catch (error) {
        console.error('Error loading analysis:', error);
        setError('Failed to load analysis data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(analysisData.category_trends).map(([name, data]) => ({
    name,
    return_1yr: data.avg_return_1yr,
    return_3yr: data.avg_return_3yr,
    return_5yr: data.avg_return_5yr,
    risk: data.avg_risk,
    expense: data.avg_expense,
    count: data.count,
  }));

  const riskReturnData = analysisData.risk_return_analysis.map(item => ({
    risk: item.risk_level,
    return_3yr: item.avg_return_3yr,
    count: item.fund_count,
    volatility: item.return_volatility,
  }));

  const expenseData = Object.entries(analysisData.expense_impact).map(([category, data]) => ({
    category: category.replace('_', ' ').toUpperCase(),
    return: data.avg_return_3yr,
    expense: data.avg_expense,
    count: data.count,
  }));

  const tabs = [
    { id: 'correlations', label: 'Correlations', icon: Activity },
    { id: 'categories', label: 'Category Analysis', icon: BarChart3 },
    { id: 'risk-return', label: 'Risk vs Return', icon: TrendingUp },
    { id: 'expenses', label: 'Expense Impact', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Advanced Market Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Deep statistical insights and correlations in the mutual fund market
          </p>
        </div>

        {/* Market Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">High Performers</h3>
            <p className="text-2xl font-bold text-green-600">
              {analysisData.market_insights.high_performers_count}
            </p>
            <p className="text-sm text-gray-500">Funds with &gt 20% returns</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Low Cost Funds</h3>
            <p className="text-2xl font-bold text-blue-600">
              {analysisData.market_insights.low_cost_funds_count}
            </p>
            <p className="text-sm text-gray-500">Expense ratio &lt; 1%</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Fund Age</h3>
            <p className="text-2xl font-bold text-purple-600">
              {analysisData.market_insights.avg_fund_age.toFixed(1)} yrs
            </p>
            <p className="text-sm text-gray-500">Market maturity</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total AUM</h3>
            <p className="text-2xl font-bold text-orange-600">
              ₹{(analysisData.market_insights.total_aum / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500">Assets under management</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Correlations Tab */}
            {activeTab === 'correlations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Strong Correlations Found
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisData.correlation_analysis.strong_correlations.map((corr, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {corr.feature1} ↔ {corr.feature2}
                          </span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            corr.strength === 'strong' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {corr.strength}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {corr.correlation.toFixed(3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Insights
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {analysisData.correlation_analysis.key_insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Distribution Analysis */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Return Distribution Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">1-Year Returns</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mean:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_1yr.mean.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Median:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_1yr.median.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Std Dev:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_1yr.std.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>90th Percentile:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_1yr.percentiles['90th'].toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">3-Year Returns</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mean:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_3yr.mean.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Median:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_3yr.median.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Std Dev:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_3yr.std.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>90th Percentile:</span>
                          <span className="font-medium">{analysisData.distribution_analysis.returns_3yr.percentiles['90th'].toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Analysis Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Returns by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="return_1yr" fill="#3B82F6" name="1 Year" />
                      <Bar dataKey="return_3yr" fill="#10B981" name="3 Years" />
                      <Bar dataKey="return_5yr" fill="#8B5CF6" name="5 Years" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analysisData.category_trends).map(([category, data]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Fund Count:</span>
                          <span className="font-medium">{data.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg 3yr Return:</span>
                          <span className="font-medium text-green-600">{data.avg_return_3yr.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Risk:</span>
                          <span className="font-medium">{data.avg_risk.toFixed(1)}/6</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Expense:</span>
                          <span className="font-medium">{data.avg_expense.toFixed(2)}%</span>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">Top Performer:</p>
                          <p className="font-medium text-xs">{data.top_performer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk vs Return Tab */}
            {activeTab === 'risk-return' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Risk vs Return Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart data={riskReturnData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="risk" name="Risk Level" />
                      <YAxis dataKey="return_3yr" name="3-Year Return %" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [
                          name === 'return_3yr' ? `${value}%` : value,
                          name === 'return_3yr' ? '3-Year Return' : name
                        ]}
                      />
                      <Scatter dataKey="return_3yr" fill="#8B5CF6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisData.risk_return_analysis.map((item) => (
                    <div key={item.risk_level} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Risk Level {item.risk_level}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Fund Count:</span>
                          <span className="font-medium">{item.fund_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg 3yr Return:</span>
                          <span className="font-medium text-green-600">{item.avg_return_3yr.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volatility:</span>
                          <span className="font-medium">{item.return_volatility.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expense Impact Tab */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Expense Ratio Impact on Returns
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="return" fill="#10B981" name="Avg Return %" />
                      <Bar yAxisId="right" dataKey="expense" fill="#F59E0B" name="Avg Expense %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(analysisData.expense_impact).map(([category, data]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                        {category.replace('_', ' ')} Cost
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Fund Count:</span>
                          <span className="font-medium">{data.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Return:</span>
                          <span className="font-medium text-green-600">{data.avg_return_3yr.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Expense:</span>
                          <span className="font-medium text-orange-600">{data.avg_expense.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Finding</h4>
                  <p className="text-blue-800 text-sm">
                    Lower expense ratios generally correlate with better net returns for investors. 
                    Consider expense ratios when making investment decisions, as they directly impact your returns over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}