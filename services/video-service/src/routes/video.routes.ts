import { Router } from 'express';
import * as videoController from '../controllers/video.controller';

const router = Router();

// Video routes
router.get('/', videoController.getVideos);
router.get('/search', videoController.searchVideos);
router.get('/genre/:genre', videoController.getVideosByGenre);
router.get('/trending', videoController.getTrendingVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', videoController.createVideo);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);
router.post('/:id/view', videoController.incrementViews);
router.post('/:id/like', videoController.incrementLikes);

export default router;
