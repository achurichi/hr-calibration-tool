import express from 'express'
import {
	requiredBodyCheck,
	requiredQueryCheck,
	validateRequest,
} from '../middlewares/validateRequest.js'
import handlers from './handlers.js'

const router = express.Router()

router.get('/', [requiredQueryCheck('id'), validateRequest], handlers.findById)

router.post('/', [requiredBodyCheck('base64'), validateRequest], handlers.save)

export default router
