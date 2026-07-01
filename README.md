<div align="center">

# ₿ BitSense AI

### AI-Powered Bitcoin Price Forecasting & Market Intelligence

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![IBM AutoAI](https://img.shields.io/badge/IBM-AutoAI-052FAD?style=flat-square&logo=ibm&logoColor=white)](https://www.ibm.com/products/watson-studio/autoai)

> ⚠️ **Educational purposes only. Not financial advice.**

</div>

---

## 🚀 Overview

**BitSense AI** is a full-stack web application that combines machine learning, real-time market data, and AI-powered chat to deliver an intelligent Bitcoin analytics experience. Built as part of the **IBM Edunet** program, the platform demonstrates how modern AI/ML pipelines can power financial forecasting tools.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📈 **Live Price Dashboard** | Real-time Bitcoin price, market cap, volume, and 7-day sparkline chart via CoinGecko API |
| 🤖 **AI Price Prediction** | ML-powered forecasting model (IBM AutoAI) with confidence scores and directional signals |
| 💬 **AI Chat Assistant** | Conversational interface powered by OpenAI — ask anything about Bitcoin markets |
| 📰 **News Feed** | Curated crypto news with sentiment indicators |
| 📊 **Prediction History** | Log and review past predictions with trend analysis |

---

## 🗂️ Project Structure

```
Bitcoin edunet/
├── frontend/                  # React + Vite SPA
│   └── src/
│       ├── api/
│       │   └── client.js      # Centralized API layer (market, news, predict, chat)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── LivePriceCard.jsx
│       │   ├── SparklineChart.jsx
│       │   ├── PredictionCard.jsx
│       │   ├── NewsFeed.jsx
│       │   └── ChatInterface.jsx
│       ├── hooks/
│       │   └── useData.js     # Custom data-fetching hooks
│       └── pages/
│           ├── HomePage.jsx
│           ├── DashboardPage.jsx
│           ├── PredictPage.jsx
│           ├── ChatPage.jsx
│           └── HistoryPage.jsx
│
└── backend/                   # FastAPI Python server
    ├── app/
    │   ├── api/               # Route handlers (market, news, predict, chat)
    │   ├── services/          # External API integrations & ML inference
    │   ├── models/            # Pydantic data models
    │   ├── schemas/           # Request/response schemas
    │   └── main.py            # App entrypoint & middleware
    ├── requirements.txt
    └── .env.example
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI
- **Vite** — Lightning-fast dev server & bundler
- **Custom CSS** — Dark-mode design system with CSS variables and animations

### Backend
- **FastAPI** — High-performance async API framework
- **Uvicorn** — ASGI server
- **Pydantic v2** — Data validation & settings management
- **OpenAI SDK** — AI chat completions
- **httpx** — Async HTTP client for third-party APIs

### Integrations
- **IBM AutoAI** — Automated ML model for Bitcoin price prediction
- **CoinGecko API** — Real-time cryptocurrency market data
- **OpenAI API** — Conversational AI assistant

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.11+

---

### 1. Clone the repository

```bash
git clone <repo-url>
cd "Bitcoin edunet"
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Edit .env and fill in your API keys
```

**Required environment variables** (see `.env.example`):
```
OPENAI_API_KEY=sk-...
COINGECKO_API_KEY=...        # Optional — uses free tier by default
IBM_AUTOAI_...               # IBM Watson AutoAI credentials
```

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (proxies /api → localhost:8000)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/market` | Live Bitcoin price & market stats |
| `GET` | `/api/news?limit=10` | Latest crypto news |
| `POST` | `/api/predict` | Run ML price prediction |
| `POST` | `/api/chat` | AI chat completion |

---

## 📸 Pages at a Glance

- **Home** — Landing page with hero section and feature highlights
- **Dashboard** — Live price card, sparkline chart, and news feed
- **Predict** — Input market features and get an AI-powered price forecast
- **Chat** — Ask the AI assistant anything about Bitcoin
- **History** — Review and compare your past predictions

---

## 📄 License

This project was developed as part of the **IBM Edunet Foundation** program and is intended for **educational use only**.

---

<div align="center">

Built with ❤️ using **FastAPI** · **React** · **IBM AutoAI** · **CoinGecko**

⚠️ *Predictions are not financial advice. Always do your own research.*

</div>

