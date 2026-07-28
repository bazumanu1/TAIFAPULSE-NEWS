import React from 'react';
import { BarChart3, Users, TrendingUp, ShieldCheck, Globe, MapPin, X, ArrowUpRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const countyStats = [
    { county: "Nairobi", readers: "48,290", share: "34%" },
    { county: "Mombasa", readers: "22,140", share: "16%" },
    { county: "Kisumu", readers: "18,920", share: "14%" },
    { county: "Nakuru", readers: "14,500", share: "10%" },
    { county: "Eldoret", readers: "11,800", share: "8%" },
    { county: "Other Counties", readers: "24,850", share: "18%" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black tracking-wide">TaifaPulse Intelligence & Analytics</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Readers</span>
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">140,500</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2% from last hour
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Articles Verified</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">99.8%</div>
              <div className="text-[11px] text-zinc-500 mt-1">Zero fabricated quotes</div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg. Reading Time</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">4m 32s</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">High engagement</div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Languages Active</span>
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">7 Active</div>
              <div className="text-[11px] text-zinc-500 mt-1">English, Swahili, French...</div>
            </div>
          </div>

          {/* County Readership Heatmap Breakdown */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Readership Distribution Across Kenyan Counties</span>
            </h3>

            <div className="space-y-3">
              {countyStats.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>{item.county}</span>
                    <span>{item.readers} readers ({item.share})</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full" 
                      style={{ width: item.share }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
