import React from 'react';
import { Flame, Radio, ArrowRight } from 'lucide-react';

interface BreakingTickerProps {
  onSelectArticle: (id: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ onSelectArticle }) => {
  const breakingItems = [
    { id: "tp-001", title: "CBK Lowers Benchmark Rate to 9.25% as Inflation Cools to 3.4%" },
    { id: "tp-002", title: "Konza Technopolis Unveils Phase 2 Smart Manufacturing & AI Research Hub" },
    { id: "tp-003", title: "Harambee Stars Open Training Camp in Kisumu Ahead of AFCON Qualifier" },
    { id: "tp-004", title: "EAC Ministers Ratify Single Customs Tariff Eliminating Border Delays" }
  ];

  return (
    <div className="bg-red-600 dark:bg-red-900 text-white py-2 px-4 shadow-sm text-sm flex items-center justify-between overflow-hidden">
      <div className="flex items-center space-x-2 shrink-0 bg-red-700 dark:bg-red-950 px-3 py-1 rounded font-bold uppercase tracking-wider text-xs">
        <Flame className="w-4 h-4 animate-pulse text-yellow-300" />
        <span>LIVE PULSE</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative mx-4">
        <div className="whitespace-nowrap flex space-x-8 animate-marquee">
          {breakingItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelectArticle(item.id)}
              className="inline-flex items-center space-x-2 hover:underline cursor-pointer font-medium text-red-50 focus:outline-none"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block animate-ping"></span>
              <span>{item.title}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-75" />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider shrink-0 bg-red-700/80 px-2.5 py-1 rounded">
        <Radio className="w-3.5 h-3.5 text-green-300 animate-pulse" />
        <span>Nairobi • 28°C • 18:00 EAT</span>
      </div>
    </div>
  );
};
