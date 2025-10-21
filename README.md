# AI Web App

A minimal React + TypeScript + Vite frontend with a small Express mock backend.

## Quick setup

1. Install dependencies

```bash
npm install
```

2. Start frontend (Vite)

```bash
npm run dev
```

3. Start backend (Express)

```bash
npm run server
```

Open the frontend URL shown by Vite (usually http://localhost:5173). The frontend talks to the backend at http://localhost:3001 by default.

## Features

- Chat UI with message history and personality selector.
- Sidebar with saved chats; click to load a saved chat.
- Create/update saved chats (POST/PUT to the mock backend).
- Delete saved chats from the sidebar.
- Edit saved chat title inline from the sidebar three-dot menu.

## Backend (mock)

- Data stored in `src/backend/data/chats.json` (file-based mock DB).
- Endpoints:
  - `POST /api/chat` — get AI response for a conversation (requires GEMINI_API_KEY for real API calls)
  - `GET /api/pastChats`
  - `GET /api/pastChats/:id`
  - `POST /api/saveChat` (expects an `id` in payload)
  - `PUT /api/pastChats/:id`
  - `DELETE /api/pastChats/:id`

## Development notes

- The frontend and backend run separately in development; open two terminals and run the commands above.
- If API requests return HTML (index page) instead of JSON, confirm the backend is running and fetch URLs point at the correct host/port.

## Stretch ideas

- Move id generation to the server and return server-generated IDs on creation.
- Persist the in-progress chat to `localStorage` so it survives reloads.
- Add authentication so saved chats are per-user.
- Improve accessibility (keyboard navigation for dropdowns, ARIA labels).
- Add unit/integration tests (Vitest + Testing Library for frontend, small test harness for backend).
- Better styling and responsive UX (animations, improved card layout, dark mode).
