import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100 // limite di 100 richieste per IP
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date() });
});

// Proxy configuration
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  user: process.env.USER_SERVICE_URL || 'http://user-service:3002',
  video: process.env.VIDEO_SERVICE_URL || 'http://video-service:3003',
  streaming: process.env.STREAMING_SERVICE_URL || 'http://streaming-service:3004',
  recommendation: process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:3005'
};

// Proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
  onProxyReq: (proxyReq, req, res) => {
    // Forward CORS headers
    if (req.headers.origin) {
      proxyReq.setHeader('origin', req.headers.origin);
    }
  },
  onError: (err, req, res) => {
    logger.error('Auth service proxy error:', err);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

app.use('/api/users', createProxyMiddleware({
  target: services.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
  onError: (err, req, res) => {
    logger.error('User service proxy error:', err);
    res.status(503).json({ error: 'User service unavailable' });
  }
}));

app.use('/api/videos', createProxyMiddleware({
  target: services.video,
  changeOrigin: true,
  pathRewrite: { '^/api/videos': '' },
  onError: (err, req, res) => {
    logger.error('Video service proxy error:', err);
    res.status(503).json({ error: 'Video service unavailable' });
  }
}));

app.use('/api/streaming', createProxyMiddleware({
  target: services.streaming,
  changeOrigin: true,
  pathRewrite: { '^/api/streaming': '' },
  onError: (err, req, res) => {
    logger.error('Streaming service proxy error:', err);
    res.status(503).json({ error: 'Streaming service unavailable' });
  }
}));

app.use('/api/recommendations', createProxyMiddleware({
  target: services.recommendation,
  changeOrigin: true,
  pathRewrite: { '^/api/recommendations': '' },
  onError: (err, req, res) => {
    logger.error('Recommendation service proxy error:', err);
    res.status(503).json({ error: 'Recommendation service unavailable' });
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
