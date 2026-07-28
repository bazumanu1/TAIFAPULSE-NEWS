import React, { useState } from 'react';
import { 
  Search, Sun, Moon, Bookmark, Sparkles, BarChart3, 
  Mail, Radio, Menu, X, ShieldCheck, Globe, ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAIGenerator: () => void;
  onOpenAnalytics: () => void;
  onOpenNewsletter: () => void;
  onOpenLive: () => void;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
}

const CATEGORIES = [
  "All", "Kenya", "Politics", "Business", "Technology", 
  "Sports", "Africa", "World", "Investigations", "Fact Check"
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  onOpenAIGenerator,
  onOpenAnalytics,
  onOpenNewsletter,
  onOpenLive,
  bookmarkedCount,
  onOpenBookmarks
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors shadow-xs">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onSelectCategory("All")}
            className="flex items-center space-x-2 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 dark:bg-red-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              TP
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center space-x-1">
                <span>TAIFAPULSE</span>
                <span className="text-red-600 dark:text-red-500 font-black">AI</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
                Kenya's News. Powered by Intelligence.
              </div>
            </div>
          </button>
        </div>

        {/* Center Action Controls (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 font-semibold text-xs hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>AI Newsroom Studio</span>
          </button>

          <button
            onClick={onOpenLive}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 font-semibold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live Coverage</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Intelligence</span>
          </button>

          <button
            onClick={onOpenNewsletter}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Briefs</span>
          </button>
        </div>

        {/* Right Controls: Search, Bookmarks, Theme */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search news, counties, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-44 sm:w-64 pl-9 pr-4 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          </div>

          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkedCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto scrollbar-none py-2">
          {CATEGORIES.map((cat) => {
            const active = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onOpenAIGenerator(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-semibold text-xs"
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>AI Newsroom Studio</span>
            </button>

            <button
              onClick={() => { onOpenLive(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs"
            >
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Live Coverage</span>
            </button>

            <button
              onClick={() => { onOpenAnalytics(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Intelligence</span>
            </button>

            <button
              onClick={() => { onOpenNewsletter(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Briefs</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
