import { Router } from 'express';
import * as recommendationController from '../controllers/recommendation.controller';

const router = Router();

router.get('/personalized/:userId', recommendationController.getPersonalizedRecommendations);
router.get('/similar/:videoId', recommendationController.getSimilarVideos);
router.get('/trending', recommendationController.getTrendingRecommendations);
router.get('/genre/:genre', recommendationController.getGenreRecommendations);

export default router;
