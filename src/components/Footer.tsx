import React from 'react';
import { ShieldCheck, Globe, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-lg">
              TP
            </div>
            <span className="text-lg font-black text-white tracking-tight">TAIFAPULSE AI</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Kenya's News. Powered by Intelligence. Delivering enterprise-grade, fact-verified, and AI-assisted journalism across Kenya and East Africa.
          </p>
          <div className="text-[11px] text-zinc-500">
            © 2026 TaifaPulse Media Ltd. All rights reserved.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Newsrooms</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">National Kenya</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Nairobi & Counties</a></li>
            <li><a href="#" className="hover:text-white transition-colors">East Africa Community</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Global Affairs</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Business & Economy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">AI Journalism</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">AI Fact Verification Engine</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Autonomous News Discovery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Multilingual Translation Hub</a></li>
            <li><a href="#" className="hover:text-white transition-colors">AI Moderated Discussions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Intelligence Analytics</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Compliance & Ethics</h4>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Committed to strict journalistic transparency, source attribution, and Kenya Data Protection Act compliance.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Verified & Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
