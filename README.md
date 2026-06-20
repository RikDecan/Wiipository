# Wiipository
Webtool to manage your Nintendo Wii Games!

## In order to run

### Docker (recommended)

```bash
docker compose up --build
```

Open http://localhost:8080. Game data is persisted via a volume mount on `backend/data/WiiGames.json`.

### Local development

#### Backend
```
...\Wiipository> cd backend
...\Wiipository\backend> yarn start

```

#### Frontend
```
...\Wiipository> cd app
...\Wiipository\app> yarn run dev

```

The Vite dev server proxies `/api` requests to the backend on port 3001.