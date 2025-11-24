import { Router } from 'express';
import * as streamingController from '../controllers/streaming.controller';

const router = Router();

router.get('/:videoId/manifest', streamingController.getManifest);
router.get('/:videoId/segment/:segmentId', streamingController.getSegment);
router.get('/:videoId/thumbnail', streamingController.getThumbnail);
router.post('/:videoId/quality', streamingController.setQuality);

export default router;
