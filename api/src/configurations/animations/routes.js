import express from 'express';
import { requiredBodyCheck, requiredQueryCheck, validateRequest } from '../../middlewares/validateRequest.js';
import handlers from './handlers.js';

const router = express.Router();

router.get(
  '/',
  [requiredQueryCheck('descriptionName'), requiredQueryCheck('assembly'), validateRequest],
  handlers.findByDescriptionAndAssembly
);

router.post(
  '/',
  [
    requiredBodyCheck('descriptionName'),
    requiredBodyCheck('assembly'),
    requiredBodyCheck('animation'),
    validateRequest,
  ],
  handlers.saveItem
);

export default router;
