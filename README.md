# ⚡ FlashAI — Smart Flashcard Generator

Upload a PDF or paste text → AI generates flashcards → Quiz yourself with spaced repetition.

## Quick Start (under 5 minutes)

### 1. Clone & install

```bash
# Root dependencies (concurrently)
npm install

# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..
```

### 2. Set up your API key

```bash
cp server/.env.example server/.env
# Open server/.env and add your Groq API key
```

### 3. Start MongoDB (optional — app works without it)

```bash
# With MongoDB installed locally:
mongod

# Or use MongoDB Atlas free tier (paste connection string in .env)
```

### 4. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000

---

## Features

- **PDF upload** — drag & drop any PDF, text is auto-extracted
- **AI generation** — Claude creates 5–20 question/answer pairs
- **3D flip cards** — smooth CSS flip animation
- **Quiz mode** — mark cards as Forgot / Hard / Got it
- **Spaced repetition** — SM-2 algorithm schedules future reviews
- **Progress dashboard** — mastery ring, card-by-card breakdown

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/upload | Upload PDF → returns extracted text |
| POST | /api/generate | Text → AI flashcards → saved to DB |
| GET | /api/decks | List all saved decks |
| GET | /api/decks/:id/cards | Get all cards for a deck |
| GET | /api/decks/:id/due | Get cards due for review today |
| POST | /api/review/:cardId | Update card's SRS state |

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Groq + Llama 3.3
- **Database**: MongoDB + Mongoose
- **PDF**: pdf-parse
- **Algorithm**: SM-2 Spaced Repetition

## Project Structure

```
flashcard-app/
├── client/src/
│   ├── components/
│   │   ├── UploadZone.jsx      # PDF upload + text paste
│   │   ├── FlashCard.jsx       # 3D flip card component
│   │   ├── FlashCardViewer.jsx # Browse all cards
│   │   ├── QuizMode.jsx        # Full-screen quiz
│   │   └── Dashboard.jsx       # Progress & stats
│   └── App.jsx                 # View router + nav
├── server/
│   ├── routes/                 # Express route handlers
│   ├── models/                 # Mongoose schemas
│   └── utils/
│       ├── aiPrompt.js         # Claude API integration
│       └── srs.js              # SM-2 algorithm
```

## Tips

- The app works without MongoDB (cards won't persist between sessions)
- For the demo, use the quick-topic buttons on the home screen
