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
const isDevelopment = process.env.NODE_ENV !== 'production';

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (isDevelopment) {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));

// Rate limiting - more permissive in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // 1000 requests in dev, 100 in production
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Health check (before proxies, no body parsing needed)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date() });
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

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
  pathRewrite: { '^/api': '' },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`Proxying ${req.method} ${req.url} to ${services.auth}${req.url.replace('/api', '')}`);
    // Forward all headers including Origin
    if (req.headers.origin) {
      proxyReq.setHeader('Origin', req.headers.origin);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    logger.info(`Response from auth service: ${proxyRes.statusCode}`);
    // Ensure CORS headers are set
    const origin = req.headers.origin;
    if (origin && ['http://localhost:5173', 'http://localhost:3000'].includes(origin)) {
      proxyRes.headers['access-control-allow-origin'] = origin;
      proxyRes.headers['access-control-allow-credentials'] = 'true';
      proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization';
    }
  },
  onError: (err, req, res) => {
    logger.error('Auth service proxy error:', err);
    if (!res.headersSent) {
      res.status(503).json({ error: 'Auth service unavailable', details: err.message });
    }
  }
}));

app.use('/api/users', createProxyMiddleware({
  target: services.user,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onError: (err, req, res) => {
    logger.error('User service proxy error:', err);
    res.status(503).json({ error: 'User service unavailable' });
  }
}));

app.use('/api/videos', createProxyMiddleware({
  target: services.video,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onError: (err, req, res) => {
    logger.error('Video service proxy error:', err);
    res.status(503).json({ error: 'Video service unavailable' });
  }
}));

app.use('/api/streaming', createProxyMiddleware({
  target: services.streaming,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onError: (err, req, res) => {
    logger.error('Streaming service proxy error:', err);
    res.status(503).json({ error: 'Streaming service unavailable' });
  }
}));

app.use('/api/recommendations', createProxyMiddleware({
  target: services.recommendation,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
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
