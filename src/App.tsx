import React, { useState, useEffect } from 'react';
import { Article } from './types';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LiveCoverageView } from './components/LiveCoverageView';
import { NewsletterModal } from './components/NewsletterModal';
import { Footer } from './components/Footer';
import { Sparkles, MapPin, Filter, Radio, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';

const COUNTIES = [
  "All", "Nairobi", "Mombasa", "Kisumu", "Nakuru", 
  "Eldoret", "Kiambu", "Machakos", "International"
];

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentCounty, setCurrentCounty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Modals
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Bookmarks state (persisted in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('taifapulse_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchArticles();
  }, [currentCategory, currentCounty, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentCategory !== "All") params.append("category", currentCategory);
      if (currentCounty !== "All") params.append("county", currentCounty);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(article.id)) {
      updated = bookmarkedIds.filter(id => id !== article.id);
    } else {
      updated = [...bookmarkedIds, article.id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('taifapulse_bookmarks', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/articles/${article.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setArticles(prev => prev.map(a => a.id === article.id ? { ...a, likes: data.likes } : a));
        if (selectedArticle && selectedArticle.id === article.id) {
          setSelectedArticle(prev => prev ? { ...prev, likes: data.likes } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (articleId: string, author: string, content: string) => {
    const res = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Refresh selected article comments
    const detailRes = await fetch(`/api/articles/${articleId}`);
    const detailData = await detailRes.json();
    if (detailRes.ok) {
      setSelectedArticle(detailData);
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, commentsCount: detailData.comments?.length || a.commentsCount } : a));
    }
  };

  const handleArticleGenerated = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    setSelectedArticle(newArticle);
  };

  // Filter bookmarked articles if bookmark tab active
  const displayedArticles = showBookmarksOnly
    ? articles.filter(a => bookmarkedIds.includes(a.id))
    : articles;

  const featuredArticle = displayedArticles.length > 0 ? displayedArticles[0] : null;
  const remainingArticles = displayedArticles.length > 1 ? displayedArticles.slice(1) : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Breaking News Ticker */}
      <BreakingTicker onSelectArticle={async (id) => {
        try {
          const res = await fetch(`/api/articles/${id}`);
          const data = await res.json();
          if (res.ok) setSelectedArticle(data);
        } catch (e) {
          console.error(e);
        }
      }} />

      {/* Main Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => { setCurrentCategory(cat); setShowBookmarksOnly(false); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAIGenerator={() => setAiGeneratorOpen(true)}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
        onOpenNewsletter={() => setNewsletterOpen(true)}
        onOpenLive={() => setLiveOpen(true)}
        bookmarkedCount={bookmarkedIds.length}
        onOpenBookmarks={() => setShowBookmarksOnly(true)}
      />

      {/* Sub-header: County Selector & Bookmarks toggle */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* County Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>County:</span>
            </span>
            {COUNTIES.map(county => (
              <button
                key={county}
                onClick={() => setCurrentCounty(county)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  currentCounty === county
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {county}
              </button>
            ))}
          </div>

          {/* Quick Stats / Bookmarks indicator */}
          <div className="flex items-center space-x-3 shrink-0">
            {showBookmarksOnly && (
              <button
                onClick={() => setShowBookmarksOnly(false)}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
              >
                <span>← Show All News Feed</span>
              </button>
            )}
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AI Verified Newsroom Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Loading TaifaPulse AI Intelligence Feed...</p>
          </div>
        ) : displayedArticles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
            <h3 className="text-lg font-bold">No articles found</h3>
            <p className="text-xs text-zinc-500">Try adjusting your category, county filter, or search query.</p>
            <button
              onClick={() => { setCurrentCategory("All"); setCurrentCounty("All"); setSearchQuery(""); setShowBookmarksOnly(false); }}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Lead Story */}
            {featuredArticle && !showBookmarksOnly && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>Top Lead Story</span>
                  </h2>
                  <span className="text-xs text-zinc-500 font-medium">Updated 5m ago</span>
                </div>

                <ArticleCard
                  article={featuredArticle}
                  featured={true}
                  onSelect={async (art) => {
                    try {
                      const res = await fetch(`/api/articles/${art.id}`);
                      const data = await res.json();
                      if (res.ok) setSelectedArticle(data);
                    } catch (e) {
                      setSelectedArticle(art);
                    }
                  }}
                  isBookmarked={bookmarkedIds.includes(featuredArticle.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onLike={handleLike}
                />
              </section>
            )}

            {/* Grid of Articles */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span>{showBookmarksOnly ? "Saved Bookmarks" : "Latest Reports & Dispatches"}</span>
                </h2>
                <span className="text-xs text-zinc-500 font-medium">{displayedArticles.length} stories available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(showBookmarksOnly ? displayedArticles : remainingArticles).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={async (art) => {
                      try {
                        const res = await fetch(`/api/articles/${art.id}`);
                        const data = await res.json();
                        if (res.ok) setSelectedArticle(data);
                      } catch (e) {
                        setSelectedArticle(art);
                      }
                    }}
                    isBookmarked={bookmarkedIds.includes(article.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onLike={handleLike}
                  />
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
          onToggleBookmark={handleToggleBookmark}
          onLike={handleLike}
          onAddComment={handleAddComment}
        />
      )}

      {aiGeneratorOpen && (
        <AIGeneratorModal
          onClose={() => setAiGeneratorOpen(false)}
          onArticleGenerated={handleArticleGenerated}
        />
      )}

      {analyticsOpen && (
        <AnalyticsDashboard onClose={() => setAnalyticsOpen(false)} />
      )}

      {liveOpen && (
        <LiveCoverageView onClose={() => setLiveOpen(false)} />
      )}

      {newsletterOpen && (
        <NewsletterModal onClose={() => setNewsletterOpen(false)} />
      )}

    </div>
  );
}
