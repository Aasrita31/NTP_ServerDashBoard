# NTP Server - Global Sync Station

A full-stack application for NTP (Network Time Protocol) server management and global synchronization.

## Project Structure

```
NTP_SERVER/
├── frontend/          # React + TypeScript frontend with TanStack Start
├── backend/           # Python FastAPI backend with NTP service
├── package.json       # Root workspace configuration
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js and npm (for frontend)
- Python 3.8+ (for backend)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Features

- Real-time NTP synchronization
- World map visualization
- Country-based time tracking
- WebSocket live updates
- REST API endpoints

## Development

- Frontend: [TanStack Start](https://tanstack.com/) with React & TypeScript
- Backend: Python FastAPI with NTP service integration
- Styling: Tailwind CSS with shadcn/ui components

## License

MIT
