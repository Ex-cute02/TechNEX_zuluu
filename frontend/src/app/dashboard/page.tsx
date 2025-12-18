'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Award, Activity } from 'lucide-react';

interface DashboardData {
  market_overview: {
    total_funds: number;
    total_amcs: number;
    avg_1yr_return: number;
    avg_3yr_return: number;
    avg_5yr_return: number;
    total_aum: number;
  };
  top_performers: Record<string, {
    fund_name: string;
    amc_name: string;
    return_3yr: number;
    risk_level: number;
    rating: number;
  }>;
  model_performance: {
    '1_year_model': { accuracy: string; rmse: number };
    '3_year_model': { accuracy: string; rmse: number };
    '5_year_model': { accuracy: string; rmse: number };
  };
}

interface MarketTrends {
  performance_distribution: {
    excellent: number;
    good: number;
    average: number;
    below_average: number;
  };
  risk_appetite: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  amc_market_share: Record<string, number>;
  market_summary: {
    total_funds: number;
    avg_3yr_return: number;
    market_volatility: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, trendsRes] = await Promise.all([
          api.getDashboardData(),
          api.getMarketTrends()
        ]);
        
        setDashboardData(dashRes as DashboardData);
        setMarketTrends(trendsRes as MarketTrends);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData || !marketTrends) {
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
  const performanceData = [
    { name: 'Excellent (>25%)', value: marketTrends.performance_distribution.excellent, color: '#10B981' },
    { name: 'Good (15-25%)', value: marketTrends.performance_distribution.good, color: '#3B82F6' },
    { name: 'Average (10-15%)', value: marketTrends.performance_distribution.average, color: '#F59E0B' },
    { name: 'Below Average (<10%)', value: marketTrends.performance_distribution.below_average, color: '#EF4444' },
  ];

  const riskData = [
    { name: 'Conservative', value: marketTrends.risk_appetite.conservative, color: '#10B981' },
    { name: 'Moderate', value: marketTrends.risk_appetite.moderate, color: '#F59E0B' },
    { name: 'Aggressive', value: marketTrends.risk_appetite.aggressive, color: '#EF4444' },
  ];

  const amcData = Object.entries(marketTrends.amc_market_share)
    .slice(0, 10)
    .map(([name, value]) => ({ name: name.replace(' Mutual Fund', ''), value }));

  const returnData = [
    { period: '1 Year', return: dashboardData.market_overview.avg_1yr_return },
    { period: '3 Years', return: dashboardData.market_overview.avg_3yr_return },
    { period: '5 Years', return: dashboardData.market_overview.avg_5yr_return },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Market Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analysis of the Indian mutual fund market
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Funds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.market_overview.total_funds}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                <TrendingUp className="inline h-4 w-4" /> Active
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AMCs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.market_overview.total_amcs}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">
                Asset Management Companies
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg 3yr Return</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.market_overview.avg_3yr_return.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                Market Performance
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AUM</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.market_overview.total_aum)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Assets Under Management
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Appetite */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Risk Appetite Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top AMCs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top AMCs by Fund Count
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={amcData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Returns */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Average Returns by Period
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={returnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
                <Line type="monotone" dataKey="return" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top Performers by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(dashboardData.top_performers).map(([category, fund]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{category}</h4>
                  <span className="text-2xl font-bold text-green-600">
                    {fund.return_3yr.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{fund.fund_name}</p>
                <p className="text-xs text-gray-500 mb-2">{fund.amc_name}</p>
                <div className="flex justify-between text-xs">
                  <span>Risk: {fund.risk_level}/6</span>
                  <span>Rating: {fund.rating}/5 ⭐</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            AI Model Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">1-Year Model</h4>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData.model_performance['1_year_model'].accuracy}
              </p>
              <p className="text-sm text-gray-600">
                RMSE: {dashboardData.model_performance['1_year_model'].rmse}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">3-Year Model</h4>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData.model_performance['3_year_model'].accuracy}
              </p>
              <p className="text-sm text-gray-600">
                RMSE: {dashboardData.model_performance['3_year_model'].rmse}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">5-Year Model</h4>
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.model_performance['5_year_model'].accuracy}
              </p>
              <p className="text-sm text-gray-600">
                RMSE: {dashboardData.model_performance['5_year_model'].rmse}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}