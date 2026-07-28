export interface TimelineItem {
  time: string;
  event: string;
}

export interface KeyQuote {
  quote: string;
  speaker: string;
  role: string;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  sentiment?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  county: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  verifiedStatus: 'Confirmed' | 'Developing' | 'Live' | 'Fact Check' | 'Opinion';
  summary: string;
  content: string;
  timeline?: TimelineItem[];
  keyQuotes?: KeyQuote[];
  facts?: string[];
  tags: string[];
  likes: number;
  shares: number;
  commentsCount: number;
  imageUrl: string;
  imageCaption: string;
  comments?: Comment[];
}

export interface FactCheckResult {
  verdict: string;
  confidenceScore: number;
  analysis: string;
  evidence: string[];
}
