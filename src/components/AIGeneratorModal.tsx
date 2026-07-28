import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Article, FactCheckResult } from '../types';

interface AIGeneratorModalProps {
  onClose: () => void;
  onArticleGenerated: (article: Article) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ onClose, onArticleGenerated }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'factcheck'>('generate');
  
  // Generator state
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('Kenya');
  const [county, setCounty] = useState('Nairobi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Fact checker state
  const [claimText, setClaimText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [factResult, setFactResult] = useState<FactCheckResult | null>(null);
  const [factError, setFactError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenError('');

    try {
      const res = await fetch('/api/news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, county })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate article");

      onArticleGenerated(data);
      onClose();
    } catch (err: any) {
      setGenError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFactCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim()) return;
    setIsChecking(true);
    setFactError('');
    setFactResult(null);

    try {
      const res = await fetch('/api/news/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify claim");
      setFactResult(data);
    } catch (err: any) {
      setFactError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <h2 className="text-lg font-black tracking-wide">AI Newsroom Studio</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'generate'
                ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Generate Breaking News
          </button>
          <button
            onClick={() => setActiveTab('factcheck')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'factcheck'
                ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            AI Fact Checker
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'generate' ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Topic / Breaking Headline Prompt
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g., Kenya Revenue Authority announces new digital tax stamps for SMEs, or New solar highway project launched in Mombasa..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-4 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 text-xs bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none"
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Africa">Africa</option>
                    <option value="World">World</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">County / Location</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full p-3 text-xs bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Machakos">Machakos</option>
                  </select>
                </div>
              </div>

              {genError && (
                <div className="p-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs rounded-xl">
                  {genError}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AI Generating Journalistic Article...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Publish AI Article Instantly</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFactCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Paste Statement, Claim, or Social Media Rumor
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g., Is it true that the government has banned cash transactions above KES 500,000 effective tomorrow?"
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  className="w-full p-4 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                />
              </div>

              {factError && (
                <div className="p-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs rounded-xl">
                  {factError}
                </div>
              )}

              <button
                type="submit"
                disabled={isChecking}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing & Cross-Referencing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify Claim with AI</span>
                  </>
                )}
              </button>

              {factResult && (
                <div className="mt-4 p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">AI Fact Verdict</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      factResult.verdict.toLowerCase().includes('true') || factResult.verdict.toLowerCase().includes('verified')
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {factResult.verdict}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {factResult.analysis}
                  </p>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Evidence & Sources Checked:</div>
                    <ul className="space-y-1">
                      {factResult.evidence?.map((ev, i) => (
                        <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
