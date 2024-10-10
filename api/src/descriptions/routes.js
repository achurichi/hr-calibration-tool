import express from 'express';
import {
  customBodyCheck,
  validateRequest,
  requiredBodyCheck,
  requiredQueryCheck,
} from '../middlewares/validateRequest.js';
import animationsRouter from './animations/routes.js';
import motorsRouter from './motors/routes.js';
import handlers from './handlers.js';

const router = express.Router();

router.use('/animations', animationsRouter);
router.use('/motors', motorsRouter);

router.get('/allDescriptionNames', handlers.allDescriptionNames);

const assembliesCheckFn = (assemblies) => Array.isArray(assemblies) && assemblies.every((a) => typeof a === 'string');
router.post(
  '/namesByAssembly',
  [
    customBodyCheck('assemblies', assembliesCheckFn, 'assemblies is required and must be an array of strings'),
    validateRequest,
  ],
  handlers.namesByAssembly
);

router.post('/', [requiredBodyCheck('name'), validateRequest], handlers.create);

router.delete('/', [requiredQueryCheck('name'), validateRequest], handlers.deleteByName);

export default router;
