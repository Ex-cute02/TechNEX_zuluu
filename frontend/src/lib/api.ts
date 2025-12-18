const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RecommendationRequest {
  amc_name?: string;
  category?: string;
  amount: number;
  tenure: number;
  risk_tolerance: string;
}

export interface FundFilterRequest {
  amc_name?: string;
  category?: string;
  risk_level?: number;
  min_rating?: number;
  limit?: number;
}

export interface ForecastRequest {
  fund_name: string;
  horizon?: number;
}

export interface ComparisonRequest {
  fund_names: string[];
  metrics?: string[];
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request('/');
  }

  // Main recommendation engine
  async getRecommendations(params: RecommendationRequest) {
    return this.request('/api/recommend', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Data for dropdowns
  async getAMCs() {
    return this.request<{ amcs: string[] }>('/api/amcs');
  }

  async getCategories() {
    return this.request<{ categories: Array<{ name: string; count: number }> }>('/api/categories');
  }

  // Dashboard data
  async getDashboardData() {
    return this.request('/api/dashboard-data');
  }

  async getMarketTrends() {
    return this.request('/api/market-trends');
  }

  async getDescriptiveAnalysis() {
    return this.request('/api/descriptive-analysis');
  }

  async getEnhancedAnalysis() {
    return this.request('/api/enhanced-analysis');
  }

  // Fund operations
  async getFunds(filters: FundFilterRequest) {
    return this.request('/api/funds', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getForecast(params: ForecastRequest) {
    return this.request('/api/forecast', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async compareFunds(params: ComparisonRequest) {
    return this.request('/api/compare-funds', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getTopPerformers(metric = 'return_3yr', category?: string, limit = 10) {
    const params = new URLSearchParams({
      metric,
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }

    return this.request(`/api/top-performers?${params}`);
  }
}

export const api = new ApiClient();