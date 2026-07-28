import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Initial robust seed database for TaifaPulse News AI (Kenyan & Global News)
let articles = [
  {
    id: "tp-001",
    title: "Central Bank of Kenya Lowers Benchmark Rate to 9.25% as Inflation Cools to 3.4%",
    slug: "cbk-lowers-benchmark-rate-9-25",
    category: "Business",
    county: "Nairobi",
    author: "Dr. Evelyn Mwangi",
    authorRole: "Chief Economic Analyst",
    publishedAt: "2026-07-28T12:30:00Z",
    updatedAt: "2026-07-28T13:15:00Z",
    readTime: "4 min read",
    verifiedStatus: "Confirmed",
    summary: "The Monetary Policy Committee has slashed the central bank rate by 50 basis points, citing anchored inflation and strong foreign exchange reserves supporting the shilling.",
    content: `NAIROBI, Kenya — In a landmark policy decision announced Tuesday morning, the Monetary Policy Committee (MPC) of the Central Bank of Kenya (CBK) lowered the Central Bank Rate (CBR) from 9.75% to 9.25%. 

CBK Governor noted that overall inflation fell to 3.4% in June, comfortably within the government's target range of 5% +/- 2.5 percentage points. The stable exchange rate of the Kenya Shilling against major global currencies and robust agricultural harvests have significantly cushioned consumer prices.

"Commercial banks are expected to transmit this policy easing to credit markets immediately, lowering borrowing costs for manufacturing, housing, and micro, small, and medium enterprises (MSMEs)," said the Governor during the press briefing at CBK headquarters.

Market analysts at Nairobi Securities Exchange (NSE) reacted positively, with banking stocks rallying in early morning trading. Treasury bill yields are expected to adjust downward over the coming auction cycles, providing fiscal relief to the exchequer.`,
    timeline: [
      { time: "09:00 AM", event: "MPC emergency convocation at CBK Towers" },
      { time: "11:30 AM", event: "Governor's press conference broadcast live nationwide" },
      { time: "12:15 PM", event: "NSE banking sector indices surge by 2.4%" }
    ],
    keyQuotes: [
      {
        quote: "Commercial banks are expected to transmit this policy easing to credit markets immediately.",
        speaker: "CBK Governor",
        role: "Head of Monetary Policy"
      }
    ],
    facts: [
      "New Central Bank Rate: 9.25%",
      "Previous Rate: 9.75%",
      "Headline Inflation: 3.4% (June)",
      "Exchange Rate: Stable at ~KES 129.50 per USD"
    ],
    tags: ["CBK", "Economy", "Inflation", "Nairobi", "Banking", "Kenya Shilling"],
    likes: 342,
    shares: 128,
    commentsCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Central Bank of Kenya headquarters in Nairobi. Photo / TaifaPulse Media"
  },
  {
    id: "tp-002",
    title: "Konza Technopolis Unveils Phase 2 Smart Manufacturing & AI Research Hub",
    slug: "konza-technopolis-phase-2-ai-hub",
    category: "Technology",
    county: "Machakos",
    author: "Brian Otieno",
    authorRole: "Technology & Innovation Editor",
    publishedAt: "2026-07-28T10:00:00Z",
    updatedAt: "2026-07-28T11:20:00Z",
    readTime: "5 min read",
    verifiedStatus: "Confirmed",
    summary: "Konza Technopolis Development Authority has partnered with global tech giants to launch a state-of-the-art semiconductor packaging and AI research park.",
    content: `MACHAKOS, Kenya — Konza Technopolis marked a major milestone today as President William Ruto officially inaugurated Phase 2 of Kenya's Silicon Savannah, dedicating 500 acres exclusively to semiconductor design, quantum computing research, and AI model training infrastructure.

The new facility, dubbed the East African AI & Semiconductor Gateway, has already attracted commitments from top international technology firms and domestic startups. The hub features ultra-low-cost geothermal-powered data centers and high-speed fiber backbone connections linking Nairobi to Mombasa and regional submarine cables.

ICT Cabinet Secretary highlighted that the project is projected to create over 45,000 high-tech jobs for Kenyan software engineers, data scientists, and hardware technicians over the next three years.

"Kenya is positioning itself not merely as a consumer of digital technology, but as a primary producer of frontier AI systems tailored for African languages, agriculture, and healthcare," the CS stated during the ribbon-cutting ceremony.`,
    timeline: [
      { time: "08:30 AM", event: "Arrival of State dignitaries at Konza Technopolis" },
      { time: "10:00 AM", event: "Keynote address and unveiling of the AI Supercluster" },
      { time: "01:00 PM", event: "Partnership signing ceremony with global tech consortiums" }
    ],
    keyQuotes: [
      {
        quote: "Kenya is positioning itself as a primary producer of frontier AI systems tailored for African languages and agriculture.",
        speaker: "Cabinet Secretary for ICT",
        role: "Ministry of Information, Communications & Digital Economy"
      }
    ],
    facts: [
      "Location: Konza Technopolis, Machakos County",
      "Investment Value: KES 85 Billion",
      "Projected Jobs: 45,000 direct tech positions",
      "Power Source: 100% renewable geothermal & solar grid"
    ],
    tags: ["Konza", "Technology", "AI", "Machakos", "Silicon Savannah", "Startups"],
    likes: 890,
    shares: 412,
    commentsCount: 67,
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Artist rendering of the new Konza AI research and semiconductor campus. Photo / Handout"
  },
  {
    id: "tp-003",
    title: "Harambee Stars Camp Opens Ahead of Crucial AFCON Qualifier Clash in Kisumu",
    slug: "harambee-stars-afcon-qualifiers-kisumu",
    category: "Sports",
    county: "Kisumu",
    author: "Mercy Chebet",
    authorRole: "Senior Sports Editor",
    publishedAt: "2026-07-28T08:15:00Z",
    updatedAt: "2026-07-28T09:40:00Z",
    readTime: "3 min read",
    verifiedStatus: "Live",
    summary: "Coach Engin Firat has named a 27-man squad featuring Europe-based stars and sensational local league talents ahead of Friday's showdown at Jomo Kenyatta Stadium.",
    content: `KISUMU, Kenya — Excitement has reached fever pitch in the lakeside city of Kisumu as the national football team, Harambee Stars, arrived in camp ahead of their high-stakes Africa Cup of Nations (AFCON) qualifier against powerhouse West African opponents.

Training sessions at the newly upgraded Moi Stadium and Jomo Kenyatta International Stadium have drawn thousands of passionate football fans eager to catch a glimpse of captain Michael Olunga and rising teenage sensation Kevin Ouma.

Coach Firat expressed confidence in the squad's tactical readiness, pointing to rigorous conditioning camps and tactical drills focused on high-intensity pressing and clinical finishing.

"We have tremendous depth in both defense and midfield. Playing here in Kisumu gives us an electric twelfth man advantage with our incredible fans," Firat told sports journalists.`,
    timeline: [
      { time: "07:00 AM", event: "Harambee Stars delegation touches down at Kisumu International Airport" },
      { time: "09:30 AM", event: "Open training session at Moi Stadium, Kisumu" },
      { time: "02:00 PM", event: "Pre-match tactical press conference" }
    ],
    keyQuotes: [
      {
        quote: "Playing here in Kisumu gives us an electric twelfth man advantage with our incredible fans.",
        speaker: "Engin Firat",
        role: "Harambee Stars Head Coach"
      }
    ],
    facts: [
      "Match Venue: Jomo Kenyatta Stadium, Kisumu",
      "Date: Friday, July 31, 2026",
      "Squad Size: 27 Players",
      "Captain: Michael Olunga"
    ],
    tags: ["Harambee Stars", "Sports", "AFCON", "Kisumu", "Football", "Kenya"],
    likes: 561,
    shares: 210,
    commentsCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Fans celebrating outside the stadium in Kisumu. Photo / TaifaPulse Sports",
  },
  {
    id: "tp-004",
    title: "East African Community Finalizes Single Customs Tariff Agreement in Arusha",
    slug: "eac-single-customs-tariff-arusha",
    category: "Africa",
    county: "International",
    author: "Juma Barasa",
    authorRole: "East African Bureau Chief",
    publishedAt: "2026-07-28T07:30:00Z",
    updatedAt: "2026-07-28T08:00:00Z",
    readTime: "4 min read",
    verifiedStatus: "Confirmed",
    summary: "EAC member states have signed a historic framework eliminating non-tariff barriers across all eight partner states, creating a unified market of over 320 million citizens.",
    content: `ARUSHA, Tanzania — Ministers of Trade from the East African Community (EAC) concluded a marathon three-day summit in Arusha today by ratifying the comprehensive Single Customs and Trade Facilitation Pact.

The agreement slashes clearance times at all major border posts—including Malaba, Namanga, Busia, and Isaka—from days to under 30 minutes through blockchain-backed digital customs verification and automated single-window cargo tracking.

Cross-border traders and logistics operators lauded the move, which is expected to boost intra-EAC trade volumes by 45% within the first 12 months of implementation.

"We are tearing down artificial colonial borders and unlocking the true economic potential of East Africa's industrious citizens," declared the EAC Secretary General.`,
    timeline: [
      { time: "Yesterday 4:00 PM", event: "Technical committee review of tariff schedules" },
      { time: "Today 10:00 AM", event: "Plenary signing ceremony by EAC Council of Ministers" }
    ],
    keyQuotes: [
      {
        quote: "We are tearing down artificial colonial borders and unlocking the true economic potential of East Africa.",
        speaker: "EAC Secretary General",
        role: "East African Community Secretariat"
      }
    ],
    facts: [
      "Partner States: 8 countries (Kenya, Tanzania, Uganda, Rwanda, Burundi, DRC, South Sudan, Somalia)",
      "Market Population: 320+ Million",
      "Border Transit Goal: Under 30 minutes"
    ],
    tags: ["EAC", "Africa", "Trade", "Arusha", "Economy", "Customs"],
    likes: 412,
    shares: 195,
    commentsCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "EAC Headquarters in Arusha, Tanzania. Photo / AFP",
  },
  {
    id: "tp-005",
    title: "Global Tech Summit in Nairobi Showcases Kenya's Green Geothermal Power Grid",
    slug: "global-tech-summit-nairobi-geothermal",
    category: "World",
    county: "Nairobi",
    author: "Sarah Ochieng",
    authorRole: "Global Affairs Correspondent",
    publishedAt: "2026-07-28T06:00:00Z",
    updatedAt: "2026-07-28T07:10:00Z",
    readTime: "4 min read",
    verifiedStatus: "Confirmed",
    summary: "Delegates from 65 nations gathered in Nairobi to study Kenya's pioneering renewable energy grid, where over 92% of electricity is generated from geothermal, wind, and hydro sources.",
    content: `NAIROBI, Kenya — International climate financiers and silicon valley engineering leads converged at the Kenyatta International Convention Centre (KICC) for the annual Green Energy and Compute Summit.

Kenya's Olkaria geothermal fields in Naivasha took center stage as a global benchmark for sustainable baseload power. Tech corporations seeking zero-carbon data center locations are increasingly eyeing Kenya as the premier African destination for artificial intelligence training clusters.

United Nations Environment Programme (UNEP) representatives praised Kenya's ambitious leadership in clean energy transition, noting that the country's grid resilience serves as a blueprint for developing economies worldwide.`,
    timeline: [
      { time: "09:00 AM", event: "Opening keynote at KICC Tsavo Ballroom" },
      { time: "11:30 AM", event: "Virtual tour of Olkaria Geothermal Power Plant" }
    ],
    keyQuotes: [
      {
        quote: "Kenya proves that rapid industrialization and 100% renewable energy are not mutually exclusive.",
        speaker: "UNEP Climate Envoy",
        role: "United Nations"
      }
    ],
    facts: [
      "Renewable Share: 92%+",
      "Key Geothermal Site: Olkaria, Naivasha",
      "Attendees: 65 Countries"
    ],
    tags: ["World", "Green Energy", "Geothermal", "Nairobi", "Climate", "UNEP"],
    likes: 305,
    shares: 142,
    commentsCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Geothermal steam generation plant in the Rift Valley. Photo / TaifaPulse Green",
  }
];

let comments = [
  { id: "c-1", articleId: "tp-001", author: "Kiprop Ronoh", content: "This rate cut is long overdue! Great news for small businesses looking for affordable bank loans in Nairobi.", createdAt: "2026-07-28T13:00:00Z", likes: 14, sentiment: "positive" },
  { id: "c-2", articleId: "tp-001", author: "Amina Mohamed", content: "Let's hope commercial banks actually pass on these rates to mortgage holders as well.", createdAt: "2026-07-28T13:10:00Z", likes: 8, sentiment: "constructive" },
  { id: "c-3", articleId: "tp-002", author: "Eng. David Mutua", content: "Konza is finally taking shape. The semiconductor and AI focus is brilliant for our engineering graduates.", createdAt: "2026-07-28T11:05:00Z", likes: 22, sentiment: "positive" }
];

app.get("/api/articles", (req, res) => {
  const { category, county, search, status } = req.query;
  let result = [...articles];

  if (category && category !== "All") {
    result = result.filter(a => a.category.toLowerCase() === String(category).toLowerCase());
  }
  if (county && county !== "All") {
    result = result.filter(a => a.county.toLowerCase() === String(county).toLowerCase());
  }
  if (status && status !== "All") {
    result = result.filter(a => a.verifiedStatus.toLowerCase() === String(status).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) || 
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.content.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get("/api/articles/:id", (req, res) => {
  const article = articles.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  const articleComments = comments.filter(c => c.articleId === article.id);
  res.json({ ...article, comments: articleComments });
});

app.post("/api/news/generate", async (req, res) => {
  try {
    const { prompt, category = "Kenya", county = "Nairobi" } = req.body;
    if (!ai) {
      return res.status(500).json({ error: "Gemini AI client not initialized" });
    }

    const systemPrompt = `You are the Chief AI News Editor for TaifaPulse News AI, Kenya's premier AI newsroom. 
Generate a professional, highly factual, objective journalistic news article in JSON format based on the user's prompt or breaking news topic. 
The JSON must have this exact structure:
{
  "title": "Compelling SEO Headline",
  "summary": "2-3 sentence executive summary",
  "content": "Full detailed article with paragraphs (use \\n\\n for paragraphs)",
  "category": "${category}",
  "county": "${county}",
  "author": "AI Newsroom Bureau",
  "authorRole": "Senior Investigative AI Journalist",
  "readTime": "4 min read",
  "verifiedStatus": "Confirmed",
  "timeline": [{"time": "10:00 AM", "event": "Event description"}],
  "keyQuotes": [{"quote": "...", "speaker": "...", "role": "..."}],
  "facts": ["Fact 1", "Fact 2"],
  "tags": ["Tag1", "Tag2"],
  "imageUrl": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
  "imageCaption": "Photo / TaifaPulse Newsroom"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nTopic / Prompt: ${prompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const generated = JSON.parse(text);
    const newArticle = {
      id: `tp-gen-${Date.now()}`,
      slug: generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 12,
      shares: 4,
      commentsCount: 0,
      ...generated
    };

    articles.unshift(newArticle);
    res.json(newArticle);
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate news article" });
  }
});

app.post("/api/news/factcheck", async (req, res) => {
  try {
    const { claim } = req.body;
    if (!claim) return res.status(400).json({ error: "Claim is required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Analyze the following claim or news statement for factual accuracy, bias, and context in Kenya. Return JSON with structure: {"verdict": "Verified True / Misleading / Developing / False", "confidenceScore": 95, "analysis": "Detailed journalistic analysis...", "evidence": ["Evidence 1", "Evidence 2"]}\n\nClaim: ${claim}` }] }
      ],
      config: { responseMimeType: "application/json" }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/translate", async (req, res) => {
  try {
    const { title, summary, content, language } = req.body;
    const langName = language === 'sw' ? 'Swahili' : language === 'fr' ? 'French' : 'English';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Translate the following news article title, summary, and content into professional journalistic ${langName}. Return JSON with structure: {"title": "...", "summary": "...", "content": "..."}\n\nTitle: ${title}\n\nSummary: ${summary}\n\nContent: ${content}` }] }
      ],
      config: { responseMimeType: "application/json" }
    });

    const translated = JSON.parse(response.text || "{}");
    res.json(translated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/summarize", async (req, res) => {
  try {
    const { content } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Provide 3 concise, punchy bullet points summarizing this article's key takeaways. Return JSON with structure: {"bullets": ["bullet 1", "bullet 2", "bullet 3"]}\n\nArticle: ${content}` }] }
      ],
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/articles/:id/comments", async (req, res) => {
  try {
    const { author, content } = req.body;
    const articleId = req.params.id;

    const modResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Analyze this comment for hate speech, extreme toxicity, spam, or abusive harassment. Return JSON: {"isSafe": true/false, "reason": "...", "sentiment": "positive/neutral/negative/constructive"}\n\nComment: ${content}` }] }
      ],
      config: { responseMimeType: "application/json" }
    });

    const modResult = JSON.parse(modResponse.text || "{\"isSafe\":true,\"sentiment\":\"neutral\"}");

    if (!modResult.isSafe) {
      return res.status(400).json({ error: `Comment blocked by AI moderation: ${modResult.reason}` });
    }

    const newComment = {
      id: `c-${Date.now()}`,
      articleId,
      author: author || "Anonymous Reader",
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      sentiment: modResult.sentiment || "neutral"
    };

    comments.unshift(newComment);
    const art = articles.find(a => a.id === articleId);
    if (art) art.commentsCount = (art.commentsCount || 0) + 1;

    res.json(newComment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/articles/:id/like", (req, res) => {
  const art = articles.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!art) return res.status(404).json({ error: "Article not found" });
  art.likes = (art.likes || 0) + 1;
  res.json({ likes: art.likes });
});

app.post("/api/newsletters/generate", async (req, res) => {
  try {
    const { type = "Morning Brief" } = req.body;
    const recent = articles.slice(0, 3);
    const summaryText = recent.map(r => `- ${r.title}: ${r.summary}`).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Draft a professional email newsletter edition for TaifaPulse News titled "${type}" featuring these top stories:\n${summaryText}\nReturn JSON with: {"subject": "...", "greeting": "...", "intro": "...", "highlights": [{"title": "...", "snippet": "..."}], "closing": "..."}` }] }
      ],
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TaifaPulse News AI running on http://localhost:${PORT}`);
  });
}

startServer();
