import React from 'react';
import { Article } from '../types';
import { ShieldCheck, Clock, MapPin, Heart, Share2, Bookmark, CheckCircle2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  onLike: (article: Article, e: React.MouseEvent) => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onLike,
  featured = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Verified</span></span>;
      case 'Live':
        return <span className="bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 animate-pulse"><span className="w-2 h-2 rounded-full bg-red-600"></span><span>LIVE</span></span>;
      case 'Developing':
        return <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Developing</span>;
      default:
        return <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  if (featured) {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col lg:flex-row"
      >
        <div className="lg:w-7/12 relative aspect-video lg:aspect-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider uppercase shadow-md">
              {article.category}
            </span>
            {getStatusBadge(article.verifiedStatus)}
          </div>
        </div>

        <div className="lg:w-5/12 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
              <span className="flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{article.county}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug mb-3">
              {article.title}
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3 leading-relaxed mb-4">
              {article.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-200">{article.author}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => onLike(article, e)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-600 transition-colors flex items-center space-x-1"
                title="Like article"
              >
                <Heart className="w-4 h-4 fill-current text-red-500" />
                <span className="font-semibold">{article.likes}</span>
              </button>

              <button 
                onClick={(e) => onToggleBookmark(article, e)}
                className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isBookmarked ? 'text-red-600' : 'text-zinc-500'}`}
                title="Save bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(article)}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-red-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] uppercase shadow">
              {article.category}
            </span>
            {getStatusBadge(article.verifiedStatus)}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-red-600 dark:text-red-400 font-bold flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{article.county}</span>
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium truncate max-w-[120px]">{article.author}</span>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={(e) => onLike(article, e)}
            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-600 transition-colors flex items-center space-x-1"
          >
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>{article.likes}</span>
          </button>

          <button 
            onClick={(e) => onToggleBookmark(article, e)}
            className={`p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isBookmarked ? 'text-red-600' : 'text-zinc-500'}`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
