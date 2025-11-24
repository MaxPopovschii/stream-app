import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import logger from './utils/logger';
import { initDatabase } from './db';
import { authenticateToken } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', authenticateToken, userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service', timestamp: new Date() });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`User Service running on port ${PORT}`);
  });
}).catch((error) => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});
