# StreamApp - Clone Netflix con Architettura a Microservizi

![StreamApp](https://img.shields.io/badge/StreamApp-Microservices-red)
![License](https://img.shields.io/badge/license-MIT-blue)

Un clone di Netflix costruito con architettura a microservizi moderna, utilizzando Node.js, TypeScript, React, e Docker.

## 🎯 Caratteristiche

- **Architettura a Microservizi**: 6 servizi indipendenti e scalabili
- **Autenticazione JWT**: Sistema di autenticazione sicuro
- **Streaming Video**: Supporto per HLS/DASH streaming
- **Raccomandazioni**: Sistema di raccomandazioni basato su ML
- **UI Moderna**: Interfaccia utente personalizzata con React e Tailwind CSS
- **Containerizzata**: Completamente dockerizzata per facile deployment

## 🏗️ Architettura

```
┌─────────────────────────────────────────────────────────┐
│                      API Gateway                         │
│                     (Port 3000)                          │
└───────────┬─────────────────────────────────────────────┘
            │
    ┌───────┴────────┬──────────┬──────────┬──────────┬────────────┐
    │                │          │          │          │            │
┌───▼────┐  ┌───────▼──┐  ┌───▼────┐  ┌──▼─────┐  ┌─▼────────┐  ┌▼──────────┐
│  Auth  │  │   User   │  │ Video  │  │Stream  │  │Recommend │  │ Frontend  │
│Service │  │ Service  │  │Service │  │Service │  │ Service  │  │  (React)  │
│ :3001  │  │  :3002   │  │ :3003  │  │ :3004  │  │  :3005   │  │  :5173    │
└───┬────┘  └────┬─────┘  └───┬────┘  └───┬────┘  └────┬─────┘  └───────────┘
    │            │             │           │            │
    └────────────┴─────────────┴───────────┴────────────┘
                              │
              ┌───────────────┼──────────────┬───────────┐
              │               │              │           │
         ┌────▼────┐    ┌─────▼────┐   ┌────▼────┐  ┌──▼─────┐
         │PostgreSQL│    │ MongoDB  │   │  Redis  │  │RabbitMQ│
         └──────────┘    └──────────┘   └─────────┘  └────────┘
```

### Microservizi

1. **API Gateway** (Port 3000) - Routing, rate limiting, CORS
2. **Auth Service** (Port 3001) - Autenticazione JWT, registrazione, login
3. **User Service** (Port 3002) - Profili utente, watchlist, cronologia
4. **Video Service** (Port 3003) - Catalogo video, ricerca, trending
5. **Streaming Service** (Port 3004) - Gestione streaming HLS/DASH
6. **Recommendation Service** (Port 3005) - Raccomandazioni personalizzate

### Frontend

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Video Player**: React Player
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisiti

- Docker & Docker Compose
- Node.js 20+ (per sviluppo locale)
- Git

### Installazione

1. **Clone il repository**
```bash
git clone <your-repo-url>
cd stream-app
```

2. **Configura le variabili d'ambiente**
```bash
cp .env.example .env
# Modifica .env con le tue configurazioni
```

3. **Avvia tutti i servizi**
```bash
chmod +x start.sh
./start.sh
```

Oppure manualmente:
```bash
docker-compose up -d
```

4. **Accedi all'applicazione**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000

## 📁 Struttura del Progetto

```
stream-app/
├── services/
│   ├── api-gateway/         # Gateway + routing
│   ├── auth-service/        # Autenticazione
│   ├── user-service/        # Gestione utenti
│   ├── video-service/       # Catalogo video
│   ├── streaming-service/   # Streaming video
│   └── recommendation-service/ # Raccomandazioni
├── frontend/                # UI React
├── docker-compose.yml       # Orchestrazione Docker
├── start.sh                 # Script di avvio
├── stop.sh                  # Script di stop
├── status.sh                # Controllo status
└── README.md
```

## 🔌 API Endpoints

### Auth Service
```
POST   /api/auth/auth/register    - Registrazione
POST   /api/auth/auth/login       - Login
POST   /api/auth/auth/logout      - Logout
POST   /api/auth/auth/refresh     - Refresh token
```

### User Service
```
GET    /api/users/users/profile           - Profilo utente
PUT    /api/users/users/profile           - Aggiorna profilo
GET    /api/users/users/watchlist         - Watchlist
POST   /api/users/users/watchlist/:id     - Aggiungi a watchlist
DELETE /api/users/users/watchlist/:id     - Rimuovi da watchlist
GET    /api/users/users/history           - Cronologia
```

### Video Service
```
GET    /api/videos/videos              - Lista video
GET    /api/videos/videos/search       - Cerca video
GET    /api/videos/videos/:id          - Dettagli video
GET    /api/videos/videos/genre/:genre - Video per genere
GET    /api/videos/videos/trending     - Trending
```

### Recommendation Service
```
GET    /api/recommendations/recommendations/personalized/:userId
GET    /api/recommendations/recommendations/similar/:videoId
GET    /api/recommendations/recommendations/trending
```

## 🛠️ Tecnologie

**Backend:**
- Node.js, TypeScript, Express.js
- PostgreSQL, MongoDB, Redis, RabbitMQ
- JWT, bcrypt, Winston

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS, Zustand, React Router
- Axios, React Player

**DevOps:**
- Docker, Docker Compose

## 🔐 Sicurezza

- JWT Authentication
- Password hashing (bcrypt)
- CORS configurato
- Helmet.js security headers
- Rate limiting
- Input validation

## 📝 Scripts Utili

```bash
./start.sh    # Avvia tutti i servizi
./stop.sh     # Ferma tutti i servizi
./status.sh   # Controlla lo stato
./logs.sh [service-name]  # Visualizza i log
```

## 📊 Monitoraggio

- Health check: `GET /health` su ogni servizio
- RabbitMQ UI: http://localhost:15672 (user: streamapp, pass: streamapp123)
- Logs: `docker-compose logs -f [service]`

## 🚢 Deployment Produzione

1. Configura variabili d'ambiente sicure
2. Usa HTTPS/SSL
3. Implementa load balancing
4. Setup backup database
5. Monitoring e logging centralizzato

## 🤝 Contribuire

1. Fork il progetto
2. Crea feature branch
3. Commit modifiche
4. Push al branch
5. Apri Pull Request

## 📝 Licenza

MIT License - vedi [LICENSE](LICENSE)

## 📚 Documentazione Aggiuntiva

- [ARCHITECTURE.md](ARCHITECTURE.md) - Dettagli architetturali

---

Made with ❤️ using TypeScript, React, and Microservices