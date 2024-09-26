import express from 'express'
import {
	assemblyCheck,
	descriptionNameCheck,
	motorCheck,
} from '../../validators/checks.js'
import validateRequest from '../../middlewares/validateRequest.js'
import handlers from './handlers.js'

const router = express.Router()

router.get(
	'/',
	[descriptionNameCheck, assemblyCheck, validateRequest],
	handlers.findByDescriptionAndAssembly
)

router.post(
	'/',
	[descriptionNameCheck, assemblyCheck, motorCheck, validateRequest],
	handlers.save
)

export default router
