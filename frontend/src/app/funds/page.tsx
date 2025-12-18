'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Filter, TrendingUp, Star, Shield, DollarSign, Calendar, Building, Users } from 'lucide-react';

interface Fund {
  scheme_name: string;
  amc_name: string;
  return_1yr: number;
  return_3yr: number;
  return_5yr: number;
  risk_level: number;
  rating: number;
  expense_ratio: number;
  fund_size: number;
  fund_age: number;
}

interface FundsResponse {
  funds: Fund[];
  total_found: number;
  filters_applied: {
    amc_name?: string;
    category?: string;
    risk_level?: number;
    min_rating?: number;
  };
}

interface TopPerformersResponse {
  top_performers: Array<{
    rank: number;
    scheme_name: string;
    amc_name: string;
    metric_value: number;
    return_1yr: number;
    return_3yr: number;
    return_5yr: number;
    risk_level: number;
    rating: number;
    expense_ratio: number;
  }>;
  metric: string;
  category: string;
  total_evaluated: number;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformersResponse | null>(null);
  const [amcs, setAMCs] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const [filters, setFilters] = useState({
    amc_name: '',
    category: '',
    risk_level: 0,
    min_rating: 0,
    limit: 50
  });

  const [topPerformersFilters, setTopPerformersFilters] = useState({
    metric: 'return_3yr',
    category: '',
    limit: 10
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [amcRes, catRes] = await Promise.all([
          api.getAMCs(),
          api.getCategories()
        ]);
        
        setAMCs(amcRes.amcs);
        setCategories(catRes.categories);
        
        // Load initial funds
        await searchFunds();
        await loadTopPerformers();
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load initial data');
      }
    };
    
    loadInitialData();
  }, []);

  const searchFunds = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getFunds({
        ...filters,
        risk_level: filters.risk_level || undefined,
        min_rating: filters.min_rating || undefined
      });
      
      const fundsData = response as FundsResponse;
      setFunds(fundsData.funds);
    } catch (error) {
      console.error('Error searching funds:', error);
      setError('Failed to search funds');
    } finally {
      setLoading(false);
    }
  };

  const loadTopPerformers = async () => {
    try {
      const response = await api.getTopPerformers(
        topPerformersFilters.metric,
        topPerformersFilters.category || undefined,
        topPerformersFilters.limit
      );
      
      setTopPerformers(response as TopPerformersResponse);
    } catch (error) {
      console.error('Error loading top performers:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTopPerformersFilterChange = (key: string, value: any) => {
    setTopPerformersFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredFunds = funds.filter(fund =>
    fund.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.amc_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K Cr`;
    }
    return `₹${amount.toFixed(0)} Cr`;
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 2) return 'text-green-600 bg-green-100';
    if (risk <= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Fund Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Browse, search, and analyze mutual funds with advanced filtering
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'search'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="h-5 w-5" />
                <span>Search & Filter</span>
              </button>
              <button
                onClick={() => setActiveTab('top-performers')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'top-performers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Top Performers</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search & Filter Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search funds by name or AMC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <select
                    value={filters.amc_name}
                    onChange={(e) => handleFilterChange('amc_name', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All AMCs</option>
                    {amcs.map(amc => (
                      <option key={amc} value={amc}>{amc}</option>
                    ))}
                  </select>

                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.risk_level}
                    onChange={(e) => handleFilterChange('risk_level', parseInt(e.target.value))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>All Risk Levels</option>
                    <option value={1}>1 - Very Low</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - Moderately High</option>
                    <option value={5}>5 - High</option>
                    <option value={6}>6 - Very High</option>
                  </select>

                  <select
                    value={filters.min_rating}
                    onChange={(e) => handleFilterChange('min_rating', parseInt(e.target.value))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>

                  <button
                    onClick={searchFunds}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    {loading ? 'Searching...' : 'Apply Filters'}
                  </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Search Results ({filteredFunds.length} funds)
                    </h3>
                    <select
                      value={filters.limit}
                      onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value={25}>Show 25</option>
                      <option value={50}>Show 50</option>
                      <option value={100}>Show 100</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFunds.map((fund, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {fund.scheme_name}
                          </h4>
                          <p className="text-gray-600 flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {fund.amc_name}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {fund.return_1yr.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">1 Year</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {fund.return_3yr.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">3 Years</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {fund.return_5yr.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">5 Years</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(fund.risk_level)}`}>
                              {fund.risk_level}/6
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <span className="text-yellow-500 font-medium">
                              {getRatingStars(fund.rating)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Expense:</span>
                            <span className="font-medium">{fund.expense_ratio.toFixed(2)}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Fund Size:</span>
                            <span className="font-medium">{formatCurrency(fund.fund_size)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredFunds.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No funds found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Performers Tab */}
            {activeTab === 'top-performers' && (
              <div className="space-y-6">
                {/* Top Performers Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={topPerformersFilters.metric}
                    onChange={(e) => handleTopPerformersFilterChange('metric', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="return_1yr">1-Year Returns</option>
                    <option value="return_3yr">3-Year Returns</option>
                    <option value="return_5yr">5-Year Returns</option>
                    <option value="sharpe">Sharpe Ratio</option>
                    <option value="alpha">Alpha</option>
                  </select>

                  <select
                    value={topPerformersFilters.category}
                    onChange={(e) => handleTopPerformersFilterChange('category', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={topPerformersFilters.limit}
                    onChange={(e) => handleTopPerformersFilterChange('limit', parseInt(e.target.value))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                  </select>

                  <button
                    onClick={loadTopPerformers}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Load Top Performers
                  </button>
                </div>

                {/* Top Performers Results */}
                {topPerformers && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Top {topPerformers.top_performers.length} Performers by {topPerformers.metric}
                      </h3>
                      <span className="text-sm text-gray-600">
                        Evaluated {topPerformers.total_evaluated} funds
                      </span>
                    </div>

                    <div className="space-y-4">
                      {topPerformers.top_performers.map((fund, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full mr-3">
                                  #{fund.rank}
                                </span>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {fund.scheme_name}
                                </h4>
                              </div>
                              <p className="text-gray-600 flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {fund.amc_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {fund.metric_value.toFixed(2)}
                                {topPerformersFilters.metric.includes('return') ? '%' : ''}
                              </div>
                              <div className="text-sm text-gray-600 capitalize">
                                {topPerformersFilters.metric.replace('_', ' ')}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-bold text-blue-600">{fund.return_1yr.toFixed(1)}%</div>
                              <div className="text-gray-600">1 Year</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600">{fund.return_3yr.toFixed(1)}%</div>
                              <div className="text-gray-600">3 Years</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-purple-600">{fund.return_5yr.toFixed(1)}%</div>
                              <div className="text-gray-600">5 Years</div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold px-2 py-1 rounded ${getRiskColor(fund.risk_level)}`}>
                                {fund.risk_level}/6
                              </div>
                              <div className="text-gray-600">Risk</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-yellow-600">{fund.expense_ratio.toFixed(2)}%</div>
                              <div className="text-gray-600">Expense</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}