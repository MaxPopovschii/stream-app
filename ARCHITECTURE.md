# StreamApp - Guida Architetturale

## Panoramica dell'Architettura

StreamApp utilizza un'architettura a microservizi che separa le responsabilità in servizi indipendenti e scalabili.

## Microservizi

### 1. API Gateway
**Responsabilità:**
- Punto di ingresso unico per tutte le richieste
- Routing delle richieste ai servizi appropriati
- Rate limiting e protezione DDoS
- CORS handling

**Tecnologie:**
- Express.js
- http-proxy-middleware
- Rate limiting middleware

**Pattern Implementati:**
- Gateway Pattern
- Circuit Breaker (da implementare)

### 2. Auth Service
**Responsabilità:**
- Autenticazione utenti
- Gestione token JWT
- Registrazione e login
- Password reset

**Database:** PostgreSQL
**Cache:** Redis (per token blacklist)

**Pattern Implementati:**
- JWT Authentication
- Password Hashing (bcrypt)
- Token Refresh Pattern

### 3. User Service
**Responsabilità:**
- Gestione profili utente
- Watchlist personale
- Cronologia visualizzazioni
- Preferenze utente

**Database:** PostgreSQL
**Cache:** Redis
**Messaging:** RabbitMQ (eventi utente)

**Pattern Implementati:**
- Event-Driven Architecture
- CQRS (Query e Command separation)

### 4. Video Service
**Responsabilità:**
- Catalogo video completo
- Ricerca e filtri
- Metadata management
- Trending e popolarità

**Database:** MongoDB (flessibilità schema)
**Cache:** Redis (cache query frequenti)

**Pattern Implementati:**
- Repository Pattern
- Cache-Aside Pattern
- Full-Text Search

### 5. Streaming Service
**Responsabilità:**
- Generazione manifest HLS/DASH
- Adaptive bitrate streaming
- Thumbnail generation
- Quality selection

**Cache:** Redis (manifest caching)

**Pattern Implementati:**
- Adaptive Streaming
- CDN Integration (da implementare)
- Lazy Loading

### 6. Recommendation Service
**Responsabilità:**
- Raccomandazioni personalizzate
- Content-based filtering
- Collaborative filtering
- Trending analysis

**Database:** MongoDB
**Cache:** Redis

**Pattern Implementati:**
- Recommendation Engine
- Collaborative Filtering
- Content-Based Filtering

## Comunicazione tra Servizi

### Sincrona (REST API)
- Frontend → API Gateway → Microservizi
- HTTP/HTTPS con JSON payload

### Asincrona (Message Queue)
- Eventi: user.created, video.watched, etc.
- RabbitMQ per event streaming
- Decoupling tra servizi

## Data Layer

### PostgreSQL
- Dati strutturati (utenti, profili)
- Transazioni ACID
- Relazioni complesse

### MongoDB
- Dati semi-strutturati (video, raccomandazioni)
- Scalabilità orizzontale
- Flessibilità schema

### Redis
- Cache per performance
- Session storage
- Rate limiting
- Token blacklist

### RabbitMQ
- Event streaming
- Async processing
- Service decoupling

## Scalabilità

### Orizzontale
- Ogni microservizio può scalare indipendentemente
- Load balancing con nginx/traefik
- Container orchestration con Kubernetes

### Verticale
- Database connection pooling
- Cache layers
- CDN per contenuti statici

## Sicurezza

### Autenticazione
- JWT tokens
- Refresh token rotation
- Token expiration

### Autorizzazione
- Role-based access control (RBAC)
- Service-to-service authentication

### Data Protection
- Password hashing (bcrypt)
- HTTPS/TLS encryption
- Input validation
- SQL injection prevention

## Monitoring & Logging

### Logging
- Winston per structured logging
- Centralized log aggregation
- Error tracking

### Monitoring
- Health check endpoints
- Metrics collection
- Performance monitoring

## Deployment

### Development
- Docker Compose
- Hot reload
- Local development

### Production
- Kubernetes
- Auto-scaling
- Rolling updates
- Blue-green deployment

## Best Practices

1. **Service Independence**: Ogni servizio ha il proprio database
2. **API Versioning**: Versioning delle API per backward compatibility
3. **Error Handling**: Gestione errori consistente
4. **Documentation**: OpenAPI/Swagger per documentazione API
5. **Testing**: Unit, integration, e2e tests
6. **CI/CD**: Automated build, test, deploy pipeline

## Future Enhancements

- GraphQL API Gateway
- Service Mesh (Istio)
- Advanced ML recommendations
- Real-time notifications (WebSocket)
- Video transcoding pipeline
- Advanced analytics
- Mobile apps (React Native)
