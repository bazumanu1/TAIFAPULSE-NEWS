import React, { useState } from 'react';
import { Article, Comment } from '../types';
import { 
  X, ShieldCheck, Clock, MapPin, Heart, Share2, Bookmark, 
  Volume2, VolumeX, Sparkles, Languages, MessageSquare, Send, CheckCircle2, AlertCircle, Quote
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  onLike: (article: Article, e: React.MouseEvent) => void;
  onAddComment: (articleId: string, author: string, content: string) => Promise<void>;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onLike,
  onAddComment
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [translatedContent, setTranslatedContent] = useState<{ title: string; summary: string; content: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiSummaryBullets, setAiSummaryBullets] = useState<string[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Text to speech using browser SpeechSynthesis
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}. ${article.summary}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleTranslate = async (lang: string) => {
    setTargetLang(lang);
    if (lang === 'en') {
      setTranslatedContent(null);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/news/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          content: article.content,
          language: lang
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTranslatedContent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (aiSummaryBullets.length > 0) return;
    setIsLoadingSummary(true);
    try {
      const res = await fetch('/api/news/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: article.content })
      });
      const data = await res.json();
      if (res.ok && data.bullets) {
        setAiSummaryBullets(data.bullets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    setCommentError('');
    try {
      await onAddComment(article.id, commentAuthor || "Citizen Reader", commentText);
      setCommentText('');
      setCommentAuthor('');
    } catch (err: any) {
      setCommentError(err.message || "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const displayTitle = translatedContent?.title || article.title;
  const displaySummary = translatedContent?.summary || article.summary;
  const displayContent = translatedContent?.content || article.content;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-zinc-200 dark:border-zinc-800 max-h-[92vh]">
        
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-red-600 text-white font-black px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>{article.county}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Translate dropdown */}
            <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <Languages className="w-4 h-4 text-zinc-500 ml-1.5" />
              <select
                value={targetLang}
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none pr-2 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* Audio Read Aloud */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isPlayingAudio 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              title="Listen to Article"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? "Stop Audio" : "Listen AI"}</span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(article, e)}
              className={`p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isBookmarked ? 'text-red-600 bg-red-50 dark:bg-red-950/40' : 'text-zinc-600 dark:text-zinc-300'}`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
          
          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
              {displayTitle}
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              {displaySummary}
            </p>

            <div className="flex flex-wrap items-center justify-between py-4 border-y border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center font-bold text-red-700 dark:text-red-300">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-200">{article.author}</div>
                  <div className="text-[11px] text-zinc-500">{article.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </span>
                <span>•</span>
                <span>{new Date(article.publishedAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <div className="rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 shadow-md">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic text-center">
              {article.imageCaption}
            </p>
          </div>

          {/* AI Summary Generator Box */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800/60 p-6 rounded-2xl border border-red-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>TaifaPulse AI Key Takeaways</span>
              </div>
              {aiSummaryBullets.length === 0 && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isLoadingSummary}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  {isLoadingSummary ? "Analyzing..." : "Generate AI Brief"}
                </button>
              )}
            </div>

            {aiSummaryBullets.length > 0 ? (
              <ul className="space-y-2">
                {aiSummaryBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Click generate to let our AI newsroom extract immediate bullet points and insights from this report.
              </p>
            )}
          </div>

          {/* Main Article Content */}
          <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed space-y-6">
            {displayContent.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Key Quotes & Facts */}
          {(article.keyQuotes || article.facts) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              {article.keyQuotes && article.keyQuotes.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider mb-3">
                    <Quote className="w-4 h-4" />
                    <span>Key Statements</span>
                  </div>
                  {article.keyQuotes.map((kq, idx) => (
                    <blockquote key={idx} className="space-y-2">
                      <p className="text-sm font-semibold italic text-zinc-900 dark:text-zinc-100">"{kq.quote}"</p>
                      <footer className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        — {kq.speaker}, <span className="text-red-600 dark:text-red-400">{kq.role}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}

              {article.facts && article.facts.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Fact Sheet</span>
                  </div>
                  <ul className="space-y-2">
                    {article.facts.map((fact, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Interactive Comments Section */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>Reader Discussion ({article.comments?.length || 0})</span>
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                Protected by AI Moderation
              </span>
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name / Handle"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="px-4 py-2 text-xs bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Share your perspective respectfully..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 text-xs bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              {commentError && (
                <div className="text-red-600 dark:text-red-400 text-xs flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{commentError}</span>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="flex items-center space-x-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingComment ? "Scanning & Posting..." : "Post Comment"}</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-zinc-800/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{comment.author}</span>
                      <span className="text-[10px] text-zinc-500">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic text-center py-4">
                  No comments yet. Be the first to join the conversation!
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
