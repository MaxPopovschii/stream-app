import { Request, Response } from 'express';
import Video from '../models/video.model';
import logger from '../utils/logger';
import { redisClient } from '../utils/redis';

const CACHE_TTL = 3600; // 1 hour

export async function getVideos(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const cacheKey = `videos:page:${page}:limit:${limit}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Video.countDocuments();

    const result = {
      videos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    };

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    logger.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
}

export async function searchVideos(req: Request, res: Response) {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const videos = await Video.find({
      $text: { $search: q as string }
    })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    res.json({ videos, query: q });
  } catch (error) {
    logger.error('Search videos error:', error);
    res.status(500).json({ error: 'Failed to search videos' });
  }
}

export async function getVideosByGenre(req: Request, res: Response) {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const cacheKey = `videos:genre:${genre}:page:${page}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const videos = await Video.find({ genre: genre })
      .sort({ views: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify({ videos, genre }));

    res.json({ videos, genre });
  } catch (error) {
    logger.error('Get videos by genre error:', error);
    res.status(500).json({ error: 'Failed to get videos by genre' });
  }
}

export async function getTrendingVideos(req: Request, res: Response) {
  try {
    const { limit = 10 } = req.query;

    const cacheKey = `videos:trending:${limit}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const videos = await Video.find()
      .sort({ views: -1, likes: -1 })
      .limit(Number(limit))
      .select('-__v');

    await redisClient.setEx(cacheKey, 600, JSON.stringify({ videos })); // 10 min cache

    res.json({ videos });
  } catch (error) {
    logger.error('Get trending videos error:', error);
    res.status(500).json({ error: 'Failed to get trending videos' });
  }
}

export async function getVideoById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const cacheKey = `video:${id}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const video = await Video.findById(id).select('-__v');
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(video));

    res.json(video);
  } catch (error) {
    logger.error('Get video by id error:', error);
    res.status(500).json({ error: 'Failed to get video' });
  }
}

export async function createVideo(req: Request, res: Response) {
  try {
    const videoData = req.body;
    const video = new Video(videoData);
    await video.save();

    logger.info(`New video created: ${video.title}`);

    res.status(201).json(video);
  } catch (error) {
    logger.error('Create video error:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
}

export async function updateVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const video = await Video.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Invalidate cache
    await redisClient.del(`video:${id}`);

    res.json(video);
  } catch (error) {
    logger.error('Update video error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
}

export async function deleteVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Invalidate cache
    await redisClient.del(`video:${id}`);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    logger.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await redisClient.del(`video:${id}`);

    res.json({ views: video.views });
  } catch (error) {
    logger.error('Increment views error:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
}

export async function incrementLikes(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await redisClient.del(`video:${id}`);

    res.json({ likes: video.likes });
  } catch (error) {
    logger.error('Increment likes error:', error);
    res.status(500).json({ error: 'Failed to increment likes' });
  }
}
