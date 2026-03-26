# SkillRadar — Internship Intelligence Platform

A real-time skill demand analytics platform that tracks internship trends across multiple job platforms using automated scraping, NLP skill extraction, and a premium React dashboard.

## ✨ Features

- **📊 Skill Dashboard** — Real-time stats across 10+ platforms with domain filtering
- **📈 Trend Analysis** — Track skill demand over time with interactive charts
- **🎯 Skill Gap Analysis** — Compare your skills against market demand
- **💼 Jobs Browser** — Search and filter jobs with AI-powered match scores
- **📋 Application Tracker** — Drag-and-drop Kanban board
- **🔔 Smart Alerts** — Configurable alerts for skill trends
- **🌙 Dark/Light Mode** — Premium UI with smooth theme transitions

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Recharts + Lucide Icons |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Scraping | Python + requests + feedparser |
| NLP | Keyword extraction (200+ tech skills) |
| Deployment | Vercel (frontend) + GitHub Actions (scraper) |

## 🚀 Quick Start

### Frontend
```bash
cd frontend
cp .env.example .env     # Add your Supabase credentials
npm install
npm run dev              # → http://localhost:5173
```

### Scraper
```bash
cd scraper
pip install -r requirements.txt
# Add scraper/.env with SUPABASE_SERVICE_KEY
python main.py --dry-run   # Test without DB writes
python main.py             # Full run: fetch → extract → push
```

### Data Sources
| Source | Method | Cost |
|--------|--------|------|
| Remotive | JSON API | Free |
| Himalayas | JSON API | Free |
| Arbeitnow | JSON API | Free |
| Jobicy | JSON API | Free |
| RemoteOK | JSON endpoint | Free |
| WeWorkRemotely | RSS | Free |
| Internshala | Public pages | Free |

## 📁 Project Structure
```
skill-radar/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/   # Sidebar, Navbar
│   │   ├── pages/        # Dashboard, Trends, SkillGap, Jobs, Tracker, Alerts
│   │   ├── hooks/        # Supabase data hooks with mock fallback
│   │   └── data/         # Mock data for development
│   └── vercel.json       # SPA routing config
├── scraper/           # Python scraping pipeline
│   ├── sources/          # 7 source scrapers
│   ├── skills/           # NLP skill extractor + dictionary
│   ├── push_to_supabase.py  # Dedup + upsert
│   └── main.py           # Orchestrator
├── supabase/          # Database migrations
└── .github/workflows/ # Automated daily scraping
```

## 📊 Pipeline Stats (per run)
- **286+ jobs** fetched from 5-7 sources
- **1,000+ skills** extracted via NLP
- **184 unique skills** tracked
- **~8 min** total pipeline time
