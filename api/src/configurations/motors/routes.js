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
  [requiredBodyCheck('descriptionName'), requiredBodyCheck('assembly'), requiredBodyCheck('motor'), validateRequest],
  handlers.saveItem
);

router.post('/addItems', [requiredBodyCheck('motorsMap'), validateRequest], handlers.addItems);

router.delete(
  '/',
  [requiredQueryCheck('assembly'), requiredQueryCheck('motorId'), validateRequest],
  handlers.deleteItem
);

export default router;
