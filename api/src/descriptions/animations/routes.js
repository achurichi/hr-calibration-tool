import express from 'express'
import {
	requiredBodyCheck,
	requiredQueryCheck,
	validateRequest,
} from '../../middlewares/validateRequest.js'
import handlers from './handlers.js'

const router = express.Router()

router.get(
	'/',
	[requiredQueryCheck('name'), validateRequest],
	handlers.findByName
)

router.post(
	'/',
	[
		requiredBodyCheck('descriptionName'),
		requiredBodyCheck('animation'),
		validateRequest,
	],
	handlers.saveItem
)

router.delete(
	'/',
	[
		requiredQueryCheck('descriptionName'),
		requiredQueryCheck('animationId'),
		validateRequest,
	],
	handlers.deleteItem
)

export default router