import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Watchlist routes
router.get('/watchlist', userController.getWatchlist);
router.post('/watchlist/:videoId', userController.addToWatchlist);
router.delete('/watchlist/:videoId', userController.removeFromWatchlist);

// Watch history routes
router.get('/history', userController.getWatchHistory);
router.post('/history/:videoId', userController.addToWatchHistory);

export default router;
