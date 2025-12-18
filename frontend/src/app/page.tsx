import Link from 'next/link';
import { TrendingUp, BarChart3, Search, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Mutual Fund
            <span className="text-blue-600 block">Recommendations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering middle-class investors with intelligent fund selection using machine learning. 
            Get personalized recommendations based on AMC, category, investment amount, and tenure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/recommend"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Get Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              View Dashboard
              <BarChart3 className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">789</div>
              <div className="text-gray-600">Mutual Funds</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">39</div>
              <div className="text-gray-600">AMCs Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">96.4%</div>
              <div className="text-gray-600">ML Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10</div>
              <div className="text-gray-600">API Endpoints</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Investment Analysis
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to make informed mutual fund investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/recommend" className="group">
              <div className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Recommendations
                </h3>
                <p className="text-gray-600">
                  Get personalized fund recommendations based on your investment criteria
                </p>
              </div>
            </Link>

            <Link href="/dashboard" className="group">
              <div className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors">
                <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Market Dashboard
                </h3>
                <p className="text-gray-600">
                  Real-time market trends and performance analytics
                </p>
              </div>
            </Link>

            <Link href="/analysis" className="group">
              <div className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors">
                <Search className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Deep Analysis
                </h3>
                <p className="text-gray-600">
                  Advanced correlations and statistical insights
                </p>
              </div>
            </Link>

            <Link href="/funds" className="group">
              <div className="bg-orange-50 p-6 rounded-lg hover:bg-orange-100 transition-colors">
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fund Explorer
                </h3>
                <p className="text-gray-600">
                  Browse, compare, and analyze individual funds
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our AI System?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Machine Learning Powered</h3>
                    <p className="text-gray-600">Advanced ML models with 96.4% accuracy for 3-year predictions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Data</h3>
                    <p className="text-gray-600">789 mutual funds from 39 AMCs with detailed analysis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Recommendations</h3>
                    <p className="text-gray-600">Tailored suggestions based on AMC, category, amount, and tenure</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Risk Diversification</h3>
                    <p className="text-gray-600">Smart portfolio allocation for optimal risk management</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Recommendation
              </h3>
              <p className="text-gray-600 mb-6">
                Get started with a quick recommendation based on your investment preferences.
              </p>
              <Link
                href="/recommend"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Start Investing Smart
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Built for TechNEX Hackathon 2025 • AI-Powered Mutual Fund Recommendations
          </p>
        </div>
      </footer>
    </div>
  );
}