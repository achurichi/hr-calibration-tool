import express from 'express';
import { requiredBodyCheck, validateRequest } from '../middlewares/validateRequest.js';
import animationsRouter from './animations/routes.js';
import motorsRouter from './motors/routes.js';
import handlers from './handlers.js';

const router = express.Router();

router.use('/animations', animationsRouter);
router.use('/motors', motorsRouter);

router.post('/createMany', [requiredBodyCheck('items'), validateRequest], handlers.createMany);

export default router;
