import { Response } from 'express';
import { db } from '../db';
import { profiles, watchlist, watchHistory } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    
    if (!profile) {
      // Create default profile if doesn't exist
      const [newProfile] = await db.insert(profiles).values({
        userId,
        displayName: req.user?.email.split('@')[0] || 'User',
        preferences: {}
      }).returning();
      
      return res.json(newProfile);
    }

    res.json(profile);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { displayName, avatar, bio, preferences } = req.body;

    const [updated] = await db.update(profiles)
      .set({
        displayName,
        avatar,
        bio,
        preferences,
        updatedAt: new Date()
      })
      .where(eq(profiles.userId, userId))
      .returning();

    res.json(updated);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function getWatchlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const items = await db.select()
      .from(watchlist)
      .where(eq(watchlist.userId, userId))
      .orderBy(desc(watchlist.addedAt));

    res.json(items);
  } catch (error) {
    logger.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to get watchlist' });
  }
}

export async function addToWatchlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { videoId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [item] = await db.insert(watchlist)
      .values({ userId, videoId })
      .onConflictDoNothing()
      .returning();

    res.status(201).json(item || { message: 'Already in watchlist' });
  } catch (error) {
    logger.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
}

export async function removeFromWatchlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { videoId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.delete(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.videoId, videoId)
      ));

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    logger.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
}

export async function getWatchHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await db.select()
      .from(watchHistory)
      .where(eq(watchHistory.userId, userId))
      .orderBy(desc(watchHistory.watchedAt))
      .limit(50);

    res.json(history);
  } catch (error) {
    logger.error('Get watch history error:', error);
    res.status(500).json({ error: 'Failed to get watch history' });
  }
}

export async function addToWatchHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { videoId } = req.params;
    const { duration, progress } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [item] = await db.insert(watchHistory)
      .values({
        userId,
        videoId,
        duration: duration || '0',
        progress: progress || '0'
      })
      .returning();

    res.status(201).json(item);
  } catch (error) {
    logger.error('Add to watch history error:', error);
    res.status(500).json({ error: 'Failed to add to watch history' });
  }
}
