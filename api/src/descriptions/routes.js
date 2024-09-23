import express from 'express'
import animationsRouter from './animations/routes.js'
import motorsRouter from './motors/routes.js'
import handlers from './handlers.js'

const router = express.Router()

router.use('/animations', animationsRouter)
router.use('/motors', motorsRouter)

router.get('/allDescriptionNames', handlers.allDescriptionNames)
router.post('/namesByAssembly', handlers.namesByAssembly)

export default router
