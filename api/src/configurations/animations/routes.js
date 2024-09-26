import express from 'express'
import {
	animationCheck,
	assemblyCheck,
	descriptionNameCheck,
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
	[descriptionNameCheck, assemblyCheck, animationCheck, validateRequest],
	handlers.save
)

export default router
