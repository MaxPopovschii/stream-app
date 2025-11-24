import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import logger from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, { schema });

export async function initDatabase() {
  try {
    logger.info('Initializing database...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        display_name VARCHAR(100),
        avatar TEXT,
        bio TEXT,
        preferences JSON,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS watchlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        video_id VARCHAR(100) NOT NULL,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, video_id)
      );

      CREATE TABLE IF NOT EXISTS watch_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        video_id VARCHAR(100) NOT NULL,
        watched_at TIMESTAMP DEFAULT NOW(),
        duration VARCHAR(50),
        progress VARCHAR(50)
      );
    `);
    
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
}
