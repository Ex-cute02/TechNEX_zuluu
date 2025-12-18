'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart, Activity, Info, Zap } from 'lucide-react';

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState <EnhancedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('correlations');

  // ... (Keep the same useEffect logic as previous)

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24">
        
        {/* Header Section - LARGER TEXT */}
        <div className="mb-16 border-l-4 border-amber-500 pl-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 mb-6 uppercase">
            Market <span className="text-amber-600">Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl font-medium leading-relaxed">
            Deep statistical processing of cross-category performance. We analyze volatility vectors and correlation matrices to identify institutional-grade opportunities.
          </p>
        </div>

        {/* Market Insights Cards - INCREASED LABEL SIZE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <InsightCard 
            label="High Performers" 
            value={analysisData?.market_insights.high_performers_count.toString() || '0'} 
            sub="Funds with returns above 20%" 
            color="text-emerald-600"
          />
          <InsightCard 
            label="Low Cost Funds" 
            value={analysisData?.market_insights.low_cost_funds_count.toString() || '0'} 
            sub="Expense ratios below 1.0%" 
            color="text-amber-600"
          />
          <InsightCard 
            label="Market Age" 
            value={`${analysisData?.market_insights.avg_fund_age.toFixed(1)} yrs`} 
            sub="Average fund maturity" 
            color="text-slate-950"
          />
          <InsightCard 
            label="Total AUM" 
            value={`₹${((analysisData?.market_insights.total_aum || 0) / 1000000).toFixed(1)}M`} 
            sub="Assets under management" 
            color="text-blue-600"
          />
        </div>

        {/* Navigation Tabs - LARGER & BOLDEER */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden mb-12">
          <div className="flex flex-wrap border-b-2 border-slate-50 bg-slate-50/50">
            {['correlations', 'categories', 'risk-return', 'expenses'].map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-8 px-6 text-lg font-black uppercase tracking-wider transition-all ${
                  activeTab === id 
                  ? 'bg-white text-amber-600 border-b-4 border-amber-600' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {id.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="p-10 md:p-16">
            {activeTab === 'correlations' && (
              <div className="space-y-16">
                
                {/* Insights List - MUCH LARGER TEXT */}
                <div className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100">
                  <h3 className="text-2xl font-black text-amber-900 mb-6 flex items-center gap-3">
                    <Info className="w-8 h-8" /> Key Market Insights
                  </h3>
                  <ul className="space-y-6">
                    {analysisData?.correlation_analysis.key_insights.map((insight, i) => (
                      <li key={i} className="text-xl md:text-2xl text-slate-800 font-semibold leading-snug">
                        • {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {analysisData?.correlation_analysis.strong_correlations.map((corr, index) => (
                    <div key={index} className="bg-slate-50 p-10 rounded-[3rem] border-2 border-transparent hover:border-amber-200 transition-all">
                      <p className="text-lg font-black text-slate-500 uppercase tracking-widest mb-4">
                        {corr.feature1} ↔ {corr.feature2}
                      </p>
                      <div className="text-7xl font-black text-slate-950 tracking-tighter mb-4">
                        {corr.correlation.toFixed(3)}
                      </div>
                      <p className="text-xl font-bold text-amber-700 uppercase">{corr.strength} Correlation</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ... Category and other tabs follow same pattern ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components with Large Text ---

function InsightCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm hover:shadow-2xl transition-all">
      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      <p className={`text-5xl font-black tracking-tighter mb-4 ${color}`}>{value}</p>
      <p className="text-lg font-bold text-slate-600 leading-tight">{sub}</p>
    </div>
  );
}