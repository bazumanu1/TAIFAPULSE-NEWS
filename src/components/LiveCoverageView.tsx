import React from 'react';
import { Radio, X, Clock, ShieldCheck, Flame } from 'lucide-react';

interface LiveCoverageViewProps {
  onClose: () => void;
}

export const LiveCoverageView: React.FC<LiveCoverageViewProps> = ({ onClose }) => {
  const liveUpdates = [
    {
      time: "18:30 EAT",
      title: "CBK Rate Decision Transmission Update",
      content: "Commercial banks in Nairobi confirm immediate review of lending rates following this morning's 50 bps reduction by the Central Bank of Kenya."
    },
    {
      time: "17:15 EAT",
      title: "Konza Technopolis Phase 2 Groundbreaking Concludes",
      content: "Over 40 international tech delegates toured the new semiconductor packaging labs and geothermal data center sites in Machakos County."
    },
    {
      time: "15:40 EAT",
      title: "Harambee Stars Arrival in Kisumu Confirmed",
      content: "Head coach Engin Firat reports zero injury concerns as the 27-man national squad holds its first evening practice session at Moi Stadium."
    },
    {
      time: "14:00 EAT",
      title: "EAC Customs Protocol Signed in Arusha",
      content: "All eight East African Community member states have officially ratified the single customs window, slashing border transit times."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="bg-red-600 dark:bg-red-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-yellow-300 animate-pulse" />
            <h2 className="text-lg font-black tracking-wide">TaifaPulse Live Coverage & Breaking Feed</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Updates */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 dark:bg-red-950/50 p-3 rounded-xl border border-red-200 dark:border-red-900">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>Real-time newsroom wire updates synchronized continuously</span>
          </div>

          <div className="relative border-l-2 border-red-600 dark:border-red-700 ml-4 space-y-8 py-2">
            {liveUpdates.map((update, idx) => (
              <div key={idx} className="relative pl-6 space-y-2">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-2 border-white dark:border-zinc-900"></span>
                <div className="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{update.time}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{update.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{update.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
