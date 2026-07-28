import React, { useState } from 'react';
import { Mail, X, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface NewsletterModalProps {
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
  const [briefType, setBriefType] = useState('Morning Brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newsletterData, setNewsletterData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/newsletters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: briefType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewsletterData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black tracking-wide">TaifaPulse AI Newsletter Studio</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleGenerateNewsletter} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                Select Newsletter Edition
              </label>
              <select
                value={briefType}
                onChange={(e) => setBriefType(e.target.value)}
                className="w-full p-3 text-xs bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none"
              >
                <option value="Morning Brief">Morning Brief (Top Kenyan Stories)</option>
                <option value="Midday Update">Midday Update (Markets & Breaking)</option>
                <option value="Evening Digest">Evening Digest (In-Depth Analysis)</option>
                <option value="Weekend Special">Weekend Special (Investigations & Features)</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-950 text-red-700 text-xs rounded-xl">
                {error}
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
                  <span>AI Drafting Newsletter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Edition</span>
                </>
              )}
            </button>
          </form>

          {newsletterData && (
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-4 animate-fadeIn">
              <div className="border-b border-zinc-200 dark:border-zinc-700 pb-3">
                <span className="text-[10px] font-bold text-red-600 uppercase">Subject Line:</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{newsletterData.subject}</h3>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold">{newsletterData.greeting}</p>
                <p>{newsletterData.intro}</p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase text-zinc-500">Top Highlights</div>
                {newsletterData.highlights?.map((h: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{h.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{h.snippet}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-zinc-500 italic">{newsletterData.closing}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
